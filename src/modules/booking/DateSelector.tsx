import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

interface DateSelectorProps {
  selectedDate: string
  onSelect: (date: string) => void
}

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTH_LABELS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
}

export function DateSelector({ selectedDate, onSelect }: DateSelectorProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = toDateStr(today)

  const [viewMonth, setViewMonth] = useState(
    selectedDate
      ? new Date(selectedDate + 'T12:00:00').getMonth()
      : today.getMonth()
  )
  const [viewYear, setViewYear] = useState(
    selectedDate
      ? new Date(selectedDate + 'T12:00:00').getFullYear()
      : today.getFullYear()
  )

  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1)
    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const days: { date: Date; dateStr: string; currentMonth: boolean }[] = []

    // Previous month padding
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth, -i)
      days.push({ date: d, dateStr: toDateStr(d), currentMonth: false })
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(viewYear, viewMonth, i)
      days.push({ date: d, dateStr: toDateStr(d), currentMonth: true })
    }

    // Next month padding
    const remaining = 7 - (days.length % 7)
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(viewYear, viewMonth + 1, i)
        days.push({ date: d, dateStr: toDateStr(d), currentMonth: false })
      }
    }

    return days
  }, [viewMonth, viewYear])

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
          <CalendarDays className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Escolha a data</h2>
        <p className="text-sm text-gray-400 mt-1">Selecione o dia do seu agendamento</p>
      </div>

      {/* Calendar */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={goPrevMonth} className="p-2 rounded-xl text-gray-400 hover:bg-gray-700 hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <p className="font-semibold text-white">
            {MONTH_LABELS[viewMonth]} {viewYear}
          </p>
          <button onClick={goNextMonth} className="p-2 rounded-xl text-gray-400 hover:bg-gray-700 hover:text-white transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="text-center text-xs font-semibold text-gray-500 py-1">
              {label}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ dateStr, currentMonth }, i) => {
            const isPast = dateStr < todayStr
            const isSelected = dateStr === selectedDate
            const isCurrentDay = dateStr === todayStr
            const disabled = isPast || !currentMonth

            return (
              <button
                key={i}
                onClick={() => !disabled && onSelect(dateStr)}
                disabled={disabled}
                className={`
                  aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200
                  ${disabled
                    ? 'text-gray-700 cursor-not-allowed'
                    : isSelected
                      ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30 scale-105'
                      : isCurrentDay
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                {new Date(dateStr + 'T12:00:00').getDate()}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
