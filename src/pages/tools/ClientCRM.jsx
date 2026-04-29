import { useState } from 'react';
import { useClientCrmStore } from '../../store/clientCrmStore';
import { Users, Plus, Trash2, Mail, Phone, Building2, Search, Edit2, X } from 'lucide-react';

export default function ClientCRM() {
  const { clients, addClient, updateClient, deleteClient } = useClientCrmStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'active',
    notes: ''
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', status: 'active', notes: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (client) => {
    setEditingId(client.id);
    setFormData({
      name: client.name,
      contactPerson: client.contactPerson || '',
      email: client.email || '',
      phone: client.phone || '',
      status: client.status || 'active',
      notes: client.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    if (editingId) {
      updateClient(editingId, formData);
    } else {
      addClient(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="w-8 h-8 text-teal-500" /> Client CRM Lite
        </h1>
        <p className="text-muted-foreground">
          Manage your freelance clients and contact info offline.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients by name, email..."
            className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <button 
          onClick={openAddModal}
          className="w-full md:w-auto shrink-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0 pb-10">
        {filteredClients.length === 0 ? (
          <div className="p-8 text-center bg-card border border-border border-dashed rounded-xl text-muted-foreground">
            No clients found. Click "Add Client" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClients.map(client => (
              <div key={client.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${client.status === 'active' ? 'bg-green-500' : client.status === 'lead' ? 'bg-blue-500' : 'bg-slate-500'}`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      {client.name}
                    </h3>
                    {client.contactPerson && <p className="text-sm text-muted-foreground">{client.contactPerson}</p>}
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${client.status === 'active' ? 'bg-green-500/10 text-green-600' : client.status === 'lead' ? 'bg-blue-500/10 text-blue-600' : 'bg-slate-500/10 text-slate-600'}`}>
                    {client.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  {client.email && (
                    <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </a>
                  )}
                  {client.phone && (
                    <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span>{client.phone}</span>
                    </a>
                  )}
                  {client.notes && (
                    <p className="text-xs text-muted-foreground mt-4 line-clamp-3 bg-secondary/50 p-2 rounded border border-border/50">
                      {client.notes}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-border mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(client)} className="p-1.5 bg-secondary text-foreground hover:bg-primary/20 hover:text-primary rounded-md transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteClient(client.id)} className="p-1.5 bg-secondary text-foreground hover:bg-destructive/20 hover:text-destructive rounded-md transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Client' : 'Add New Client'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 rounded-md hover:bg-secondary text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Company / Client Name *</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Contact Person</label>
                  <input type="text" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Phone</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="lead">Lead / Prospect</option>
                  <option value="active">Active Client</option>
                  <option value="inactive">Inactive / Past</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" placeholder="Requirements, rates, meeting notes..." />
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-3 bg-secondary/20 rounded-b-xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                Cancel
              </button>
              <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Save Client
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
