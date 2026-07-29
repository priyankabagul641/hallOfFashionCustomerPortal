'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-premium-lg"
          >
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-8 border-b border-border bg-background">
              <h2 className="font-playfair text-2xl font-bold">Size Guide</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="font-playfair text-xl font-semibold">How to Measure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Bust',
                      instruction: 'Measure across the fullest part of your chest',
                    },
                    {
                      title: 'Waist',
                      instruction: 'Measure at your natural waistline',
                    },
                    {
                      title: 'Hips',
                      instruction: 'Measure at the fullest part of your hips',
                    },
                    {
                      title: 'Length',
                      instruction: 'Measure from your shoulder to desired length',
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-muted-foreground text-sm">{item.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Chart */}
              <div className="space-y-4">
                <h3 className="font-playfair text-xl font-semibold">Women's Size Chart</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">Size</th>
                        <th className="text-left py-3 px-4 font-semibold">Bust (in)</th>
                        <th className="text-left py-3 px-4 font-semibold">Waist (in)</th>
                        <th className="text-left py-3 px-4 font-semibold">Hips (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: 'XS', bust: '30-32', waist: '23-25', hips: '32-34' },
                        { size: 'S', bust: '32-34', waist: '25-27', hips: '34-36' },
                        { size: 'M', bust: '34-36', waist: '27-29', hips: '36-38' },
                        { size: 'L', bust: '36-38', waist: '29-31', hips: '38-40' },
                        { size: 'XL', bust: '38-40', waist: '31-33', hips: '40-42' },
                        { size: 'XXL', bust: '40-42', waist: '33-35', hips: '42-44' },
                      ].map((row) => (
                        <tr key={row.size} className="border-b border-border hover:bg-muted/5">
                          <td className="py-3 px-4 font-semibold">{row.size}</td>
                          <td className="py-3 px-4">{row.bust}</td>
                          <td className="py-3 px-4">{row.waist}</td>
                          <td className="py-3 px-4">{row.hips}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Care Tips */}
              <div className="space-y-4 bg-muted/10 rounded-xl p-6">
                <h3 className="font-playfair text-xl font-semibold">Care Instructions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Dry clean recommended for embroidered pieces</li>
                  <li>• Hand wash delicate fabrics in cold water</li>
                  <li>• Do not bleach or tumble dry</li>
                  <li>• Store in a cool, dry place away from sunlight</li>
                  <li>• Use a garment steamer for wrinkles</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
