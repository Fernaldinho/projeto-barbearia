import { useEffect, useState } from 'react'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { AppointmentsList } from './AppointmentsList'
import { getAppointments, updateAppointmentStatus } from './appointments.api'
import type { Appointment } from '@/types'

export function AppointmentsPage() {
  const { company } = useCompany()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  const loadAppointments = async () => {
    if (!company?.id) return
    try {
      const data = await getAppointments(company.id, selectedDate)
      setAppointments(data)
    } catch (err) {
      console.error('Error loading appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    loadAppointments()
  }, [company?.id, selectedDate])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateAppointmentStatus(id, status)
      await loadAppointments()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const goPrevDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const goNextDay = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const goToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0])
  }

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
          <p className="text-dark-300 mt-1">Visualize e gerencie seus agendamentos</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          Novo Agendamento
        </button>
      </div>

      {/* Date navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button onClick={goPrevDay} className="p-2 rounded-xl text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={goToday} className="btn-secondary text-sm py-2">
            Hoje
          </button>
          <button onClick={goNextDay} className="p-2 rounded-xl text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-lg font-semibold text-white capitalize">
          {formatDisplayDate(selectedDate)}
        </p>
      </div>

      {/* Appointments list */}
      {loading ? (
        <div className="glass-card p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <AppointmentsList appointments={appointments} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}
