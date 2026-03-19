import { useEffect, useState, useCallback } from 'react'
import { Plus, ChevronLeft, ChevronRight, Calendar, List, Users2 } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { AppointmentCalendar } from './AppointmentCalendar'
import { AppointmentsList } from './AppointmentsList'
import { AppointmentForm } from './AppointmentForm'
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
} from './appointments.api'
import { getActiveStaff } from '@/modules/staff/staff.api'
import { supabase } from '@/lib/supabase'
import type { Appointment, AppointmentFormData, Staff } from '@/types'

type ViewMode = 'calendar' | 'list'

export function AppointmentsPage() {
  const { company } = useCompany()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [selectedStaffId, setSelectedStaffId] = useState<string>('')

  // Modal state
  const [showForm, setShowForm] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [preselectedTime, setPreselectedTime] = useState<string | undefined>()

  // Business hours for calendar bounds
  const [businessStart, setBusinessStart] = useState('08:00')
  const [businessEnd, setBusinessEnd] = useState('20:00')

  // Load staff list
  useEffect(() => {
    if (!company?.id) return
    getActiveStaff(company.id).then(setStaffList).catch(console.error)
  }, [company?.id])

  const loadAppointments = useCallback(async () => {
    if (!company?.id) return
    try {
      const data = await getAppointments(company.id, selectedDate, selectedStaffId || undefined)
      setAppointments(data)
    } catch (err) {
      console.error('Error loading appointments:', err)
    } finally {
      setLoading(false)
    }
  }, [company?.id, selectedDate, selectedStaffId])

  const loadBusinessHoursForDate = useCallback(async () => {
    if (!company?.id) return
    const dateObj = new Date(selectedDate + 'T12:00:00')
    const weekday = dateObj.getDay()

    const { data } = await supabase
      .from('business_hours')
      .select('start_time, end_time')
      .eq('company_id', company.id)
      .eq('weekday', weekday)
      .is('staff_id', null)
      .maybeSingle()

    if (data) {
      setBusinessStart(data.start_time.slice(0, 5))
      setBusinessEnd(data.end_time.slice(0, 5))
    } else {
      setBusinessStart('08:00')
      setBusinessEnd('20:00')
    }
  }, [company?.id, selectedDate])

  useEffect(() => {
    setLoading(true)
    loadAppointments()
    loadBusinessHoursForDate()
  }, [loadAppointments, loadBusinessHoursForDate])

  const handleCreate = async (data: AppointmentFormData, serviceDuration: number) => {
    if (!company?.id) return
    await createAppointment(company.id, data, serviceDuration)
    setShowForm(false)
    setPreselectedTime(undefined)
    await loadAppointments()
  }

  const handleUpdate = async (data: AppointmentFormData, serviceDuration: number) => {
    if (!editingAppointment || !company?.id) return
    await updateAppointment(company.id, editingAppointment.id, data, serviceDuration)
    setEditingAppointment(null)
    await loadAppointments()
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateAppointmentStatus(id, status)
      await loadAppointments()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handleCalendarSlotClick = (time: string) => {
    setPreselectedTime(time)
    setShowForm(true)
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setEditingAppointment(appointment)
  }

  // Navigation
  const goPrevDay = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }
  const goNextDay = () => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().split('T')[0])
  }
  const goToday = () => setSelectedDate(new Date().toISOString().split('T')[0])

  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
          <p className="text-dark-300 mt-1">Visualize e gerencie seus agendamentos</p>
        </div>
        <button onClick={() => { setPreselectedTime(undefined); setShowForm(true) }} className="btn-primary w-full sm:w-auto justify-center whitespace-nowrap">
          <Plus className="w-5 h-5" /> Novo Agendamento
        </button>
      </div>

      {/* Controls bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Date navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={goPrevDay} className="p-2 rounded-xl text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={goToday} className={`btn-secondary text-sm py-2 ${isToday ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : ''}`}>
              Hoje
            </button>
            <button onClick={goNextDay} className="p-2 rounded-xl text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm sm:text-base font-semibold text-white capitalize">
            {formatDisplayDate(selectedDate)}
          </p>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Staff filter */}
          {staffList.length > 0 && (
            <div className="flex items-center gap-2 bg-dark-800 rounded-xl p-1 border border-dark-700">
              <Users2 className="w-4 h-4 text-dark-400 ml-2" />
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="bg-transparent text-sm text-dark-200 py-2 pr-3 outline-none appearance-none cursor-pointer"
              >
                <option value="">Todos</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* View toggle */}
          <div className="flex items-center bg-dark-800 rounded-xl p-1 border border-dark-700">
            <button onClick={() => setViewMode('calendar')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-primary-500/10 text-primary-400' : 'text-dark-400 hover:text-white'}`}>
              <Calendar className="w-4 h-4" /> Calendário
            </button>
            <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-primary-500/10 text-primary-400' : 'text-dark-400 hover:text-white'}`}>
              <List className="w-4 h-4" /> Lista
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: appointments.length, color: 'text-white' },
          { label: 'Agendados', value: appointments.filter((a) => a.status === 'scheduled').length, color: 'text-blue-400' },
          { label: 'Confirmados', value: appointments.filter((a) => a.status === 'confirmed').length, color: 'text-primary-400' },
          { label: 'Concluídos', value: appointments.filter((a) => a.status === 'completed').length, color: 'text-emerald-400' },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-dark-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : viewMode === 'calendar' ? (
        <AppointmentCalendar
          appointments={appointments}
          businessStart={businessStart}
          businessEnd={businessEnd}
          onSlotClick={handleCalendarSlotClick}
          onAppointmentClick={handleAppointmentClick}
        />
      ) : (
        <AppointmentsList
          appointments={appointments}
          onStatusChange={handleStatusChange}
          onEdit={handleAppointmentClick}
        />
      )}

      {/* Create Modal */}
      {showForm && (
        <AppointmentForm
          preselectedDate={selectedDate}
          preselectedTime={preselectedTime}
          preselectedStaffId={selectedStaffId || undefined}
          onSubmit={handleCreate}
          onClose={() => { setShowForm(false); setPreselectedTime(undefined) }}
        />
      )}

      {/* Edit Modal */}
      {editingAppointment && (
        <AppointmentForm
          initialData={editingAppointment}
          onSubmit={handleUpdate}
          onClose={() => setEditingAppointment(null)}
        />
      )}
    </div>
  )
}
