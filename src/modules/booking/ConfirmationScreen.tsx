import { CheckCircle2, Calendar, Clock, Scissors, MapPin, Users2 } from 'lucide-react'

interface ConfirmationScreenProps {
  companyName: string
  companyAddress?: string | null
  serviceName: string
  date: string
  startTime: string
  clientName: string
  staffName?: string
}

export function ConfirmationScreen({
  companyName,
  companyAddress,
  serviceName,
  date,
  startTime,
  clientName,
  staffName,
}: ConfirmationScreenProps) {
  const formatDate = (d: string) => {
    const dateObj = new Date(d + 'T12:00:00')
    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="text-center space-y-6">
      {/* Success animation */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce-slow">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-emerald-500/10 mx-auto animate-ping opacity-30" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Agendamento confirmado!</h2>
        <p className="text-gray-400">
          Olá <span className="text-white font-medium">{clientName}</span>, seu agendamento foi realizado com sucesso.
        </p>
      </div>

      {/* Details card */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 text-left space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Scissors className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Serviço</p>
            <p className="text-sm font-medium text-white">{serviceName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Data</p>
            <p className="text-sm font-medium text-white capitalize">{formatDate(date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Horário</p>
            <p className="text-sm font-medium text-white">{startTime}</p>
          </div>
        </div>

        {staffName && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Users2 className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Profissional</p>
              <p className="text-sm font-medium text-white">{staffName}</p>
            </div>
          </div>
        )}

        {companyAddress && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Local</p>
              <p className="text-sm font-medium text-white">{companyAddress}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
        <p className="text-xs text-amber-400/80">
          Agendamento realizado em <span className="font-semibold">{companyName}</span>. 
          Em caso de impossibilidade, entre em contato para cancelar ou remarcar.
        </p>
      </div>
    </div>
  )
}
