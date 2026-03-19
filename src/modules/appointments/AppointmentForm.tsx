import { useState, useEffect, useCallback } from 'react'
import { X, AlertCircle, Search, Clock, User, Scissors, Loader2 } from 'lucide-react'
import type { Appointment, AppointmentFormData, Client, Service } from '@/types'
import type { TimeSlot } from '@/lib/availability'
import { getAvailableSlots } from '@/lib/availability'
import { getClients } from '@/modules/clients/clients.api'
import { getServices } from '@/modules/services/services.api'
import { useCompany } from '@/contexts/CompanyContext'
import { formatCurrency } from '@/utils/helpers'

interface AppointmentFormProps {
  initialData?: Appointment | null
  preselectedDate?: string
  preselectedTime?: string
  onSubmit: (data: AppointmentFormData, serviceDuration: number) => Promise<void>
  onClose: () => void
}

export function AppointmentForm({
  initialData,
  preselectedDate,
  preselectedTime,
  onSubmit,
  onClose,
}: AppointmentFormProps) {
  const { company } = useCompany()

  // Form state
  const [clientId, setClientId] = useState(initialData?.client_id || '')
  const [serviceId, setServiceId] = useState(initialData?.service_id || '')
  const [date, setDate] = useState(initialData?.date || preselectedDate || new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState(initialData?.start_time?.slice(0, 5) || preselectedTime || '')
  const [notes, setNotes] = useState(initialData?.notes || '')

  // Data state
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isDayClosed, setIsDayClosed] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSearch, setClientSearch] = useState('')

  // Load clients + services on mount
  useEffect(() => {
    if (!company?.id) return
    Promise.all([getClients(company.id), getServices(company.id)])
      .then(([c, s]) => {
        setClients(c)
        setServices(s.filter((svc) => svc.is_active))
      })
      .catch((err) => console.error('Error loading data:', err))
  }, [company?.id])

  // Load available slots when date or service changes
  const loadSlots = useCallback(async () => {
    if (!company?.id || !serviceId || !date) {
      setAvailableSlots([])
      return
    }
    setLoadingSlots(true)
    try {
      const result = await getAvailableSlots(company.id, date, serviceId)
      setIsDayClosed(!result.is_open)
      setAvailableSlots(result.slots)

      // If editing and the current start_time is not in available slots, keep it
      if (initialData && startTime && !result.slots.find((s) => s.start_time === startTime)) {
        // keep the current value for editing
      } else if (!startTime && result.slots.length > 0) {
        // auto-select first available slot if none selected
      }
    } catch (err) {
      console.error('Error loading slots:', err)
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [company?.id, serviceId, date])

  useEffect(() => {
    loadSlots()
  }, [loadSlots])

  const selectedService = services.find((s) => s.id === serviceId)

  const filteredClients = clientSearch
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
          (c.phone && c.phone.includes(clientSearch))
      )
    : clients

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!clientId) {
      setError('Selecione um cliente.')
      return
    }
    if (!serviceId) {
      setError('Selecione um serviço.')
      return
    }
    if (!date) {
      setError('Selecione uma data.')
      return
    }
    if (!startTime) {
      setError('Selecione um horário.')
      return
    }

    setLoading(true)
    try {
      await onSubmit(
        { client_id: clientId, service_id: serviceId, date, start_time: startTime, notes },
        selectedService?.duration || 30
      )
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erro ao salvar o agendamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto py-8">
      <div className="glass-card w-full max-w-2xl p-6 mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger-500/10 border border-danger-500/20 rounded-lg flex items-center gap-2 text-danger-500 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              <User className="w-4 h-4 inline mr-1.5" />
              Cliente
            </label>
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors w-full text-sm"
              />
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1 rounded-lg border border-dark-700 bg-dark-800 p-1">
              {filteredClients.length === 0 ? (
                <p className="text-xs text-dark-500 text-center py-2">Nenhum cliente encontrado</p>
              ) : (
                filteredClients.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { setClientId(c.id); setClientSearch(''); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      clientId === c.id
                        ? 'bg-primary-500/10 text-primary-400 font-medium'
                        : 'text-dark-200 hover:bg-dark-700'
                    }`}
                  >
                    <span className="font-medium">{c.name}</span>
                    {c.phone && <span className="text-dark-400 ml-2 text-xs">{c.phone}</span>}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              <Scissors className="w-4 h-4 inline mr-1.5" />
              Serviço
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {services.map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => { setServiceId(svc.id); setStartTime(''); }}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    serviceId === svc.id
                      ? 'border-primary-500/30 bg-primary-500/10 shadow-lg shadow-primary-500/5'
                      : 'border-dark-700 bg-dark-800 hover:border-dark-600'
                  }`}
                >
                  <p className={`font-medium text-sm ${serviceId === svc.id ? 'text-primary-400' : 'text-white'}`}>
                    {svc.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-dark-400">{svc.duration}min</span>
                    <span className="text-xs text-primary-400 font-medium">{formatCurrency(svc.price)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="appt-date" className="block text-sm font-medium text-dark-200 mb-2">
              Data
            </label>
            <input
              id="appt-date"
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setStartTime(''); }}
              min={new Date().toISOString().split('T')[0]}
              className="input-field [color-scheme:dark]"
              required
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              <Clock className="w-4 h-4 inline mr-1.5" />
              Horário disponível
            </label>

            {!serviceId ? (
              <p className="text-xs text-dark-500 italic">Selecione um serviço para ver os horários.</p>
            ) : loadingSlots ? (
              <div className="flex items-center gap-2 text-dark-400 text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando horários...
              </div>
            ) : isDayClosed ? (
              <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl text-center">
                <p className="text-dark-400 text-sm">Estabelecimento fechado neste dia.</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-4 bg-dark-800 border border-dark-700 rounded-xl text-center">
                <p className="text-dark-400 text-sm">Nenhum horário disponível nesta data.</p>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.start_time}
                    type="button"
                    onClick={() => setStartTime(slot.start_time)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      startTime === slot.start_time
                        ? 'bg-primary-500 text-dark-950 shadow-lg shadow-primary-500/30'
                        : 'bg-dark-800 border border-dark-700 text-dark-200 hover:border-primary-500/30 hover:text-white'
                    }`}
                  >
                    {slot.start_time}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="appt-notes" className="block text-sm font-medium text-dark-200 mb-2">
              Observações (opcional)
            </label>
            <textarea
              id="appt-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações sobre o agendamento..."
              className="input-field resize-none h-16"
            />
          </div>

          {/* Summary */}
          {clientId && serviceId && date && startTime && selectedService && (
            <div className="p-4 bg-primary-500/5 border border-primary-500/10 rounded-xl">
              <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">Resumo</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-dark-400">Cliente: </span>
                  <span className="text-white">{clients.find((c) => c.id === clientId)?.name}</span>
                </div>
                <div>
                  <span className="text-dark-400">Serviço: </span>
                  <span className="text-white">{selectedService.name}</span>
                </div>
                <div>
                  <span className="text-dark-400">Data: </span>
                  <span className="text-white">
                    {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div>
                  <span className="text-dark-400">Horário: </span>
                  <span className="text-white">{startTime}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-50">
              {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
