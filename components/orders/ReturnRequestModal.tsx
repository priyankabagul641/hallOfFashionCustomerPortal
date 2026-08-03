'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import { OrderItem, ReturnRequestType, createReturnRequest } from '@/lib/api/orders';
import { apiUpload } from '@/lib/api-client';
import { ApiError } from '@/lib/api-client';

interface ReturnRequestModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  items: OrderItem[];
  onSubmitted: () => void;
}

const typeOptions: { id: ReturnRequestType; label: string; flag: keyof OrderItem }[] = [
  { id: 'return', label: 'Return', flag: 'allowReturn' },
  { id: 'refund', label: 'Refund', flag: 'allowRefund' },
  { id: 'exchange', label: 'Exchange', flag: 'allowExchange' },
];

export default function ReturnRequestModal({ open, onClose, orderId, items, onSubmitted }: ReturnRequestModalProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(() => items.map((i) => i.id));
  const [type, setType] = useState<ReturnRequestType | null>(null);
  const [reason, setReason] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A type is offered only if every selected item allows it (flags default to
  // true — see OrderItem.allowReturn/allowRefund/allowExchange comment).
  const selectedItems = items.filter((i) => selectedItemIds.includes(i.id));
  const availableTypes = typeOptions.filter((opt) =>
    selectedItems.length > 0 && selectedItems.every((i) => (i[opt.flag] as boolean | undefined) !== false)
  );

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    setType(null);
  };

  const handleSubmit = async () => {
    if (!type || !reason.trim() || selectedItemIds.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      let photos: string[] | undefined;
      if (photo) {
        const uploadRes = await apiUpload<{ url: string }>('/storage/upload', photo, { folder: 'returns' });
        photos = [uploadRes.data.url];
      }

      await createReturnRequest(orderId, {
        type,
        reason: reason.trim(),
        photos,
        items: selectedItemIds.map((orderItemId) => ({
          orderItemId,
          quantity: items.find((i) => i.id === orderItemId)?.quantity ?? 1,
        })),
      });

      onSubmitted();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto w-full max-w-lg max-h-[88vh] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 bg-card/40">
              <div>
                <h2 className="text-xl font-bold">Return / Refund / Exchange</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tell us what happened and we&apos;ll review your request.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-card transition-colors"
                aria-label="Close return request form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(88vh-84px)] overflow-y-auto p-6 space-y-5">
              {items.length > 1 && (
                <div>
                  <p className="mb-2 text-sm font-semibold">Items</p>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl border border-border p-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItemIds.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="accent-accent"
                        />
                        <span className="text-sm">{item.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="mb-2 text-sm font-semibold">Request Type</p>
                {availableTypes.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No request type available for the selected item(s).</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {availableTypes.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setType(opt.id)}
                        className={`rounded-xl border p-3 text-sm font-semibold transition-all ${
                          type === opt.id ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Tell us why you'd like to return/refund/exchange this item"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Photo (optional)</label>
                <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground cursor-pointer hover:border-accent/50">
                  <Upload size={16} />
                  {photo ? photo.name : 'Click to upload a photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="button"
                disabled={!type || !reason.trim() || submitting}
                onClick={handleSubmit}
                className="w-full py-2.5 bg-accent text-luxury-black rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
