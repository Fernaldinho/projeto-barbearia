import type { Service } from '@/types'
import { formatCurrency } from '@/utils/helpers'
import { Edit, Trash2, Clock } from 'lucide-react'

interface ServicesTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export function ServicesTable({ services, onEdit, onDelete }: ServicesTableProps) {
  if (services.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-dark-400 text-lg mb-2">Nenhum serviço cadastrado</p>
        <p className="text-dark-500 text-sm">Adicione seu primeiro serviço para começar.</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700 bg-dark-900">
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Serviço</th>
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Duração</th>
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Preço</th>
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Status</th>
              <th className="text-right text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr 
                key={service.id} 
                className={`border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors ${index % 2 === 0 ? 'bg-dark-800' : 'bg-dark-800/80'}`}
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-white">{service.name}</p>
                    {service.description && (
                      <p className="text-sm text-dark-400 mt-0.5">{service.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-dark-200 text-sm whitespace-nowrap">
                    <Clock className="w-4 h-4 text-dark-500" />
                    {service.duration} min
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-primary-400 text-sm whitespace-nowrap">{formatCurrency(service.price)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                    service.is_active
                      ? 'bg-success-500/10 text-success-500 border border-success-500/20'
                      : 'bg-dark-600 text-dark-400 border border-dark-500'
                  }`}>
                    {service.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(service)}
                      className="text-dark-400 hover:text-white transition-colors flex items-center justify-center p-2 rounded-lg hover:bg-dark-700 w-9 h-9"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(service.id)}
                      className="text-dark-400 hover:text-danger-500 transition-colors flex items-center justify-center p-2 rounded-lg hover:bg-dark-700 w-9 h-9"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
