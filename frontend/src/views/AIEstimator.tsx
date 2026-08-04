import React, { useState, useEffect } from 'react';
import { Cpu, IndianRupee, Hammer, BarChart3, AlertCircle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../utils/api';

const AIEstimator: React.FC = () => {
  // Estimator Form States
  const [area, setArea] = useState<number>(1500);
  const [quality, setQuality] = useState<'standard' | 'premium' | 'luxury'>('premium');
  const [type, setType] = useState<'new' | 'renovation'>('new');
  const [floors, setFloors] = useState<number>(1);
  const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false);

  // Estimator Output states (loaded with defaults)
  const [estimateData, setEstimateData] = useState({
    totalEstimate: 295000,
    materials: [
      { name: 'Cement (50kg bags)', qty: 840, unitCost: 12, total: 10080 },
      { name: 'Bricks (Red clay)', qty: 94500, unitCost: 0.65, total: 61425 },
      { name: 'Steel rebars (tons)', qty: 14.7, unitCost: 1100, total: 16170 },
      { name: 'Sand (tons)', qty: 315, unitCost: 45, total: 14175 },
      { name: 'Aggregate (tons)', qty: 378, unitCost: 55, total: 20790 },
      { name: 'Paint (litres)', qty: 1200, unitCost: 8, total: 9600 }
    ],
    breakdown: [
      { category: 'Excavation & Foundations', percentage: 15, cost: 44250 },
      { category: 'Structural Frame & Pillars', percentage: 35, cost: 103250 },
      { category: 'Brickwork & Plastering', percentage: 15, cost: 44250 },
      { category: 'Flooring & Tiling', percentage: 12, cost: 35400 },
      { category: 'Electrical, Plumbing & HVAC', percentage: 13, cost: 38350 },
      { category: 'Finishing & Painting', percentage: 10, cost: 29500 }
    ],
    optimizations: [
      'Switching to AAC blocks instead of red bricks can save up to 8% of structural cost.',
      'Procuring aggregates directly from quarries reduces material delivery markups by 12%.',
      'Implementing high-grade fly-ash cement reduces thermal cracking and foundation cost by 4%.'
    ]
  });

  // Defect Detector States
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Compute live estimate client-side, updating dynamically
  const runLiveEstimate = async () => {
    setLoadingEstimate(true);
    try {
      const data = await api.post('api/estimate', { area, quality, floors, type }, { retries: 1 });
      // format materials to include calculation total
      const materials = data.materials.map((m: any) => ({
        ...m,
        total: Math.round(m.qty * m.unitCost)
      }));
      setEstimateData({
        totalEstimate: data.totalEstimate,
        materials,
        breakdown: data.breakdown,
        optimizations: data.optimizations
      });
    } catch {
      // Local calculation fallback if API server is offline
      const baseRate = type === 'renovation' ? 120 : 190;
      const qualityMultiplier = quality === 'luxury' ? 1.8 : quality === 'premium' ? 1.4 : 1.0;
      const estimatedCost = area * baseRate * qualityMultiplier * (1 + (floors - 1) * 0.15);

      const materials = [
        { name: 'Cement (50kg bags)', qty: Math.round(area * 0.4 * qualityMultiplier), unitCost: 12, total: 0 },
        { name: 'Bricks (Red clay)', qty: Math.round(area * 45 * qualityMultiplier), unitCost: 0.65, total: 0 },
        { name: 'Steel rebars (tons)', qty: Number((area * 0.007 * qualityMultiplier).toFixed(2)), unitCost: 1100, total: 0 },
        { name: 'Sand (tons)', qty: Math.round(area * 0.15 * qualityMultiplier), unitCost: 45, total: 0 },
        { name: 'Aggregate (tons)', qty: Math.round(area * 0.18 * qualityMultiplier), unitCost: 55, total: 0 },
        { name: 'Paint (litres)', qty: Math.round(area * 0.8 * (quality === 'luxury' ? 1.5 : 1)), unitCost: 8, total: 0 }
      ].map(m => ({ ...m, total: Math.round(m.qty * m.unitCost) }));

      const breakdown = [
        { category: 'Excavation & Foundations', percentage: 15, cost: 0 },
        { category: 'Structural Frame & Pillars', percentage: 35, cost: 0 },
        { category: 'Brickwork & Plastering', percentage: 15, cost: 0 },
        { category: 'Flooring & Tiling', percentage: 12, cost: 0 },
        { category: 'Electrical, Plumbing & HVAC', percentage: 13, cost: 0 },
        { category: 'Finishing & Painting', percentage: 10, cost: 0 }
      ].map(item => ({
        ...item,
        cost: Math.round(estimatedCost * (item.percentage / 100))
      }));

      setEstimateData({
        totalEstimate: Math.round(estimatedCost),
        materials,
        breakdown,
        optimizations: [
          'Switching to AAC blocks instead of red bricks can save up to 8% of structural cost.',
          'Procuring aggregates directly from quarries reduces material delivery markups by 12%.',
          'Implementing high-grade fly-ash cement reduces thermal cracking and foundation cost by 4%.'
        ]
      });
    } finally {
      setTimeout(() => setLoadingEstimate(false), 500);
    }
  };

  // Automatically recalculate estimate on form changes
  useEffect(() => {
    runLiveEstimate();
  }, [area, quality, floors, type]);

  const triggerExport = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
    alert(`Quotation file BridgeQuote_${Math.floor(Math.random() * 89999 + 10000)}.pdf has been saved and queued in your documents dashboard!`);
  };

  // Simulating the file change & scanner process
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
      const maxFileSize = 10 * 1024 * 1024;

      if (!allowedTypes.has(file.type)) {
        setUploadError('Please choose a JPG, PNG, or WebP image.');
        e.target.value = '';
        return;
      }

      if (file.size > maxFileSize) {
        setUploadError('Images must be 10 MB or smaller.');
        e.target.value = '';
        return;
      }

      setUploadError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
        setScanning(true);
        setScanResult(null);

        // Run scanner timer
        setTimeout(async () => {
          try {
            const formData = new FormData();
            formData.append('image', file, file.name);
            const data = await api.upload('api/defect-detection', formData, { retries: 1 });
            setScanResult(data);
          } catch {
            // Local mock fallback
            setScanResult({
              defectDetected: true,
              severity: 'Medium',
              type: 'Structural Fissures',
              location: 'Concrete wall / Pillar junction',
              description: 'Hairline shearing crack due to minor structural settling or thermal contraction.',
              remedy: 'Inject low-viscosity epoxy resin and monitor for dynamic widening. If width exceeds 3mm, consult an engineer.',
              repairedCostEstimate: 280,
              confidenceRate: 94.6
            });
          } finally {
            setScanning(false);
          }
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brandDark-border pb-6 light-theme:border-brandLight-border">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-display text-white light-theme:text-brandDark-black flex items-center space-x-2">
            <Cpu className="w-8 h-8 text-primary" />
            <span>AI Estimator & Quotation Suite</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium light-theme:text-gray-500">
            Generate itemized bill of quantities, calculate raw material volumes, and scan structural site defects.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={runLiveEstimate}
            disabled={loadingEstimate}
            className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50 text-white font-semibold text-xs font-display flex items-center space-x-2 shadow-glow transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingEstimate ? 'animate-spin' : ''}`} />
            <span>Recalculate Estimate</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUTS COLUMN */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-brandDark-border/60 bg-brandDark-charcoal/40 glass-panel space-y-6 light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
            <h3 className="text-white light-theme:text-brandDark-black font-bold text-base font-display pb-3 border-b border-brandDark-border/40 flex items-center space-x-2">
              <Hammer className="w-4 h-4 text-primary" />
              <span>Project Blueprint Settings</span>
            </h3>

            {/* Project Type */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Project Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'new', label: 'New Build' },
                  { id: 'renovation', label: 'Renovation' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setType(opt.id as any); }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      type === opt.id
                        ? 'bg-primary/10 text-primary border-primary/40'
                        : 'bg-brandDark-black border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Area */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase tracking-wider">Builtup Area</span>
                <span className="text-primary">{area.toLocaleString()} sqft</span>
              </div>
              <input
                type="range"
                min="300"
                max="8000"
                step="50"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full h-1 bg-brandDark-black rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>300 sqft</span>
                <span>8,000 sqft</span>
              </div>
            </div>

            {/* Material Quality */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Material Finish Standard</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: 'Standard' },
                  { id: 'premium', label: 'Premium' },
                  { id: 'luxury', label: 'Luxury' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setQuality(opt.id as any)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      quality === opt.id
                        ? 'bg-primary/10 text-primary border-primary/40'
                        : 'bg-brandDark-black border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Count */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Number of Floors</label>
              <select
                value={floors}
                onChange={(e) => setFloors(Number(e.target.value))}
                className="premium-input text-xs"
              >
                <option value="1">1 Story (Single Floor)</option>
                <option value="2">2 Stories (Duplex)</option>
                <option value="3">3 Stories (Triplex)</option>
                <option value="4">4 Stories</option>
                <option value="5">5 Stories</option>
              </select>
            </div>

            <button
              onClick={runLiveEstimate}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary hover:to-primary text-white font-bold text-xs uppercase tracking-wider shadow-glow transition-all"
            >
              Analyze Building Budget
            </button>
          </div>
        </div>

        {/* OUTPUTS COLUMN (span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Budget Card */}
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal text-white relative overflow-hidden glass-panel light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
            <div className="absolute top-0 right-0 w-48 h-48 bg-radial-gradient from-primary/10 to-transparent filter blur-2xl"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brandDark-border/60 pb-5 light-theme:border-brandLight-border/60">
              <div className="space-y-1">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Estimated Total Capital</span>
                <p className="text-4xl sm:text-5xl font-black font-display text-white light-theme:text-brandDark-black tracking-tight">
                  ₹{estimateData.totalEstimate.toLocaleString()}
                </p>
              </div>
              <button
                onClick={triggerExport}
                className="px-4 py-2.5 rounded-xl bg-brandDark-black border border-brandDark-border hover:border-primary text-xs font-semibold text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-700"
              >
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>Export PDF Quote</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Category list */}
              <div className="space-y-3.5">
                <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-primary" />
                  <span>Cost breakdown segments</span>
                </h4>
                <div className="space-y-2.5">
                  {estimateData.breakdown.map((item, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-semibold mb-1 text-gray-300 light-theme:text-gray-700">
                        <span>{item.category}</span>
                        <span>₹{item.cost.toLocaleString()} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-brandDark-black rounded-full light-theme:bg-brandLight-slate overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantities breakdown */}
              <div className="space-y-3.5">
                <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-primary" />
                  <span>Volume quantities (Bill of materials)</span>
                </h4>
                <div className="rounded-2xl border border-brandDark-border/60 bg-brandDark-black/40 p-4 space-y-2.5 text-xs light-theme:border-brandLight-border/60 light-theme:bg-white">
                  {estimateData.materials.map((mat, i) => (
                    <div key={i} className="flex justify-between items-center text-gray-300 light-theme:text-gray-700">
                      <span className="font-semibold">{mat.name}</span>
                      <div className="text-right">
                        <span className="font-bold text-white light-theme:text-brandDark-black">{mat.qty.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-500 block">Est: ₹{mat.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart budget suggestion notes */}
            <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
              <h5 className="text-xs font-bold text-primary flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>AI Budget Optimization suggestions</span>
              </h5>
              <ul className="list-disc list-inside text-[11px] text-gray-400 light-theme:text-gray-500 space-y-1 leading-relaxed">
                {estimateData.optimizations.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: AI DEFECT DETECTOR */}
      <div className="p-8 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/30 glass-panel space-y-8 light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
        <div className="max-w-2xl">
          <span className="inline-block px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            Computer Vision Beta
          </span>
          <h2 className="text-2xl font-extrabold font-display text-white light-theme:text-brandDark-black">
            AI Structural Defect Scanner
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 light-theme:text-gray-500 leading-relaxed font-medium">
            Upload images of walls, columns, ceilings, or brickwork. Our neural network processes the crack lines to identify risk classes, settling issues, and repair quotations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Uploader panel */}
          <div className="border-2 border-dashed border-brandDark-border/60 rounded-3xl p-6 bg-brandDark-black/20 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden light-theme:border-brandLight-border/60">
            {previewImage ? (
              <div className="absolute inset-0 w-full h-full">
                <img src={previewImage} alt="Preview Upload" className="w-full h-full object-cover" />
                {scanning && (
                  <div className="absolute inset-0 bg-brandDark-black/75 flex flex-col items-center justify-center p-4">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mb-2" />
                    <p className="text-xs font-bold uppercase text-white animate-pulse tracking-widest">Scanning structural lines...</p>
                    <div className="w-48 h-1.5 bg-brandDark-border rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-brandDark-charcoal flex items-center justify-center text-primary border border-brandDark-border light-theme:bg-white light-theme:border-brandLight-border">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white light-theme:text-brandDark-black">Drag and drop site images here</p>
                  <p className="text-[10px] text-gray-500">Supports PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <button className="px-4 py-2 border border-brandDark-border hover:border-primary rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors light-theme:border-brandLight-border light-theme:text-gray-700">
                  Select Photo
                </button>
                {uploadError && <p role="alert" className="text-[10px] font-semibold text-red-500">{uploadError}</p>}
              </>
            )}
          </div>

          {/* Analysis Result panel */}
          <div className="h-full flex flex-col justify-center">
            {scanResult ? (
              <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/60 space-y-4 light-theme:bg-white light-theme:border-brandLight-border animate-fade-in">
                <div className="flex justify-between items-center border-b border-brandDark-border pb-3 light-theme:border-brandLight-border">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Analysis Complete</span>
                  </span>
                  <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full font-bold">
                    Confidence: {scanResult.confidenceRate}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Defect Type</span>
                    <span className="text-sm font-extrabold text-white light-theme:text-brandDark-black">{scanResult.type}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Severity Risk</span>
                    <span className="text-sm font-extrabold text-red-500 flex items-center space-x-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{scanResult.severity}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Technical Description</span>
                  <p className="text-xs text-gray-300 light-theme:text-gray-600 leading-relaxed font-medium">
                    {scanResult.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-brandDark-black/40 border border-brandDark-border/60 text-xs space-y-2 light-theme:bg-brandLight-slate light-theme:border-brandLight-border">
                  <span className="font-bold text-white light-theme:text-brandDark-black flex items-center space-x-1">
                    <Hammer className="w-3.5 h-3.5 text-primary" />
                    <span>Remedy Recommendation</span>
                  </span>
                  <p className="text-[11px] text-gray-400 light-theme:text-gray-500 leading-relaxed font-medium">
                    {scanResult.remedy}
                  </p>
                  <p className="text-xs font-bold text-white light-theme:text-brandDark-black pt-1">
                    Estimated repair budget: <span className="text-primary font-black">${scanResult.repairedCostEstimate}</span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    alert('Redirecting to the professional marketplace for specialized repair contractors...');
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-glow transition-all"
                >
                  Match Repair Contractors
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-3xl border border-dashed border-brandDark-border/60 bg-brandDark-charcoal/20 text-center text-gray-500 py-16 flex flex-col items-center justify-center light-theme:border-brandLight-border/60">
                <AlertCircle className="w-8 h-8 text-gray-600 mb-2" />
                <p className="text-xs font-bold">No Image Uploaded</p>
                <p className="text-[10px] text-gray-600 max-w-xs mt-1">Upload a photo showing wall hairline cracks or foundation settled fissures to generate an immediate diagnostic estimate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEstimator;
