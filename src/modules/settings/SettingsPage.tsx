import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCompany } from '@/contexts/CompanyContext'
import { Building2, User, Bell, Shield, Palette } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'company', label: 'Empresa', icon: Building2 },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'security', label: 'Segurança', icon: Shield },
  { id: 'appearance', label: 'Aparência', icon: Palette },
]

export function SettingsPage() {
  const { user } = useAuth()
  const { company } = useCompany()
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-dark-300 mt-1">Gerencie as configurações da sua conta e empresa</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-60 flex-shrink-0">
          <div className="card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-xl font-bold text-white">Perfil</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Nome</label>
                  <input
                    type="text"
                    defaultValue={user?.user_metadata?.full_name || ''}
                    className="input-field"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="input-field"
                    disabled
                  />
                  <p className="text-xs text-dark-500 mt-1">O email não pode ser alterado</p>
                </div>
                <button className="btn-primary">Salvar alterações</button>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-xl font-bold text-white">Empresa</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Nome da Barbearia</label>
                  <input type="text" defaultValue={company?.name || ''} className="input-field" placeholder="Nome da sua barbearia" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Telefone</label>
                  <input type="tel" defaultValue={company?.phone || ''} className="input-field" placeholder="(00) 00000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Endereço</label>
                  <input type="text" defaultValue={company?.address || ''} className="input-field" placeholder="Endereço completo" />
                </div>
                <button className="btn-primary">Salvar alterações</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Notificações</h2>
              <div className="space-y-4">
                {['Novos agendamentos', 'Cancelamentos', 'Lembretes', 'Relatórios semanais'].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-dark-800">
                    <span className="text-sm text-dark-200">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-6">
              <h2 className="text-xl font-bold text-white">Segurança</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Senha atual</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Nova senha</label>
                  <input type="password" className="input-field" placeholder="Mínimo 6 caracteres" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">Confirmar nova senha</label>
                  <input type="password" className="input-field" placeholder="Repita a nova senha" />
                </div>
                <button className="btn-primary">Alterar senha</button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-6">Aparência</h2>
              <p className="text-dark-400 text-sm">Opções de personalização estarão disponíveis em breve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
