import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
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
    if (!editingClient) return
    await updateClient(editingClient.id, data)
    setEditingClient(null)
    await loadClients()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return
    await deleteClient(id)
    await loadClients()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-dark-300 mt-1">Gerencie sua base de clientes</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-5 h-5" />
          Novo Cliente
        </button>
      </div>

      {loading ? (
        <div className="glass-card p-8 text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <ClientsTable clients={clients} onEdit={(c) => setEditingClient(c)} onDelete={handleDelete} />
      )}

      {showForm && <ClientsForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
      {editingClient && <ClientsForm initialData={editingClient} onSubmit={handleUpdate} onClose={() => setEditingClient(null)} />}
    </div>
  )
}
