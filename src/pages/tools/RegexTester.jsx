import { useState, useEffect } from 'react';
import { Regex, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('[A-Z]\\w+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Hello World 123 Regex is Awesome!');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!pattern) {
        setMatches([]);
        setError(null);
        return;
      }
      const regex = new RegExp(pattern, flags);
      const newMatches = [];
      let match;
      
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          newMatches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          newMatches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      
      setMatches(newMatches);
      setError(null);
    } catch (err) {
      setError(err.message);
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  // Function to render highlighted text
  const renderHighlightedText = () => {
    if (error || matches.length === 0 || !pattern) {
      return <span>{testString}</span>;
    }

    let lastIndex = 0;
    const elements = [];
    
    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        elements.push(<span key={`text-${i}`}>{testString.substring(lastIndex, match.index)}</span>);
      }
      
      // Add highlighted match
      elements.push(
        <span key={`match-${i}`} className="bg-primary/30 text-primary-foreground px-0.5 rounded-sm border-b border-primary">
          {match.value}
        </span>
      );
      
      lastIndex = match.index + match.value.length;
    });

    // Add remaining text
    if (lastIndex < testString.length) {
      elements.push(<span key="text-end">{testString.substring(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Regex className="w-8 h-8 text-red-500" /> Regex Tester
        </h1>
        <p className="text-muted-foreground">
          Test and debug regular expressions in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 shrink-0">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Regular Expression</label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-mono text-xl">/</span>
              <input 
                type="text" 
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Pattern"
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-muted-foreground font-mono text-xl">/</span>
              <input 
                type="text" 
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="Flags (g, i, m)"
                className="w-20 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            {error && (
              <p className="text-destructive text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col min-h-[300px]">
          <div className="p-3 border-b border-border bg-secondary/50 flex items-center justify-between">
            <h2 className="font-semibold text-sm">Test String</h2>
            <div className="flex items-center gap-2 text-xs">
              {matches.length > 0 ? (
                <span className="bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {matches.length} matches
                </span>
              ) : (
                <span className="text-muted-foreground px-2 py-1 rounded bg-secondary">No matches</span>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 flex-1">
            <div className="border-b md:border-b-0 md:border-r border-border p-4">
              <textarea 
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter text to test your regex against..."
                className="w-full h-full min-h-[200px] resize-none bg-transparent focus:outline-none focus:ring-0 text-sm font-mono leading-relaxed"
                spellCheck="false"
              />
            </div>
            
            <div className="p-4 bg-[#1e1e1e] dark:bg-black/20 overflow-auto">
              <div className="text-sm font-mono leading-relaxed whitespace-pre-wrap break-words text-blue-600 dark:text-blue-400">
                {renderHighlightedText()}
              </div>
              
              {matches.length > 0 && (
                <div className="mt-8 pt-4 border-t border-border/50">
                  <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Match Details</h3>
                  <div className="space-y-2">
                    {matches.map((match, i) => (
                      <div key={i} className="bg-card p-2 rounded text-xs font-mono flex flex-col gap-1 border border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Match {i + 1}</span>
                          <span className="text-muted-foreground text-[10px]">Index: {match.index}</span>
                        </div>
                        <span className="font-medium">"{match.value}"</span>
                        {match.groups.length > 0 && match.groups[0] !== undefined && (
                          <div className="mt-1 pl-2 border-l-2 border-primary/30">
                            {match.groups.map((g, gi) => (
                              <div key={gi} className="text-muted-foreground">
                                Group {gi + 1}: <span className="text-foreground">"{g}"</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
