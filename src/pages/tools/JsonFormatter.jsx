import { useState } from 'react';
import { Wrench, CheckCircle2, AlertCircle, Copy, FileJson } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const loadDemo = () => {
    setInput('{"name":"DevLance Hub","version":"1.0.0","tools":["time-tracker","kanban-board","json-formatter"],"offline":true,"author":{"name":"Fathin","role":"Frontend Developer"}}');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Wrench className="w-8 h-8 text-orange-500" /> JSON Formatter & Validator
        </h1>
        <p className="text-muted-foreground">
          Format, validate, and minify your JSON data offline securely.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 bg-card p-3 rounded-lg border border-border">
        <button 
          onClick={formatJson}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Format (Beautify)
        </button>
        <button 
          onClick={minifyJson}
          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Minify
        </button>
        <button 
          onClick={() => { setInput(''); setOutput(''); setError(null); }}
          className="hover:bg-secondary text-muted-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors ml-auto border border-border"
        >
          Clear
        </button>
        <button 
          onClick={loadDemo}
          className="hover:bg-secondary text-muted-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors border border-border"
        >
          Demo Data
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20 flex items-start gap-3 shrink-0">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Invalid JSON</h3>
            <p className="text-sm opacity-90 font-mono mt-1">{error}</p>
          </div>
        </div>
      )}
      
      {!error && output && (
        <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-3 rounded-lg border border-green-500/20 flex items-center gap-2 shrink-0 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> Valid JSON
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
          <div className="bg-secondary/50 p-2 border-b border-border flex items-center gap-2">
            <FileJson className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">Input</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="Paste your JSON here..."
            className="flex-1 p-4 w-full bg-transparent resize-none focus:outline-none focus:ring-0 text-sm font-mono leading-relaxed"
            spellCheck="false"
          />
        </div>

        <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden relative">
          <div className="bg-secondary/50 p-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">Output</span>
            </div>
            
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-[#1e1e1e] dark:bg-black/20 p-0 relative">
             <textarea
              readOnly
              value={output}
              className="w-full h-full p-4 bg-transparent resize-none focus:outline-none focus:ring-0 text-sm font-mono leading-relaxed text-blue-600 dark:text-blue-400"
              placeholder="Formatted output will appear here..."
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
