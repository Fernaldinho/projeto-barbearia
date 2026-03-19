import { useEffect, useState, useMemo } from 'react'
import { Plus, Search } from 'lucide-react'
import { useCompany } from '@/contexts/CompanyContext'
import { ClientsTable } from './ClientsTable'
import { ClientsForm } from './ClientsForm'
import { getClients, createClient, updateClient, deleteClient } from './clients.api'
import type { Client, ClientFormData } from '@/types'

export function ClientsPage() {
  const { company } = useCompany()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadClients = async () => {
    if (!company?.id) return
    try {
      const data = await getClients(company.id)
      setClients(data)
    } catch (err) {
      console.error('Error loading clients:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [company?.id])

  const handleCreate = async (data: ClientFormData) => {
    if (!company?.id) return
    await createClient(company.id, data)
    setShowForm(false)
    await loadClients()
  }

  const handleUpdate = async (data: ClientFormData) => {
    if (!editingClient || !company?.id) return
    await updateClient(company.id, editingClient.id, data)
    setEditingClient(null)
    await loadClients()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return
    await deleteClient(id)
    await loadClients()
  }

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients
    const lower = searchTerm.toLowerCase()
    return clients.filter(c => 
      c.name.toLowerCase().includes(lower) || 
      (c.phone && c.phone.replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')))
    )
  }, [clients, searchTerm])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-dark-300 mt-1">Gerencie sua base de clientes</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <Search className="w-5 h-5 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full sm:w-64 !bg-dark-800"
            />
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary whitespace-nowrap w-full sm:w-auto justify-center">
            <Plus className="w-5 h-5" />
            Novo Cliente
          </button>
        </div>
      </div>

      {loading ? (
        <div className="card p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <ClientsTable clients={filteredClients} onEdit={(c) => setEditingClient(c)} onDelete={handleDelete} />
      )}

      {showForm && <ClientsForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editingClient && <ClientsForm initialData={editingClient} onSubmit={handleUpdate} onClose={() => setEditingClient(null)} />}
    </div>
  )
}
