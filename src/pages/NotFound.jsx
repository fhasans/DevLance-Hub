import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-6 text-center p-6">
      <div className="relative">
        <div className="text-[8rem] font-black text-primary/10 leading-none select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl">🔍</div>
        </div>
      </div>
      
      <div className="space-y-2 max-w-sm">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">
          The tool or page you're looking for doesn't exist or may have been moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-border bg-card hover:bg-secondary transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  );
}
