import { useState } from 'react';
import { Database, Download, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function DummyDataGenerator() {
  const [schema, setSchema] = useState(
`{
  "id": "{{datatype.uuid}}",
  "name": "{{person.fullName}}",
  "email": "{{internet.email}}",
  "phone": "{{phone.number}}",
  "company": "{{company.name}}"
}`
  );
  
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // Since we don't have faker.js installed and can't use external libraries in a simple snippet easily,
  // we will use a basic mock generator or fetch from a free API like JSONPlaceholder if needed.
  // But since the PRD mentioned offline capabilities and public API, let's just make a basic offline generator 
  // that replaces basic {{tags}} with random arrays.
  
  const MOCK_DATA = {
    'datatype.uuid': () => crypto.randomUUID(),
    'person.fullName': () => {
      const first = ['John', 'Jane', 'Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia'];
      const last = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
      return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
    },
    'internet.email': () => {
      const names = ['j.smith', 'a.jones', 'cool.dev', 'master', 'admin', 'user123'];
      const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'example.com', 'startup.io'];
      return `${names[Math.floor(Math.random() * names.length)]}@${domains[Math.floor(Math.random() * domains.length)]}`;
    },
    'phone.number': () => `+1 (${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
    'company.name': () => {
      const pre = ['Global', 'Tech', 'Digital', 'Smart', 'Cloud', 'Data'];
      const post = ['Solutions', 'Systems', 'Corp', 'LLC', 'Inc', 'Group'];
      return `${pre[Math.floor(Math.random() * pre.length)]} ${post[Math.floor(Math.random() * post.length)]}`;
    },
    'address.city': () => ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney'][Math.floor(Math.random() * 6)],
    'datatype.number': () => Math.floor(Math.random() * 1000).toString(),
    'datatype.boolean': () => (Math.random() > 0.5).toString(),
  };

  const generateData = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate schema JSON first
      const parsedSchema = JSON.parse(schema);
      
      const results = [];
      
      for (let i = 0; i < count; i++) {
        let stringified = JSON.stringify(parsedSchema);
        
        // Replace tags
        Object.keys(MOCK_DATA).forEach(key => {
          const regex = new RegExp(`"{{${key}}}"`, 'g');
          // If the tag is for a boolean or number, remove the quotes if necessary, but string replace is safer for basic JSON
          // We will just do simple string replacement
          
          stringified = stringified.replace(regex, () => {
             const val = MOCK_DATA[key]();
             // return as string if it's not a boolean/number
             if (val === 'true' || val === 'false' || !isNaN(val)) {
                 return `"${val}"`; // Keep string to keep JSON valid initially, but we can refine this later
             }
             return `"${val}"`;
          });
        });

        // Additional pass to replace any remaining tags with "null"
        stringified = stringified.replace(/"{{.*?}}"/g, '"mock_data"');
        
        results.push(JSON.parse(stringified));
      }
      
      setOutput(JSON.stringify(results, null, 2));
    } catch (err) {
      setError("Invalid JSON schema: " + err.message);
      setOutput('');
    } finally {
      setLoading(false);
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

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dummy_data_${count}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="w-8 h-8 text-cyan-500" /> Dummy Data Generator
        </h1>
        <p className="text-muted-foreground">
          Generate realistic mock data based on JSON schemas offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Input Column */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
            <h2 className="font-semibold mb-3">Generator Settings</h2>
            
            <div className="flex items-end gap-4 mb-4">
              <div className="space-y-1 flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase">Number of Records</label>
                <input 
                  type="number" 
                  min="1" 
                  max="1000"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button 
                onClick={generateData}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} 
                Generate Data
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground uppercase">JSON Schema</label>
                <span className="text-xs text-muted-foreground">Available tags: {'{{person.fullName}}'}, {'{{internet.email}}'}...</span>
              </div>
              <textarea 
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                className="w-full h-64 rounded-md border border-input bg-[#1e1e1e] dark:bg-black/20 text-blue-500 dark:text-blue-400 p-4 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                spellCheck="false"
              />
              {error && <p className="text-destructive text-xs mt-1">{error}</p>}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase">Supported Tags</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(MOCK_DATA).map(tag => (
                  <span key={tag} className="text-[10px] bg-secondary text-secondary-foreground px-2 py-1 rounded font-mono">
                    {`{{${tag}}}`}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
          <div className="bg-secondary/50 p-3 border-b border-border flex items-center justify-between shrink-0">
            <h2 className="font-semibold text-sm">Output JSON</h2>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                disabled={!output}
                className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-md transition-colors flex items-center gap-1 text-xs font-medium disabled:opacity-50"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} 
              </button>
              <button 
                onClick={handleDownload}
                disabled={!output}
                className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-md transition-colors flex items-center gap-1 text-xs font-medium disabled:opacity-50"
                title="Download JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-[#1e1e1e] dark:bg-black/20 relative">
            <textarea
              readOnly
              value={output}
              placeholder="Generated data will appear here..."
              className="absolute inset-0 w-full h-full resize-none bg-transparent focus:outline-none p-4 text-sm font-mono leading-relaxed text-green-600 dark:text-green-400"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
