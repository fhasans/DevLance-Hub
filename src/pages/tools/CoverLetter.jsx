import { useState, useRef } from 'react';
import { useCoverLetterStore } from '../../store/coverLetterStore';
import { useProfileStore } from '../../store/profileStore';
import { FileEdit, Save, Trash2, Printer, Copy, CheckCircle2 } from 'lucide-react';

export default function CoverLetter() {
  const { drafts, saveDraft, deleteDraft } = useCoverLetterStore();
  const profile = useProfileStore();
  
  const [currentId, setCurrentId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  
  const printRef = useRef();

  const loadDraft = (draft) => {
    setCurrentId(draft.id);
    setTitle(draft.title);
    setContent(draft.content);
  };

  const handleNew = () => {
    setCurrentId('');
    setTitle('');
    setContent(`Dear Hiring Manager,\n\nI am writing to express my interest in the [Position Name] position at [Company Name] as advertised on [Where you found it]. With my background in [Your Field] and my skills in [Key Skill 1] and [Key Skill 2], I am confident I would be a valuable addition to your team.\n\nIn my previous role at [Previous Company], I successfully [Achievement/Responsibility]. This experience has prepared me to [What you can do for them].\n\nI am particularly drawn to [Company Name] because of [Reason you like the company]. I would welcome the opportunity to discuss how my experience aligns with your needs.\n\nThank you for considering my application.\n\nSincerely,\n${profile.name || 'Your Name'}`);
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    saveDraft({
      id: currentId || Date.now().toString(),
      title: title || 'Untitled Draft',
      content: content
    });
    // Just reset the currentId if it was new, so next save updates it
    if (!currentId) {
      setCurrentId(Date.now().toString()); 
    }
  };

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
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
          <FileEdit className="w-8 h-8 text-pink-500" /> Cover Letter Builder
        </h1>
        <p className="text-muted-foreground">
          Draft, save, and print professional cover letters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Sidebar Drafts */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden print:hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between">
            <h2 className="font-semibold">Saved Drafts</h2>
            <button onClick={handleNew} className="text-primary hover:text-primary/80 text-sm font-medium">
              New
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {drafts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center p-4">No drafts saved.</p>
            ) : (
              drafts.map(draft => (
                <div 
                  key={draft.id} 
                  className={`p-3 rounded-lg border cursor-pointer transition-colors group flex flex-col gap-1 ${currentId === draft.id ? 'bg-primary/10 border-primary/30' : 'bg-transparent border-transparent hover:bg-secondary/50'}`}
                  onClick={() => loadDraft(draft)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm truncate pr-2">{draft.title}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteDraft(draft.id); if(currentId===draft.id) handleNew(); }}
                      className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(draft.lastModified).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden print:hidden">
          <div className="p-3 border-b border-border bg-secondary/30 flex items-center gap-3 flex-wrap">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Draft Title (e.g. Google - Frontend Role)"
              className="flex-1 min-w-[200px] h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex items-center gap-2">
              <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
                <Save className="w-4 h-4" /> Save
              </button>
              <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-input bg-background hover:bg-secondary rounded-md transition-colors">
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} Copy
              </button>
              <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-input bg-background hover:bg-secondary rounded-md transition-colors">
                <Printer className="w-4 h-4" /> Print
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-0 relative bg-background">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your cover letter here..."
              className="absolute inset-0 w-full h-full resize-none bg-transparent p-6 focus:outline-none text-sm md:text-base leading-relaxed"
              spellCheck="false"
            />
          </div>
        </div>
      </div>

      {/* Print View */}
      <div className="hidden print:block print:absolute print:inset-0 print:w-full print:h-full print:bg-white print:text-black print:z-50" ref={printRef}>
        <div className="max-w-[800px] mx-auto p-12 whitespace-pre-wrap font-serif text-base leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
