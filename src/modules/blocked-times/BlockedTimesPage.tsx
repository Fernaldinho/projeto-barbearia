import { useEffect, useState, useMemo } from 'react'
import { Plus, Search, CalendarOff } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { BlockedTimesTable } from './BlockedTimesTable'
import { BlockedTimesForm } from './BlockedTimesForm'
import {
  getBlockedTimes,
  createBlockedTime,
  updateBlockedTime,
  deleteBlockedTime,
} from './blocked-times.api'
import type { BlockedTime } from '@/types'
import type { BlockedTimeFormData } from './blocked-times.api'

export function BlockedTimesPage() {
  const { company } = useCompany()
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<BlockedTime | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadBlockedTimes = async () => {
    if (!company?.id) return
    try {
      const data = await getBlockedTimes(company.id)
      setBlockedTimes(data)
    } catch (err) {
      console.error('Error loading blocked times:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlockedTimes()
  }, [company?.id])

  const handleCreate = async (data: BlockedTimeFormData) => {
    if (!company?.id) return
    await createBlockedTime(company.id, data)
    setShowForm(false)
    await loadBlockedTimes()
  }

  const handleUpdate = async (data: BlockedTimeFormData) => {
    if (!editingItem || !company?.id) return
    await updateBlockedTime(company.id, editingItem.id, data)
    setEditingItem(null)
    await loadBlockedTimes()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este bloqueio?')) return
    await deleteBlockedTime(id)
    await loadBlockedTimes()
  }

  const filteredItems = useMemo(() => {
    if (!searchTerm) return blockedTimes
    const lower = searchTerm.toLowerCase()
    return blockedTimes.filter(
      (item) =>
        item.date.includes(searchTerm) ||
        (item.reason && item.reason.toLowerCase().includes(lower))
    )
  }, [blockedTimes, searchTerm])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Bloqueios de Horário</h1>
          <p className="text-dark-300 mt-1">Gerencie os horários bloqueados para agendamento</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="w-5 h-5 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por data ou motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full sm:w-64 !bg-dark-800"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Novo Bloqueio
          </button>
        </div>
      </div>

      {/* Info card */}
      <div className="card p-4 border-dark-700/30">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-danger-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CalendarOff className="w-4 h-4 text-danger-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Sobre os bloqueios</p>
            <p className="text-xs text-dark-400 mt-1">
              Bloqueios impedem que clientes agendem nos horários definidos. Use para feriados,
              almoço, compromissos pessoais ou qualquer indisponibilidade.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <BlockedTimesTable
          blockedTimes={filteredItems}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      {showForm && (
        <BlockedTimesForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}
      {editingItem && (
        <BlockedTimesForm
          initialData={editingItem}
          onSubmit={handleUpdate}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  )
}
