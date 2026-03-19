import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react'

import { getCompanyBySlug, getActiveServices, findOrCreateClient, createPublicBooking } from './booking.api'
import { getActiveStaff } from '@/modules/staff/staff.api'
import { getAvailableSlots } from '@/lib/availability'
import type { Company, Service, Staff } from '@/types'
import type { TimeSlot } from '@/lib/availability'

import { ServiceSelector } from './ServiceSelector'
import { StaffSelector } from './StaffSelector'
import { DateSelector } from './DateSelector'
import { TimeSelector } from './TimeSelector'
import { ClientForm } from './ClientForm'
import { ConfirmationScreen } from './ConfirmationScreen'

type BookingStep = 'service' | 'staff' | 'date' | 'time' | 'client' | 'confirmation'

const STEP_ORDER: BookingStep[] = ['service', 'staff', 'date', 'time', 'client', 'confirmation']

export function BookingPage() {
  const { slug } = useParams<{ slug: string }>()

  // Data
  const [company, setCompany] = useState<Company | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [isDayClosed, setIsDayClosed] = useState(false)

  // Selection state
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [staffSelected, setStaffSelected] = useState(false) // tracks if user made a choice (even "any")
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')

  // UI state
  const [step, setStep] = useState<BookingStep>('service')
  const [pageLoading, setPageLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  // Determine actual step order based on staff availability
  const hasStaff = staffList.length > 0
  const activeSteps = hasStaff ? STEP_ORDER : STEP_ORDER.filter((s) => s !== 'staff')

  useEffect(() => {
    if (!slug) return
    loadCompany()
  }, [slug])

  const loadCompany = async () => {
    try {
      const comp = await getCompanyBySlug(slug!)
      if (!comp) {
        setNotFound(true)
        setPageLoading(false)
        return
      }
      setCompany(comp)
      const [svcs, staff] = await Promise.all([
        getActiveServices(comp.id),
        getActiveStaff(comp.id),
      ])
      setServices(svcs)
      setStaffList(staff)
    } catch (err) {
      console.error('Error loading company:', err)
      setNotFound(true)
    } finally {
      setPageLoading(false)
    }
  }

  const loadSlots = useCallback(async () => {
    if (!company?.id || !selectedService || !selectedDate) return
    setSlotsLoading(true)
    try {
      const result = await getAvailableSlots(
        company.id, selectedDate, selectedService.id,
        selectedStaff?.id
      )
      setIsDayClosed(!result.is_open)
      setAvailableSlots(result.slots)
    } catch (err) {
      console.error('Error loading slots:', err)
      setAvailableSlots([])
    } finally {
      setSlotsLoading(false)
    }
  }, [company?.id, selectedService?.id, selectedDate, selectedStaff?.id])

  useEffect(() => {
    if (step === 'time') loadSlots()
  }, [step, loadSlots])

  // Step navigation using the active steps array
  const currentStepIndex = activeSteps.indexOf(step)

  const goBack = () => {
    if (currentStepIndex > 0) setStep(activeSteps[currentStepIndex - 1])
  }
  const goNext = () => {
    if (currentStepIndex < activeSteps.length - 1) setStep(activeSteps[currentStepIndex + 1])
  }

  // Handlers
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setSelectedTime(null)
    goNext()
  }

  const handleStaffSelect = (staff: Staff | null) => {
    setSelectedStaff(staff)
    setStaffSelected(true)
    setSelectedTime(null)
    goNext()
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null)
    goNext()
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    goNext()
  }

  const handleClientSubmit = async (data: { name: string; phone: string; email: string }) => {
    if (!company || !selectedService || !selectedDate || !selectedTime) return

    setBookingLoading(true)
    setError(null)

    try {
      const clientId = await findOrCreateClient(company.id, data.name, data.phone, data.email)
      await createPublicBooking(
        company.id, clientId, selectedService.id, selectedDate,
        selectedTime, selectedService.duration, selectedStaff?.id
      )
      setClientName(data.name)
      setStep('confirmation')
    } catch (err: any) {
      console.error('Booking error:', err)
      setError(err.message || 'Ocorreu um erro ao confirmar o agendamento.')
    } finally {
      setBookingLoading(false)
    }
  }

  // ============================================
  // Render
  // ============================================

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <p className="text-gray-400 text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (notFound || !company) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Página não encontrada</h1>
          <p className="text-gray-400 text-sm">O estabelecimento que você procura não existe ou está indisponível.</p>
        </div>
      </div>
    )
  }

  const stepsWithoutConfirmation = activeSteps.filter((s) => s !== 'confirmation')

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          {step !== 'service' && step !== 'confirmation' && (
            <button onClick={goBack} className="p-2 -ml-2 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-gray-900" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white text-sm truncate">{company.name}</p>
              <p className="text-xs text-gray-500">Agendamento online</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      {step !== 'confirmation' && (
        <div className="max-w-lg mx-auto px-4 pt-4">
          <div className="flex items-center gap-1">
            {stepsWithoutConfirmation.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= currentStepIndex ? 'bg-amber-500' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Passo {currentStepIndex + 1} de {stepsWithoutConfirmation.length}
          </p>
        </div>
      )}

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {step === 'service' && (
          <ServiceSelector services={services} selectedId={selectedService?.id || null} onSelect={handleServiceSelect} />
        )}

        {step === 'staff' && (
          <StaffSelector staff={staffList} selectedId={staffSelected ? (selectedStaff?.id || null) : undefined as any} onSelect={handleStaffSelect} />
        )}

        {step === 'date' && (
          <DateSelector selectedDate={selectedDate} onSelect={handleDateSelect} />
        )}

        {step === 'time' && (
          <TimeSelector slots={availableSlots} selectedTime={selectedTime} loading={slotsLoading} isDayClosed={isDayClosed} onSelect={handleTimeSelect} />
        )}

        {step === 'client' && (
          <>
            <div className="mb-6 p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  {selectedService?.name}
                  {selectedStaff ? ` · ${selectedStaff.name}` : ''}
                  {' · '}{new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                  {' · '}{selectedTime}
                </span>
                <button onClick={() => setStep('service')} className="text-amber-400 hover:text-amber-300 font-medium">Alterar</button>
              </div>
            </div>
            <ClientForm onSubmit={handleClientSubmit} loading={bookingLoading} error={error} />
          </>
        )}

        {step === 'confirmation' && (
          <ConfirmationScreen
            companyName={company.name}
            companyAddress={company.address}
            serviceName={selectedService?.name || ''}
            date={selectedDate}
            startTime={selectedTime || ''}
            clientName={clientName}
            staffName={selectedStaff?.name}
          />
        )}
      </main>

      <footer className="max-w-lg mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-600">
          Powered by <span className="font-semibold text-gray-500">BarberPro</span>
        </p>
      </footer>
    </div>
  )
}
