import { useState } from 'react';
import { useCodeVaultStore } from '../../store/codeVaultStore';
import { Code, Plus, Trash2, Copy, Search, Tag, CheckCircle2 } from 'lucide-react';

export default function CodeVault() {
  const { snippets, addSnippet, deleteSnippet } = useCodeVaultStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  // New Snippet Form State
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  
  // Copied state mapping
  const [copiedId, setCopiedId] = useState(null);

  const filteredSnippets = snippets.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
    s.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    
    addSnippet({
      title,
      language,
      code,
      tags: tags.split(',').map(t => t.trim()).filter(t => t)
    });
    
    setTitle('');
    setCode('');
    setTags('');
    setIsAdding(false);
  };

  const handleCopy = async (snippetId, codeText) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedId(snippetId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Code className="w-8 h-8 text-green-500" /> Code Snippet Vault
        </h1>
        <p className="text-muted-foreground">
          Store your frequently used code blocks locally.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search snippets by title, tag, or language..."
            className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-full md:w-auto shrink-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Snippet</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-card border border-border p-5 rounded-xl shadow-sm shrink-0 space-y-4 animate-in slide-in-from-top-4 duration-300 fade-in">
          <h2 className="font-semibold border-b border-border pb-2">New Snippet</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Title</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="e.g. Center Div in Tailwind" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Language</label>
              <input required type="text" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="javascript, css, html..." />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Code</label>
            <textarea required value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" placeholder="Paste your code here..." spellCheck="false" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Tags (comma separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="css, tailwind, layout" />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 rounded-md font-medium text-sm transition-colors">
              Save Snippet
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-auto min-h-0 space-y-4 pb-10">
        {filteredSnippets.length === 0 ? (
          <div className="p-8 text-center bg-card border border-border border-dashed rounded-xl text-muted-foreground">
            No snippets found. Click "Add Snippet" to create one.
          </div>
        ) : (
          filteredSnippets.map((snippet) => (
            <div key={snippet.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="p-3 border-b border-border bg-secondary/30 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{snippet.title}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-secondary border border-border text-muted-foreground uppercase">
                    {snippet.language}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleCopy(snippet.id, snippet.code)}
                    className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-md transition-colors flex items-center gap-1.5 text-xs font-medium"
                  >
                    {copiedId === snippet.id ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                  <button 
                    onClick={() => deleteSnippet(snippet.id)}
                    className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-[#1e1e1e] dark:bg-black/20 p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-blue-500 dark:text-blue-400">
                  <code>{snippet.code}</code>
                </pre>
              </div>
              {snippet.tags && snippet.tags.length > 0 && (
                <div className="p-2 px-4 border-t border-border bg-secondary/10 flex flex-wrap gap-2">
                  {snippet.tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-2 py-1 rounded">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
