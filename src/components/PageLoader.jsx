import { Loader2 } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
      </div>
      <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading tool...</p>
    </div>
  );
}
