import { useEffect, useState } from 'react'
import { Plus, Users2, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { StaffForm } from './StaffForm'
import { getStaff, createStaff, updateStaff, toggleStaffActive, deleteStaff } from './staff.api'
import type { Staff, StaffFormData } from '@/types'

export function StaffPage() {
  const { company } = useCompany()
  const [staffList, setStaffList] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Staff | null>(null)

  const load = async () => {
    if (!company?.id) return
    try { setStaffList(await getStaff(company.id)) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [company?.id])

  const handleCreate = async (data: StaffFormData) => {
    if (!company?.id) return
    await createStaff(company.id, data)
    setShowForm(false)
    await load()
  }

  const handleUpdate = async (data: StaffFormData) => {
    if (!editing) return
    await updateStaff(editing.id, data)
    setEditing(null)
    await load()
  }

  const handleToggle = async (id: string, active: boolean) => {
    await toggleStaffActive(id, !active)
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este profissional? Os agendamentos vinculados não serão apagados.')) return
    await deleteStaff(id)
    await load()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-0">Equipe</h1>
          <p className="text-dark-300 mt-1">Gerencie os profissionais da sua empresa</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" /> Novo Profissional
        </button>
      </div>

      {/* Info */}
      <div className="card p-4 border-dark-700/30">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-info-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Users2 className="w-4 h-4 text-info-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Profissionais da equipe</p>
            <p className="text-xs text-dark-400 mt-1">
              Cada profissional pode ter seu próprio horário de trabalho e receber agendamentos individualmente.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : staffList.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mx-auto mb-4">
            <Users2 className="w-8 h-8 text-dark-500" />
          </div>
          <p className="text-dark-400 text-lg mb-2">Nenhum profissional</p>
          <p className="text-dark-500 text-sm">Adicione profissionais para começar a gerenciar agendamentos por pessoa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map((s) => (
            <div key={s.id} className={`card p-5 ${!s.active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 border border-primary-500/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-400">{s.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{s.name}</p>
                    {s.role && <p className="text-xs text-dark-400">{s.role}</p>}
                  </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${s.active ? 'bg-success-500/10 text-success-500' : 'bg-dark-700 text-dark-400'}`}>
                  {s.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-dark-700/30">
                <button onClick={() => setEditing(s)} className="p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white transition-all" title="Editar">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleToggle(s.id, s.active)} className="p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white transition-all" title={s.active ? 'Desativar' : 'Ativar'}>
                  {s.active ? <ToggleRight className="w-4 h-4 text-success-500" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-dark-400 hover:bg-danger-600/10 hover:text-danger-500 transition-all ml-auto" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <StaffForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editing && <StaffForm initialData={editing} onSubmit={handleUpdate} onClose={() => setEditing(null)} />}
    </div>
  )
}
