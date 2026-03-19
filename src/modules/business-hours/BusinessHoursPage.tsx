import { useEffect, useState } from 'react'
import { Clock, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { getBusinessHours, saveAllBusinessHours } from './business-hours.api'

const WEEKDAY_LABELS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

const WEEKDAY_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

interface DayConfig {
  weekday: number
  enabled: boolean
  start_time: string
  end_time: string
}

function getDefaultDays(): DayConfig[] {
  return Array.from({ length: 7 }, (_, i) => ({
    weekday: i,
    enabled: i >= 1 && i <= 5, // Mon-Fri enabled by default
    start_time: '09:00',
    end_time: '18:00',
  }))
}

export function BusinessHoursPage() {
  const { company } = useCompany()
  const [days, setDays] = useState<DayConfig[]>(getDefaultDays())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadBusinessHours()
  }, [company?.id])

  const loadBusinessHours = async () => {
    if (!company?.id) return
    try {
      const data = await getBusinessHours(company.id)
      const defaults = getDefaultDays()

      // Merge existing data with defaults
      const merged = defaults.map((d) => {
        const existing = data.find((bh) => bh.weekday === d.weekday)
        if (existing) {
          return {
            weekday: d.weekday,
            enabled: true,
            start_time: existing.start_time.slice(0, 5), // "HH:mm"
            end_time: existing.end_time.slice(0, 5),
          }
        }
        return { ...d, enabled: false }
      })

      setDays(merged)
    } catch (err) {
      console.error('Error loading business hours:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (weekday: number) => {
    setDays((prev) =>
      prev.map((d) => (d.weekday === weekday ? { ...d, enabled: !d.enabled } : d))
    )
    setSuccess(false)
  }

  const handleTimeChange = (weekday: number, field: 'start_time' | 'end_time', value: string) => {
    setDays((prev) =>
      prev.map((d) => (d.weekday === weekday ? { ...d, [field]: value } : d))
    )
    setSuccess(false)
  }

  const validate = (): string | null => {
    for (const day of days) {
      if (!day.enabled) continue
      if (day.start_time >= day.end_time) {
        return `${WEEKDAY_LABELS[day.weekday]}: o horário de abertura deve ser antes do horário de fechamento.`
      }
    }
    return null
  }

  const handleSave = async () => {
    if (!company?.id) return

    setError(null)
    setSuccess(false)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)
    try {
      await saveAllBusinessHours(company.id, days)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error saving business hours:', err)
      setError(err.message || 'Ocorreu um erro ao salvar os horários.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white">Horário de Funcionamento</h1>
          <p className="text-dark-300 mt-1">Defina os dias e horários de atendimento</p>
        </div>
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Horário de Funcionamento</h1>
          <p className="text-dark-300 mt-1">Defina os dias e horários de atendimento</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary whitespace-nowrap disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Salvando...' : 'Salvar horários'}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl flex items-center gap-3 text-danger-500 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p>Horários salvos com sucesso!</p>
        </div>
      )}

      {/* Days Grid */}
      <div className="space-y-3">
        {days.map((day) => (
          <div
            key={day.weekday}
            className={`card p-4 sm:p-5 transition-all duration-300 ${
              day.enabled
                ? 'border-primary-500/20 shadow-lg shadow-primary-500/5'
                : 'opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Day Label + Toggle */}
              <div className="flex items-center gap-4 sm:w-56 flex-shrink-0">
                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => handleToggle(day.weekday)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500" />
                </label>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                      day.enabled
                        ? 'bg-gradient-to-br from-primary-500/20 to-primary-700/20 border border-primary-500/10 text-primary-400'
                        : 'bg-dark-800 border border-dark-700 text-dark-500'
                    }`}
                  >
                    {WEEKDAY_SHORT[day.weekday]}
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${day.enabled ? 'text-white' : 'text-dark-400'}`}>
                      {WEEKDAY_LABELS[day.weekday]}
                    </p>
                    <p className={`text-xs ${day.enabled ? 'text-dark-300' : 'text-dark-500'}`}>
                      {day.enabled ? `${day.start_time} - ${day.end_time}` : 'Fechado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Pickers */}
              {day.enabled && (
                <div className="flex items-center gap-3 flex-1 animate-fade-in">
                  <div className="flex items-center gap-2 flex-1">
                    <Clock className="w-4 h-4 text-dark-400 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="block text-xs text-dark-400 mb-1">Abertura</label>
                      <input
                        type="time"
                        value={day.start_time}
                        onChange={(e) => handleTimeChange(day.weekday, 'start_time', e.target.value)}
                        className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <span className="text-dark-500 mt-5">até</span>

                  <div className="flex-1">
                    <label className="block text-xs text-dark-400 mb-1">Fechamento</label>
                    <input
                      type="time"
                      value={day.end_time}
                      onChange={(e) => handleTimeChange(day.weekday, 'end_time', e.target.value)}
                      className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>
              )}

              {/* Closed Badge */}
              {!day.enabled && (
                <div className="flex-1 flex items-center animate-fade-in">
                  <span className="px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg text-xs font-medium text-dark-500">
                    Fechado
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="card p-4 border-dark-700/30">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock className="w-4 h-4 text-primary-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Dica</p>
            <p className="text-xs text-dark-400 mt-1">
              Os horários definidos aqui serão usados para calcular os horários disponíveis
              para agendamento. Certifique-se de manter os horários atualizados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
