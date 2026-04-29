import { useState, useEffect } from 'react';
import { usePasswordStore } from '../../store/passwordStore';
import { KeyRound, Lock, Unlock, Plus, Trash2, Copy, Eye, EyeOff, AlertCircle } from 'lucide-react';

// --- Web Crypto API Utilities ---
const generateKey = async (masterPassword) => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', 
    enc.encode(masterPassword), 
    { name: 'PBKDF2' }, 
    false, 
    ['deriveBits', 'deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('devlance-salt'), // In a real app, salt should be random per user
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

const encryptData = async (text, key) => {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    enc.encode(text)
  );
  
  // Convert ArrayBuffer to base64
  const encryptedArray = Array.from(new Uint8Array(encrypted));
  const encryptedBase64 = btoa(String.fromCharCode.apply(null, encryptedArray));
  const ivBase64 = btoa(String.fromCharCode.apply(null, Array.from(iv)));
  
  return { encryptedBase64, ivBase64 };
};

const decryptData = async (encryptedBase64, ivBase64, key) => {
  try {
    const encryptedArray = new Uint8Array(atob(encryptedBase64).split('').map(c => c.charCodeAt(0)));
    const iv = new Uint8Array(atob(ivBase64).split('').map(c => c.charCodeAt(0)));
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encryptedArray
    );
    
    const dec = new TextDecoder();
    return dec.decode(decrypted);
  } catch (e) {
    throw new Error("Invalid password or corrupted data");
  }
};

export default function PasswordVault() {
  const { passwords, isVaultUnlocked, setVaultUnlocked, addPassword, deletePassword } = usePasswordStore();
  
  const [masterPassword, setMasterPassword] = useState('');
  const [cryptoKey, setCryptoKey] = useState(null);
  const [authError, setAuthError] = useState('');
  
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  
  const [decryptedPasswords, setDecryptedPasswords] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Lock vault when component unmounts
  useEffect(() => {
    return () => {
      setVaultUnlocked(false);
    };
  }, []);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!masterPassword) return;
    
    try {
      const key = await generateKey(masterPassword);
      setCryptoKey(key);
      
      // Verify key by trying to decrypt the first password if exists
      if (passwords.length > 0) {
        await decryptData(passwords[0].encryptedData, passwords[0].iv, key);
      }
      
      setVaultUnlocked(true);
      setAuthError('');
    } catch (err) {
      setAuthError('Incorrect master password');
      setCryptoKey(null);
    }
  };

  const handleLock = () => {
    setVaultUnlocked(false);
    setCryptoKey(null);
    setMasterPassword('');
    setDecryptedPasswords({});
    setVisiblePasswords({});
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !passwordValue || !cryptoKey) return;
    
    try {
      const { encryptedBase64, ivBase64 } = await encryptData(passwordValue, cryptoKey);
      
      addPassword({
        title,
        username,
        encryptedData: encryptedBase64,
        iv: ivBase64
      });
      
      setTitle('');
      setUsername('');
      setPasswordValue('');
    } catch (err) {
      console.error("Encryption failed", err);
    }
  };

  const revealPassword = async (id, encryptedData, iv) => {
    if (decryptedPasswords[id]) {
      toggleVisibility(id);
      return;
    }
    
    try {
      const plain = await decryptData(encryptedData, iv, cryptoKey);
      setDecryptedPasswords(prev => ({ ...prev, [id]: plain }));
      setVisiblePasswords(prev => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error("Decryption failed", err);
    }
  };

  const toggleVisibility = (id) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (id, encryptedData, iv) => {
    try {
      let plain = decryptedPasswords[id];
      if (!plain) {
        plain = await decryptData(encryptedData, iv, cryptoKey);
        setDecryptedPasswords(prev => ({ ...prev, [id]: plain }));
      }
      await navigator.clipboard.writeText(plain);
      // Optional: show copied state
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (!isVaultUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 max-w-md w-full animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Password Vault</h2>
          <p className="text-muted-foreground text-center text-sm mb-6">
            Your passwords are encrypted using AES-GCM and stored only on this device. Enter your master password to unlock.
          </p>
          
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={masterPassword}
                onChange={(e) => { setMasterPassword(e.target.value); setAuthError(''); }}
                placeholder="Master Password"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {authError && <p className="text-destructive text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {authError}</p>}
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md font-medium text-sm transition-colors">
              Unlock Vault
            </button>
            <p className="text-xs text-center text-muted-foreground mt-4 italic">
              Warning: If you forget your master password, your data cannot be recovered.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col relative">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <KeyRound className="w-8 h-8 text-amber-500" /> Password Vault
          </h1>
          <p className="text-muted-foreground text-sm">
            Secure offline storage.
          </p>
        </div>
        <button 
          onClick={handleLock}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
        >
          <Lock className="w-4 h-4" /> Lock Vault
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Add Form */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col shrink-0 h-fit">
          <h2 className="font-semibold mb-4 border-b border-border pb-2 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" /> Add Password
          </h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Title / Website</label>
              <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="e.g. GitHub" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Username / Email</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="username@example.com" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Password</label>
              <input required type="password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-md font-medium text-sm transition-colors mt-2">
              Save Securely
            </button>
          </form>
        </div>

        {/* Password List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30 flex items-center justify-between shrink-0">
            <h2 className="font-semibold flex items-center gap-2">
              <Unlock className="w-4 h-4 text-green-500" /> Vault Unlocked
            </h2>
            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
              {passwords.length} Items
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {passwords.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <KeyRound className="w-12 h-12 mb-2 opacity-20" />
                <p>Vault is empty.</p>
              </div>
            ) : (
              passwords.map(pwd => (
                <div key={pwd.id} className="p-4 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 overflow-hidden">
                    <h3 className="font-semibold text-sm">{pwd.title}</h3>
                    {pwd.username && <p className="text-xs text-muted-foreground">{pwd.username}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="font-mono text-xs bg-secondary px-2 py-1 rounded max-w-[200px] overflow-hidden text-ellipsis">
                        {visiblePasswords[pwd.id] ? decryptedPasswords[pwd.id] : '••••••••••••'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => revealPassword(pwd.id, pwd.encryptedData, pwd.iv)}
                      className="p-2 bg-secondary hover:bg-secondary/80 rounded-md text-foreground transition-colors"
                      title={visiblePasswords[pwd.id] ? "Hide" : "Reveal"}
                    >
                      {visiblePasswords[pwd.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleCopy(pwd.id, pwd.encryptedData, pwd.iv)}
                      className="p-2 bg-secondary hover:bg-secondary/80 rounded-md text-foreground transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deletePassword(pwd.id)}
                      className="p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-md transition-colors ml-2"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
