'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import {
  productTypes, fabrics, neckDesigns, sleeveDesigns,
  backDesigns, additionalFeatures, colors
} from '@/data/customization';
import { Check, ChevronRight, ChevronLeft, Upload, Ruler, ShoppingBag, Eye, Scissors, Star } from 'lucide-react';

interface CustomizationState {
  productType: string;
  fabric: string;
  color: string;
  neckDesign: string;
  sleeveDesign: string;
  backDesign: string;
  additionalFeatures: string[];
  referenceImage: File | null;
  notes: string;
  measurements: {
    chest: string; waist: string; hips: string; shoulder: string;
    sleeveLength: string; length: string; neck: string;
  };
}

const STEPS = [
  { id: 1, title: 'Product Type', icon: Scissors, description: 'Choose what you want tailored' },
  { id: 2, title: 'Fabric', icon: Star, description: 'Select your premium fabric' },
  { id: 3, title: 'Colour', icon: Eye, description: 'Pick your perfect shade' },
  { id: 4, title: 'Neck Design', icon: Scissors, description: 'Choose collar & neck style' },
  { id: 5, title: 'Sleeve Design', icon: Scissors, description: 'Select sleeve style' },
  { id: 6, title: 'Back Design', icon: Scissors, description: 'Choose back detailing' },
  { id: 7, title: 'Add-ons', icon: Star, description: 'Extra embellishments' },
  { id: 8, title: 'Reference', icon: Upload, description: 'Upload inspiration images' },
  { id: 9, title: 'Notes', icon: Eye, description: 'Share special instructions' },
  { id: 10, title: 'Measurements', icon: Ruler, description: 'Enter your measurements' },
  { id: 11, title: 'Preview', icon: Eye, description: 'Review your customization' },
  { id: 12, title: 'Add to Cart', icon: ShoppingBag, description: 'Confirm & add to cart' },
];

const BASE_PRICE = 18000;

