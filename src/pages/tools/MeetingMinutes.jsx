import { useState, useRef } from 'react';
import { useMeetingStore } from '../../store/meetingStore';
import { Calendar, Plus, Trash2, Printer, Copy, CheckCircle2, FileText } from 'lucide-react';

export default function MeetingMinutes() {
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useMeetingStore();
  const [currentId, setCurrentId] = useState('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef();

  const [formData, setFormData] = useState({
    title: '',
    attendees: '',
    agenda: '',
    notes: '',
    actionItems: ''
  });

  const loadMeeting = (meeting) => {
    setCurrentId(meeting.id);
    setFormData({
      title: meeting.title,
      attendees: meeting.attendees,
      agenda: meeting.agenda,
      notes: meeting.notes,
      actionItems: meeting.actionItems
    });
  };

  const handleNew = () => {
    setCurrentId('');
    setFormData({ title: '', attendees: '', agenda: '', notes: '', actionItems: '' });
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    if (currentId) {
      updateMeeting(currentId, formData);
    } else {
      addMeeting(formData);
      // Let it trigger a re-render and generate an ID, but for simplicity we won't strictly bind the new ID immediately
      // A better way would be to let the store return the ID, but Zustand set doesn't return.
      // For MVP this is fine.
      handleNew(); // Just clear it for the next one
    }
  };

  const getExportText = () => {
    return `MEETING MINUTES: ${formData.title.toUpperCase()}\nDate: ${new Date().toLocaleDateString()}\n\nATTENDEES:\n${formData.attendees}\n\nAGENDA:\n${formData.agenda}\n\nNOTES:\n${formData.notes}\n\nACTION ITEMS:\n${formData.actionItems}`;
  };

  const handleCopy = async () => {
    if (!formData.title) return;
    try {
      await navigator.clipboard.writeText(getExportText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex flex-col gap-2 shrink-0 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="w-8 h-8 text-yellow-500" /> Meeting Minutes Manager
        </h1>
        <p className="text-muted-foreground">
          Take organized notes and track action items from your meetings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Sidebar Meetings */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden print:hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <h2 className="font-semibold">Recent Meetings</h2>
            <button onClick={handleNew} className="text-primary hover:text-primary/80 text-sm font-medium">
              New
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {meetings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center p-4">No meetings saved.</p>
            ) : (
              meetings.map(meeting => (
                <div 
                  key={meeting.id} 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors group flex flex-col gap-1 ${currentId === meeting.id ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent hover:bg-secondary/50'}`}
                  onClick={() => loadMeeting(meeting)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm truncate pr-2">{meeting.title}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteMeeting(meeting.id); if(currentId===meeting.id) handleNew(); }}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(meeting.date).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden print:hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Meeting Title (e.g. Q3 Planning)"
                className="flex-1 min-w-[200px] h-10 rounded-md border border-input bg-background px-3 py-1 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
                  <Plus className="w-4 h-4" /> Save
                </button>
                <button onClick={handleCopy} disabled={!formData.title} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-secondary rounded-md transition-colors disabled:opacity-50">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} Copy TXT
                </button>
                <button onClick={handlePrint} disabled={!formData.title} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-secondary rounded-md transition-colors disabled:opacity-50">
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Attendees</label>
              <input 
                type="text" 
                value={formData.attendees}
                onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                placeholder="John, Jane, Client A"
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 space-y-4 bg-background">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                <FileText className="w-3 h-3" /> Agenda
              </label>
              <textarea 
                value={formData.agenda}
                onChange={(e) => setFormData({...formData, agenda: e.target.value})}
                placeholder="1. Topic A&#10;2. Topic B"
                className="w-full h-24 rounded-md border border-input bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                <FileText className="w-3 h-3" /> Discussion Notes
              </label>
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Detailed notes from the meeting..."
                className="w-full h-48 rounded-md border border-input bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1 text-primary">
                <CheckCircle2 className="w-3 h-3" /> Action Items
              </label>
              <textarea 
                value={formData.actionItems}
                onChange={(e) => setFormData({...formData, actionItems: e.target.value})}
                placeholder="- [ ] John to send the report by Friday&#10;- [ ] Jane to update the design"
                className="w-full h-32 rounded-md border border-input bg-card p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Print View */}
      <div className="hidden print:block print:absolute print:inset-0 print:w-full print:h-full print:bg-white print:text-black print:z-50" ref={printRef}>
        <div className="max-w-[800px] mx-auto p-12">
          <h1 className="text-3xl font-bold border-b-2 border-slate-200 pb-4 mb-6 uppercase tracking-tight">{formData.title || 'Untitled Meeting'}</h1>
          
          <div className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date & Attendees</h2>
            <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
            <p className="text-sm mt-1">{formData.attendees || 'None specified'}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Agenda</h2>
            <div className="whitespace-pre-wrap text-sm">{formData.agenda || 'No agenda provided'}</div>
          </div>

          <div className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Discussion Notes</h2>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{formData.notes || 'No notes taken'}</div>
          </div>

          <div className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">Action Items</h2>
            <div className="whitespace-pre-wrap text-sm font-medium">{formData.actionItems || 'No action items assigned'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
