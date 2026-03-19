import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { DailyAppointmentsPoint } from './dashboard.api'
import { CalendarCheck } from 'lucide-react'

interface AppointmentsChartProps {
  data: DailyAppointmentsPoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-dark-400 mb-1.5">{label}</p>
      {payload.map((item: any) => (
        <p key={item.name} className="text-xs" style={{ color: item.color }}>
          <span className="font-medium">{item.name === 'completed' ? 'Concluídos' : item.name === 'cancelled' ? 'Cancelados' : 'Total'}: </span>
          {item.value}
        </p>
      ))}
    </div>
  )
}

export function AppointmentsChart({ data }: AppointmentsChartProps) {
  const totalAppts = data.reduce((sum, d) => sum + d.total, 0)

  return (
    <div className="card p-[24px]">
      <h3 className="!mb-[16px]">Agendamentos por dia</h3>

      <div className="h-[220px]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-dark-500 text-sm">
            Sem dados para o período
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#52527a' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#52527a' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" name="completed" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={24} />
              <Bar dataKey="cancelled" name="cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={24} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-success-500" />
          <span className="text-xs text-dark-400">Concluídos</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-danger-500 opacity-60" />
          <span className="text-xs text-dark-400">Cancelados</span>
        </div>
      </div>
    </div>
  )
}
