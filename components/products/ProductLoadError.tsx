import { AlertTriangle } from 'lucide-react';

export default function ProductLoadError({
  message = 'Failed to load products. Please refresh.',
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="text-center py-24">
      <AlertTriangle className="mx-auto mb-4 text-destructive" size={40} />
      <p className="text-destructive font-semibold mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-8 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