export default function CustomizationStudioPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { addToCart } = useCart();

  const [state, setState] = useState<CustomizationState>({
    productType: '',
    fabric: '',
    color: '',
    neckDesign: '',
    sleeveDesign: '',
    backDesign: '',
    additionalFeatures: [],
    referenceImage: null,
    notes: '',
    measurements: { chest: '', waist: '', hips: '', shoulder: '', sleeveLength: '', length: '', neck: '' },
  });

  const getSelectedProductType = () => productTypes.find((p) => p.id === state.productType);
  const getSelectedFabric = () => fabrics.find((f) => f.id === state.fabric);
  const getSelectedColor = () => colors.find((c) => c.id === state.color);

  const totalPrice = () => {
    let price = BASE_PRICE;
    const fabric = getSelectedFabric();
    if (fabric) price += fabric.priceAdd ?? 0;
    const productType = getSelectedProductType();
    if (productType) price += productType.priceAdd ?? 0;
    const neck = neckDesigns.find((n) => n.id === state.neckDesign);
    if (neck) price += neck.priceAdd ?? 0;
    const sleeve = sleeveDesigns.find((s) => s.id === state.sleeveDesign);
    if (sleeve) price += sleeve.priceAdd ?? 0;
    const back = backDesigns.find((b) => b.id === state.backDesign);
    if (back) price += back.priceAdd ?? 0;
    state.additionalFeatures.forEach((featureId) => {
      const feature = additionalFeatures.find((f) => f.id === featureId);
      if (feature) price += feature.priceAdd ?? 0;
    });
    return price;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!state.productType;
      case 2: return !!state.fabric;
      case 3: return !!state.color;
      case 4: return !!state.neckDesign;
      case 5: return !!state.sleeveDesign;
      case 6: return !!state.backDesign;
      default: return true;
    }
  };

  const handleAddToCart = () => {
    const productType = getSelectedProductType();
    const fabric = getSelectedFabric();
    const colorObj = getSelectedColor();
    const customId = `custom-${Date.now()}`;
    addToCart({
      productId: customId,
      variantId: customId,
      name: `Custom ${productType?.label ?? 'Outfit'} – ${colorObj?.label ?? ''} ${fabric?.label ?? ''}`,
      price: totalPrice(),
      quantity: 1,
      image: productType?.image ?? 'https://images.unsplash.com/photo-1594938298603-c8148c4b4c4e?w=400&q=80',
      size: state.measurements.chest ? `Chest: ${state.measurements.chest}"` : 'Custom',
      designer: 'Hall of Fashion Atelier',
    });
    setCurrentStep(12);
  };

  const next = () => { if (currentStep < 12) setCurrentStep(currentStep + 1); };
  const prev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  return (
    <main className="min-h-screen bg-background">

      <div className="pt-24">
        {/* Top Progress Bar */}
        <div className="bg-luxury-black text-luxury-ivory">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-playfair text-2xl font-bold">Customization Studio</h1>
                <p className="text-luxury-beige/70 text-sm">Step {currentStep} of 12 — {STEPS[currentStep - 1].title}</p>
              </div>
              <div className="text-right">
                <p className="text-luxury-beige/60 text-sm">Estimated Price</p>
                <p className="text-accent text-2xl font-bold">₹{totalPrice().toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  className={`shrink-0 h-2 rounded-full transition-all ${
                    step.id < currentStep ? 'bg-accent cursor-pointer w-8' :
                    step.id === currentStep ? 'bg-accent w-12' : 'bg-white/20 w-4'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Steps Navigation (Desktop) */}
        <div className="hidden lg:block bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex overflow-x-auto">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    step.id === currentStep
                      ? 'border-accent text-accent'
                      : step.id < currentStep
                      ? 'border-transparent text-muted-foreground hover:text-foreground cursor-pointer'
                      : 'border-transparent text-muted-foreground/40 cursor-default'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check size={14} className="text-accent" />
                  ) : (
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      step.id === currentStep ? 'bg-accent text-luxury-black' : 'bg-muted text-muted-foreground'
                    }`}>{step.id}</span>
                  )}
                  {step.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >

              {/* Step 1: Product Type */}
              {currentStep === 1 && (
                <StepLayout title="What would you like to create?" subtitle="Choose the type of garment for your custom order">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {productTypes.map((product) => (
                      <OptionCard
                        key={product.id}
                        label={product.label}
                        description={product.description}
                        image={product.image}
                        selected={state.productType === product.id}
                        onClick={() => setState({ ...state, productType: product.id })}
                        priceAdd={product.priceAdd}
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* Step 2: Fabric */}
              {currentStep === 2 && (
                <StepLayout title="Choose Your Fabric" subtitle="Each fabric has unique qualities — pick what suits your occasion">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {fabrics.map((fabric) => (
                      <OptionCard
                        key={fabric.id}
                        label={fabric.label}
                        description={fabric.description}
                        selected={state.fabric === fabric.id}
                        onClick={() => setState({ ...state, fabric: fabric.id })}
                        priceAdd={fabric.priceAdd}
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* Step 3: Color */}
              {currentStep === 3 && (
                <StepLayout title="Select Your Colour" subtitle="Choose the primary colour for your garment">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {colors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setState({ ...state, color: color.id })}
                        className={`relative rounded-2xl p-4 border-2 transition-all hover:shadow-md ${
                          state.color === color.id ? 'border-accent scale-105' : 'border-border'
                        }`}
                      >
                        <div
                          className="w-full h-16 rounded-xl mb-3 border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-xs font-semibold text-center">{color.label}</p>
                        {state.color === color.id && (
                          <div className="absolute top-2 right-2 bg-accent rounded-full p-0.5">
                            <Check size={12} className="text-luxury-black" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* Step 4: Neck Design */}
              {currentStep === 4 && (
                <StepLayout title="Neck & Collar Style" subtitle="Select your preferred neckline design">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {neckDesigns.map((neck) => (
                      <OptionCard
                        key={neck.id}
                        label={neck.label}
                        description={neck.description}
                        selected={state.neckDesign === neck.id}
                        onClick={() => setState({ ...state, neckDesign: neck.id })}
                        priceAdd={neck.priceAdd}
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* Step 5: Sleeve Design */}
              {currentStep === 5 && (
                <StepLayout title="Sleeve Style" subtitle="Choose the sleeve length and design">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {sleeveDesigns.map((sleeve) => (
                      <OptionCard
                        key={sleeve.id}
                        label={sleeve.label}
                        description={sleeve.description}
                        selected={state.sleeveDesign === sleeve.id}
                        onClick={() => setState({ ...state, sleeveDesign: sleeve.id })}
                        priceAdd={sleeve.priceAdd}
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* Step 6: Back Design */}
              {currentStep === 6 && (
                <StepLayout title="Back Design" subtitle="Choose the back panel style of your garment">
                  <div className="grid grid-cols-2 gap-4">
                    {backDesigns.map((back) => (
                      <OptionCard
                        key={back.id}
                        label={back.label}
                        description={back.description}
                        selected={state.backDesign === back.id}
                        onClick={() => setState({ ...state, backDesign: back.id })}
                        priceAdd={back.priceAdd}
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* Step 7: Additional Features */}
              {currentStep === 7 && (
                <StepLayout title="Additional Embellishments" subtitle="Select any extra decorative features (optional — multi-select)">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {additionalFeatures.map((feature) => (
                      <OptionCard
                        key={feature.id}
                        label={feature.label}
                        description={feature.description}
                        selected={state.additionalFeatures.includes(feature.id)}
                        onClick={() => {
                          const updated = state.additionalFeatures.includes(feature.id)
                            ? state.additionalFeatures.filter((f) => f !== feature.id)
                            : [...state.additionalFeatures, feature.id];
                          setState({ ...state, additionalFeatures: updated });
                        }}
                        priceAdd={feature.priceAdd}
                        multiSelect
                      />
                    ))}
                  </div>
                </StepLayout>
              )}

              {/* Step 8: Reference Image */}
              {currentStep === 8 && (
                <StepLayout title="Upload Reference Image" subtitle="Share inspiration images to guide our tailors (optional)">
                  <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-accent transition-colors">
                    <Upload className="mx-auto mb-4 text-muted-foreground" size={40} />
                    <p className="text-lg font-semibold mb-2">Drop your inspiration here</p>
                    <p className="text-muted-foreground text-sm mb-6">JPG, PNG, PDF up to 10MB</p>
                    <label className="cursor-pointer inline-block px-6 py-3 bg-luxury-black text-luxury-ivory rounded-xl font-semibold hover:bg-accent hover:text-luxury-black transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setState({ ...state, referenceImage: e.target.files?.[0] ?? null })}
                      />
                      Browse Files
                    </label>
                    {state.referenceImage && (
                      <div className="mt-6 flex items-center justify-center gap-3 text-sm text-accent">
                        <Check size={18} />
                        <span>{state.referenceImage.name} uploaded</span>
                      </div>
                    )}
                  </div>
                </StepLayout>
              )}

              {/* Step 9: Notes */}
              {currentStep === 9 && (
                <StepLayout title="Special Instructions" subtitle="Any specific requirements or details for our tailors">
                  <textarea
                    rows={8}
                    placeholder="e.g. 'I prefer a slightly relaxed fit at the waist. Please add a pocket on the inner left. The embroidery should match the reference image I uploaded. Extra lining preferred.'"
                    value={state.notes}
                    onChange={(e) => setState({ ...state, notes: e.target.value })}
                    className="w-full border border-border rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none leading-relaxed"
                  />
                  <p className="text-xs text-muted-foreground mt-2">{state.notes.length}/500 characters</p>
                </StepLayout>
              )}

              {/* Step 10: Measurements */}
              {currentStep === 10 && (
                <StepLayout title="Your Measurements" subtitle="Accurate measurements ensure a perfect fit. All values in inches unless stated.">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { key: 'chest', label: 'Chest', placeholder: 'e.g. 40' },
                      { key: 'waist', label: 'Waist', placeholder: 'e.g. 34' },
                      { key: 'hips', label: 'Hips', placeholder: 'e.g. 38' },
                      { key: 'shoulder', label: 'Shoulder Width', placeholder: 'e.g. 17' },
                      { key: 'sleeveLength', label: 'Sleeve Length', placeholder: 'e.g. 25' },
                      { key: 'length', label: 'Outfit Length', placeholder: 'e.g. 44' },
                      { key: 'neck', label: 'Neck', placeholder: 'e.g. 15.5' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-sm font-semibold">{label} <span className="text-muted-foreground font-normal">(inches)</span></label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder={placeholder}
                          value={state.measurements[key as keyof typeof state.measurements]}
                          onChange={(e) =>
                            setState({
                              ...state,
                              measurements: { ...state.measurements, [key]: e.target.value },
                            })
                          }
                          className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <Link href="/measurements" className="inline-flex items-center gap-2 mt-6 text-sm text-accent hover:underline">
                    <Ruler size={14} /> Use a saved measurement profile
                  </Link>
                </StepLayout>
              )}

              {/* Step 11: Preview */}
              {currentStep === 11 && (
                <StepLayout title="Review Your Customization" subtitle="Double-check everything before adding to cart">
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="bg-luxury-black text-luxury-ivory p-6">
                      <p className="text-accent font-cormorant text-sm tracking-widest uppercase mb-2">Custom Order Summary</p>
                      <h3 className="font-playfair text-2xl font-bold">
                        {getSelectedProductType()?.label ?? 'Custom Outfit'} —{' '}
                        <span style={{ color: getSelectedColor()?.hex ?? '#C8A96B' }}>
                          {getSelectedColor()?.label ?? 'Custom'}
                        </span>
                      </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {[
                        { label: 'Fabric', value: getSelectedFabric()?.label ?? '—' },
                        { label: 'Colour', value: getSelectedColor()?.label ?? '—' },
                        { label: 'Neck Design', value: neckDesigns.find((n) => n.id === state.neckDesign)?.label ?? '—' },
                        { label: 'Sleeve Design', value: sleeveDesigns.find((s) => s.id === state.sleeveDesign)?.label ?? '—' },
                        { label: 'Back Design', value: backDesigns.find((b) => b.id === state.backDesign)?.label ?? '—' },
                        {
                          label: 'Add-ons',
                          value: state.additionalFeatures.length > 0
                            ? state.additionalFeatures.map((id) => additionalFeatures.find((f) => f.id === id)?.label).join(', ')
                            : 'None',
                        },
                        { label: 'Reference Image', value: state.referenceImage?.name ?? 'Not uploaded' },
                        {
                          label: 'Measurements',
                          value: Object.entries(state.measurements)
                            .filter(([, v]) => v)
                            .map(([k, v]) => `${k}: ${v}"`)
                            .join(', ') || 'Not provided',
                        },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-muted/20 rounded-xl p-4">
                          <p className="text-xs text-muted-foreground mb-1">{label}</p>
                          <p className="font-semibold">{value}</p>
                        </div>
                      ))}
                    </div>
                    {state.notes && (
                      <div className="px-6 pb-6">
                        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-sm">
                          <p className="text-xs text-muted-foreground mb-1">Special Notes</p>
                          <p>{state.notes}</p>
                        </div>
                      </div>
                    )}
                    <div className="px-6 pb-6 border-t border-border pt-6">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">Total Estimate</span>
                        <span className="text-accent text-3xl font-bold font-playfair">₹{totalPrice().toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">* Final price may vary after tailor consultation</p>
                    </div>
                  </div>
                </StepLayout>
              )}

              {/* Step 12: Success */}
              {currentStep === 12 && (
                <div className="text-center py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="text-luxury-black" size={40} />
                  </motion.div>
                  <h2 className="font-playfair text-3xl font-bold mb-3">Added to Cart!</h2>
                  <p className="text-muted-foreground mb-2">Your custom {getSelectedProductType()?.label ?? 'outfit'} has been added.</p>
                  <p className="text-accent font-semibold text-xl mb-8">₹{totalPrice().toLocaleString('en-IN')}</p>
                  <div className="flex items-center justify-center gap-4">
                    <Link href="/cart">
                      <button className="px-8 py-3 bg-luxury-black text-luxury-ivory font-semibold rounded-xl hover:bg-accent hover:text-luxury-black transition-all">
                        Go to Cart
                      </button>
                    </Link>
                    <button
                      onClick={() => { setCurrentStep(1); setState({ productType: '', fabric: '', color: '', neckDesign: '', sleeveDesign: '', backDesign: '', additionalFeatures: [], referenceImage: null, notes: '', measurements: { chest: '', waist: '', hips: '', shoulder: '', sleeveLength: '', length: '', neck: '' } }); }}
                      className="px-8 py-3 border border-border font-semibold rounded-xl hover:border-accent hover:text-accent transition-all"
                    >
                      Create Another
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          {currentStep < 12 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
              <button
                onClick={prev}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 border border-border rounded-xl font-semibold hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} /> Back
              </button>

              <span className="text-sm text-muted-foreground">{currentStep} / 12</span>

              {currentStep === 11 ? (
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 px-8 py-3 bg-accent text-luxury-black font-semibold rounded-xl hover:bg-luxury-black hover:text-luxury-ivory transition-all"
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>
              ) : (
                <button
                  onClick={next}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-8 py-3 bg-luxury-black text-luxury-ivory font-semibold rounded-xl hover:bg-accent hover:text-luxury-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {currentStep === 7 || currentStep >= 8 ? 'Continue' : 'Next'} <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

// Reusable sub-components

function StepLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-playfair text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function OptionCard({
  label, description, image, selected, onClick, priceAdd, multiSelect
}: {
  label: string;
  description?: string;
  image?: string;
  selected: boolean;
  onClick: () => void;
  priceAdd?: number;
  multiSelect?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all hover:shadow-md ${
        selected ? 'border-accent shadow-md' : 'border-border'
      }`}
    >
      {image && (
        <div className="relative h-36 overflow-hidden">
          <Image src={image} alt={label} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <p className="font-semibold text-sm">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        {priceAdd !== undefined && priceAdd !== 0 && (
          <p className={`text-xs font-semibold mt-1 ${priceAdd > 0 ? 'text-accent' : 'text-emerald-600'}`}>
            {priceAdd > 0 ? `+ ₹${priceAdd.toLocaleString('en-IN')}` : `- ₹${Math.abs(priceAdd).toLocaleString('en-IN')}`}
          </p>
        )}
      </div>
      {selected && (
        <div className={`absolute top-3 right-3 rounded-full p-1 ${multiSelect ? 'bg-accent' : 'bg-accent'}`}>
          <Check size={12} className="text-luxury-black" />
        </div>
      )}
    </button>
  );
}
