import { useState } from 'react';
import { Network, Send, Loader2, AlertCircle } from 'lucide-react';

export default function ApiTester() {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let parsedHeaders = {};
      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers);
      }

      const startTime = performance.now();
      const res = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: ['GET', 'HEAD'].includes(method) ? null : body || null,
      });
      const endTime = performance.now();

      const time = Math.round(endTime - startTime);
      const status = res.status;
      const statusText = res.statusText;
      
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({
        status,
        statusText,
        time,
        data: typeof data === 'object' ? JSON.stringify(data, null, 2) : data
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Network className="w-8 h-8 text-indigo-500" /> API Endpoint Tester
        </h1>
        <p className="text-muted-foreground">
          Test REST APIs locally. Requests are made directly from your browser.
        </p>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl shadow-sm shrink-0 space-y-4">
        <div className="flex gap-2">
          <select 
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-24 shrink-0"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/data"
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} 
            Send
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Headers (JSON)</label>
            <textarea 
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              spellCheck="false"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Body</label>
            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={['GET', 'HEAD'].includes(method)}
              placeholder={['GET', 'HEAD'].includes(method) ? 'Body is disabled for GET/HEAD requests.' : '{"key": "value"}'}
              className="w-full h-24 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none disabled:opacity-50"
              spellCheck="false"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
        <div className="bg-secondary/50 p-3 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="font-semibold text-sm">Response</h2>
          
          {response && (
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className={`px-2 py-1 rounded-full ${response.status < 300 ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                {response.status} {response.statusText}
              </span>
              <span className="text-muted-foreground">
                Time: <span className="text-foreground">{response.time} ms</span>
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-auto bg-[#1e1e1e] dark:bg-black/20 p-4">
          {error ? (
            <div className="text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : response ? (
            <pre className="text-sm font-mono leading-relaxed text-blue-600 dark:text-blue-400">
              {response.data}
            </pre>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              Enter a URL and click Send to see the response.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
