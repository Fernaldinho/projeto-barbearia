import type { Client } from '@/types'
import { getInitials } from '@/utils/helpers'
import { Edit, Trash2, Phone, Mail } from 'lucide-react'

interface ClientsTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (id: string) => void
}

export function ClientsTable({ clients, onEdit, onDelete }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-dark-400 text-lg mb-2">Nenhum cliente cadastrado</p>
        <p className="text-dark-500 text-sm">Adicione seu primeiro cliente para começar.</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700 bg-dark-900">
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Cliente</th>
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Contato</th>
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Observações</th>
              <th className="text-right text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr 
                key={client.id} 
                className={`border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors ${index % 2 === 0 ? 'bg-dark-800' : 'bg-dark-800/80'}`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-400">{getInitials(client.name)}</span>
                    </div>
                    <span className="font-medium text-white">{client.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-dark-200 whitespace-nowrap">
                      <Phone className="w-3.5 h-3.5 text-dark-500" />
                      {client.phone}
                    </div>
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm text-dark-400 whitespace-nowrap">
                        <Mail className="w-3.5 h-3.5 text-dark-500" />
                        {client.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-dark-400 max-w-[200px] truncate block" title={client.notes || ''}>
                    {client.notes || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`https://wa.me/${client.phone?.replace(/\\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark-400 hover:text-success-500 transition-colors flex items-center justify-center p-2 rounded-lg hover:bg-dark-700 w-9 h-9"
                      title="Chamar no WhatsApp"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => onEdit(client)}
                      className="text-dark-400 hover:text-white transition-colors flex items-center justify-center p-2 rounded-lg hover:bg-dark-700 w-9 h-9"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(client.id)}
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
