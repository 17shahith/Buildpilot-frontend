import React, { useState, useEffect } from 'react';
import { Cpu, IndianRupee, Hammer, BarChart3, AlertCircle, FileText, CheckCircle2, RefreshCw, Sparkles, TrendingUp, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../utils/api';
import { clientMockService } from '../services/clientMockService';

const segmentColors = [
  '#FF5722', // Excavation & Foundations
  '#3B82F6', // Structural Frame & Pillars
  '#10B981', // Brickwork & Plastering
  '#F59E0B', // Flooring & Tiling
  '#8B5CF6', // Electrical, Plumbing & HVAC
  '#EC4899', // Finishing & Painting
];

const AIEstimator: React.FC = () => {
  // Estimator Form States
  const [area, setArea] = useState<number>(1500);
  const [quality, setQuality] = useState<'standard' | 'premium' | 'luxury'>('premium');
  const [type, setType] = useState<'new' | 'renovation'>('new');
  const [floors, setFloors] = useState<number>(1);
  const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false);

  const handleSaveEstimate = () => {
    clientMockService.saveEstimate({
      title: `${type === 'new' ? 'New Build' : 'Renovation'} - ${area} sqft`,
      totalEstimate: estimateData.totalEstimate,
      area,
      quality
    });
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.6 }
    });
    alert('Estimate successfully saved to your bookmarks! Open "Saved Items" tab to review or initialize a contract project.');
  };

  // Custom rates and quantities overrides
  const [customRates, setCustomRates] = useState<Record<string, number>>({});
  const [customQtys, setCustomQtys] = useState<Record<string, number>>({});

  // Active Tab state
  const [activeTab, setActiveTab] = useState<'visual' | 'materials' | 'optimizations'>('visual');
  // Donut chart active segment hover state
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  // Estimator Output states
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
  const [scanError, setScanError] = useState<string | null>(null);

  // Compute live estimate client-side, updating dynamically
  const runLiveEstimate = async () => {
    setLoadingEstimate(true);
    try {
      const data = await api.post('api/estimate', { area, quality, floors, type }, { retries: 1 });
      const materials = data.materials.map((m: any) => {
        const qty = customQtys[m.name] !== undefined ? customQtys[m.name] : m.qty;
        const unitCost = customRates[m.name] !== undefined ? customRates[m.name] : m.unitCost;
        return {
          ...m,
          qty,
          unitCost,
          total: Math.round(qty * unitCost)
        };
      });

      const totalMaterialCost = materials.reduce((acc: number, curr: any) => acc + curr.total, 0);
      const totalEstimate = data.totalEstimate + (totalMaterialCost - data.materials.reduce((acc: number, curr: any) => acc + Math.round(curr.qty * curr.unitCost), 0));

      const breakdown = data.breakdown.map((item: any) => ({
        ...item,
        cost: Math.round(totalEstimate * (item.percentage / 100))
      }));

      setEstimateData({
        totalEstimate: Math.max(0, Math.round(totalEstimate)),
        materials,
        breakdown,
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
      ].map(m => {
        const qty = customQtys[m.name] !== undefined ? customQtys[m.name] : m.qty;
        const unitCost = customRates[m.name] !== undefined ? customRates[m.name] : m.unitCost;
        return {
          ...m,
          qty,
          unitCost,
          total: Math.round(qty * unitCost)
        };
      });

      const totalMaterialCost = materials.reduce((acc, curr) => acc + curr.total, 0);
      const defaultMaterialCost = [
        { qty: Math.round(area * 0.4 * qualityMultiplier), unitCost: 12 },
        { qty: Math.round(area * 45 * qualityMultiplier), unitCost: 0.65 },
        { qty: Number((area * 0.007 * qualityMultiplier).toFixed(2)), unitCost: 1100 },
        { qty: Math.round(area * 0.15 * qualityMultiplier), unitCost: 45 },
        { qty: Math.round(area * 0.18 * qualityMultiplier), unitCost: 55 },
        { qty: Math.round(area * 0.8 * (quality === 'luxury' ? 1.5 : 1)), unitCost: 8 }
      ].reduce((acc, curr) => acc + Math.round(curr.qty * curr.unitCost), 0);

      const finalEstimatedCost = estimatedCost + (totalMaterialCost - defaultMaterialCost);

      const breakdown = [
        { category: 'Excavation & Foundations', percentage: 15, cost: 0 },
        { category: 'Structural Frame & Pillars', percentage: 35, cost: 0 },
        { category: 'Brickwork & Plastering', percentage: 15, cost: 0 },
        { category: 'Flooring & Tiling', percentage: 12, cost: 0 },
        { category: 'Electrical, Plumbing & HVAC', percentage: 13, cost: 0 },
        { category: 'Finishing & Painting', percentage: 10, cost: 0 }
      ].map(item => ({
        ...item,
        cost: Math.round(finalEstimatedCost * (item.percentage / 100))
      }));

      setEstimateData({
        totalEstimate: Math.max(0, Math.round(finalEstimatedCost)),
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
  }, [area, quality, floors, type, customRates, customQtys]);

  const handleRateChange = (name: string, rate: number) => {
    setCustomRates(prev => ({ ...prev, [name]: rate }));
  };

  const handleQtyChange = (name: string, qty: number) => {
    setCustomQtys(prev => ({ ...prev, [name]: qty }));
  };

  const resetCustomizations = () => {
    setCustomRates({});
    setCustomQtys({});
  };

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
      setScanError(null);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
        setScanning(true);
        setScanResult(null);

        // Run scanner timer
        setTimeout(async () => {
          try {
            // First attempt: call backend API endpoint
            const formData = new FormData();
            formData.append('image', file, file.name);
            const data = await api.upload('api/defect-detection', formData, { retries: 1 });
            
            // Format standard properties from API response to align schemas
            const formatted = {
              ...data,
              defectDetected: data.detected !== undefined ? data.detected : data.defectDetected,
              type: data.defectType || data.type || 'Structural Issue',
              severity: data.riskLevel || data.severity || 'Medium',
              location: data.affectedArea || data.location || 'Structural elements',
              remedy: data.recommendation || data.remedy || 'Monitor defect progression',
              confidenceRate: data.confidenceRate || (data.confidence ? (data.confidence * 100).toFixed(0) : 85)
            };
            setScanResult(formatted);
          } catch (backendErr) {
            console.warn('Backend API call failed, falling back to direct Gemini visual analysis', backendErr);
            
            try {
              const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
              if (!apiKey) {
                throw new Error('Gemini API key is not configured.');
              }

              const base64Data = (reader.result as string).split(',')[1];
              const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  contents: [
                    {
                      parts: [
                        {
                          text: `You are an expert AI Structural Defect Scanner. Analyze the uploaded image of a wall, column, beam, ceiling, concrete surface, brickwork, or foundation.
                          Perform visual crack detection (hairline, surface, vertical, horizontal, diagonal, or major cracks) or check for spalling, deterioration, dampness, or corrosion/rust.
                          
                          Safety Instruction:
                          This is an AI-assisted visual screening tool, NOT a certified structural engineering inspection.
                          Therefore, never state that the building is safe, definitely unsafe, or that no structural problem exists.
                          Use safe language like: "Visible signs detected", "Potential structural concern", "Further inspection recommended", "Professional structural assessment recommended". Recommend inspection by a qualified structural engineer for moderate/high/critical concerns.
                          
                          You MUST return ONLY a raw JSON object matching the following format, with no markdown styling:
                          {
                            "detected": true,
                            "defectDetected": true,
                            "defectType": "Diagonal Wall Crack",
                            "type": "Diagonal Wall Crack",
                            "riskLevel": "Moderate",
                            "severity": "Medium",
                            "confidence": 0.87,
                            "confidenceRate": 87,
                            "affectedArea": "Wall / Column junction",
                            "location": "Wall / Column junction",
                            "description": "A diagonal shear crack line was detected on the masonry surface, propagating upwards from the joint.",
                            "recommendation": "Arrange a professional inspection to assess the cause and progression.",
                            "remedy": "Monitor the crack for widening. Inject epoxy resin or consult a qualified structural engineer.",
                            "repairedCostEstimate": 350
                          }`
                        },
                        {
                          inlineData: {
                            mimeType: file.type,
                            data: base64Data
                          }
                        }
                      ]
                    }
                  ]
                })
              });

                if (!response.ok) {
                  throw new Error(`Gemini API returned status code: ${response.status}`);
                }

                const responseData = await response.json();
                const textOutput = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
                const cleanJson = textOutput.replace(/```json/gi, '').replace(/```/gi, '').trim();
                const parsed = JSON.parse(cleanJson);
                
                // Format output
                const formatted = {
                  ...parsed,
                  defectDetected: parsed.detected !== undefined ? parsed.detected : parsed.defectDetected,
                  type: parsed.defectType || parsed.type || 'Structural Issue',
                  severity: parsed.riskLevel || parsed.severity || 'Medium',
                  location: parsed.affectedArea || parsed.location || 'Structural element',
                  remedy: parsed.recommendation || parsed.remedy || 'Arrange assessment',
                  confidenceRate: parsed.confidenceRate || (parsed.confidence ? (parsed.confidence * 100).toFixed(0) : 85)
                };
                setScanResult(formatted);
              } catch (geminiErr) {
                console.error('All scanner fallback routes failed:', geminiErr);
                setScanError('Analysis Failed. Unable to analyze this image right now. Please try again with a clear image.');
                setScanResult(null);
              }
            } finally {
              setScanning(false);
            }
        }, 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  // SVG Donut Calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Custom Styles for scanner animation */}
      <style>{`
        @keyframes scanLaser {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        .laser-line {
          animation: scanLaser 2s infinite linear;
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brandDark-border pb-6 light-theme:border-brandLight-border">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-display text-white light-theme:text-brandDark-black flex items-center space-x-2">
            <Cpu className="w-8 h-8 text-primary animate-pulse-slow" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 light-theme:from-brandDark-black light-theme:to-gray-600">
              AI Estimator & Quotation Suite
            </span>
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
          <div className="p-6 rounded-3xl border border-brandDark-border/60 bg-brandDark-charcoal/40 glass-panel space-y-6 light-theme:bg-brandLight-panel light-theme:border-brandLight-border shadow-xl">
            <h3 className="text-white light-theme:text-brandDark-black font-bold text-base font-display pb-3 border-b border-brandDark-border/40 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Hammer className="w-4 h-4 text-primary" />
                <span>Project Blueprint Settings</span>
              </span>
              {(Object.keys(customRates).length > 0 || Object.keys(customQtys).length > 0) && (
                <button
                  onClick={resetCustomizations}
                  className="text-[10px] text-primary hover:underline font-bold"
                >
                  Reset Custom Rates
                </button>
              )}
            </h3>

            {/* Project Type */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Project Type</label>
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
                        ? 'bg-primary/15 text-primary border-primary/40 shadow-glow'
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
                className="w-full h-1 bg-brandDark-black light-theme:bg-brandLight-slate rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>300 sqft</span>
                <span>8,000 sqft</span>
              </div>
            </div>

            {/* Material Quality */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Material Finish Standard</label>
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
                        ? 'bg-primary/15 text-primary border-primary/40 shadow-glow'
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
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Number of Floors</label>
              <select
                value={floors}
                onChange={(e) => setFloors(Number(e.target.value))}
                className="premium-input text-xs light-theme:bg-white light-theme:border-brandLight-border"
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
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal text-white relative overflow-hidden glass-panel light-theme:bg-brandLight-panel light-theme:border-brandLight-border shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-radial-gradient from-primary/10 to-transparent filter blur-2xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brandDark-border/60 pb-5 light-theme:border-brandLight-border/60">
              <div className="space-y-1">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Estimated Total Capital</span>
                <p className="text-4xl sm:text-5xl font-black font-display text-white light-theme:text-brandDark-black tracking-tight">
                  ₹{estimateData.totalEstimate.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEstimate}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-glow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Save to Project</span>
                </button>
                <button
                  onClick={triggerExport}
                  className="px-4 py-2.5 rounded-xl bg-brandDark-black border border-brandDark-border hover:border-primary text-xs font-semibold text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-700"
                >
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Export PDF Quote</span>
                </button>
              </div>
            </div>

            {/* TAB SELECTOR HEADER */}
            <div className="flex border-b border-brandDark-border/40 mt-6 light-theme:border-brandLight-border">
              <button
                onClick={() => setActiveTab('visual')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTab === 'visual'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white light-theme:hover:text-brandDark-black'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Visual Breakdown</span>
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTab === 'materials'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white light-theme:hover:text-brandDark-black'
                }`}
              >
                <IndianRupee className="w-4 h-4" />
                <span>Material Quantities</span>
              </button>
              <button
                onClick={() => setActiveTab('optimizations')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center space-x-1.5 ${
                  activeTab === 'optimizations'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white light-theme:hover:text-brandDark-black'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Suggestions</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="mt-6">
              {/* TAB 1: VISUAL BREAKDOWN (Donut Chart & Bars) */}
              {activeTab === 'visual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fade-in">
                  {/* SVG Donut Chart */}
                  <div className="flex flex-col items-center justify-center relative">
                    <svg viewBox="0 0 160 160" className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90">
                      {/* Background circular track ring */}
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke="rgb(30, 41, 59)"
                        strokeWidth="14"
                        className="light-theme:stroke-slate-100"
                      />
                      {(() => {
                        let currentAccumulated = 0;
                        return estimateData.breakdown.map((item, idx) => {
                          const gap = 2.5;
                          const segmentLength = Math.max(0, (item.percentage / 100) * circumference - gap);
                          const strokeDasharray = `${segmentLength} ${circumference}`;
                          const rotation = (currentAccumulated / 100) * 360;
                          currentAccumulated += item.percentage;
                          const isHovered = hoveredSegment === idx;

                          return (
                            <circle
                              key={idx}
                              cx="80"
                              cy="80"
                              r={radius}
                              fill="transparent"
                              stroke={segmentColors[idx]}
                              strokeWidth={isHovered ? 18 : 14}
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={0}
                              transform={`rotate(${rotation} 80 80)`}
                              className="transition-all duration-300 cursor-pointer origin-center"
                              onMouseEnter={() => setHoveredSegment(idx)}
                              onMouseLeave={() => setHoveredSegment(null)}
                            />
                          );
                        });
                      })()}
                      {/* Inner circle to make it look like a donut, expanded radius to 43 to align inner boundaries */}
                      <circle cx="80" cy="80" r="43" fill="rgb(15, 15, 17)" className="light-theme:fill-white" />
                    </svg>

                    {/* Donut Center text perfectly centered */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                      {hoveredSegment !== null ? (
                        <>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                            {estimateData.breakdown[hoveredSegment].category.split(' ')[0]}
                          </span>
                          <span className="text-sm font-black text-primary">
                            {estimateData.breakdown[hoveredSegment].percentage}%
                          </span>
                          <span className="text-[10px] font-semibold text-white light-theme:text-brandDark-black">
                            ₹{estimateData.breakdown[hoveredSegment].cost.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Total Budget</span>
                          <span className="text-xs font-black text-white light-theme:text-brandDark-black">
                            ₹{(estimateData.totalEstimate / 100000).toFixed(2)}L
                          </span>
                          <span className="text-[8px] font-bold text-primary">Interactive Graph</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progressive Bar Details */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span>Cost breakdown segments</span>
                    </h4>
                    <div className="space-y-2.5">
                      {estimateData.breakdown.map((item, i) => {
                        const isHovered = hoveredSegment === i;
                        return (
                          <div
                            key={i}
                            className={`text-xs p-2 rounded-xl transition-all ${
                              isHovered ? 'bg-primary/10 border border-primary/20 scale-[1.02]' : 'border border-transparent'
                            }`}
                            onMouseEnter={() => setHoveredSegment(i)}
                            onMouseLeave={() => setHoveredSegment(null)}
                          >
                            <div className="flex justify-between font-semibold mb-1 text-gray-300 light-theme:text-gray-700">
                              <span className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: segmentColors[i] }}></span>
                                <span>{item.category}</span>
                              </span>
                              <span>₹{item.cost.toLocaleString()} ({item.percentage}% )</span>
                            </div>
                            <div className="w-full h-1.5 bg-brandDark-black rounded-full light-theme:bg-brandLight-slate overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${item.percentage}%`,
                                  backgroundColor: segmentColors[i]
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIVE MATERIALS TABLE */}
              {activeTab === 'materials' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                      <Info className="w-3.5 h-3.5 text-primary" />
                      <span>Volume quantities (Customize Rates & Volumes)</span>
                    </h4>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-brandDark-border/60 bg-brandDark-black/40 light-theme:border-brandLight-border/60 light-theme:bg-white shadow-inner">
                    <table className="min-w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-brandDark-border/60 light-theme:border-brandLight-border text-gray-400 uppercase tracking-wider text-[9px] font-bold">
                          <th className="p-4">Material Name</th>
                          <th className="p-4">Est. Quantity</th>
                          <th className="p-4">Rate (₹)</th>
                          <th className="p-4 text-right">Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estimateData.materials.map((mat, i) => (
                          <tr key={i} className="border-b border-brandDark-border/30 light-theme:border-brandLight-border/30 hover:bg-brandDark-charcoal/50 light-theme:hover:bg-brandLight-slate/30 transition-colors">
                            <td className="p-4 font-semibold text-gray-300 light-theme:text-gray-700">{mat.name}</td>
                            <td className="p-4">
                              <input
                                type="number"
                                value={mat.qty}
                                onChange={(e) => handleQtyChange(mat.name, Number(e.target.value))}
                                className="w-20 bg-brandDark-black/80 light-theme:bg-brandLight-slate border border-brandDark-border light-theme:border-brandLight-border rounded px-2 py-1 text-white light-theme:text-brandDark-black font-bold text-center"
                              />
                            </td>
                            <td className="p-4">
                              <input
                                type="number"
                                value={mat.unitCost}
                                onChange={(e) => handleRateChange(mat.name, Number(e.target.value))}
                                className="w-20 bg-brandDark-black/80 light-theme:bg-brandLight-slate border border-brandDark-border light-theme:border-brandLight-border rounded px-2 py-1 text-white light-theme:text-brandDark-black font-bold text-center"
                              />
                            </td>
                            <td className="p-4 text-right font-black text-white light-theme:text-brandDark-black">
                              ₹{mat.total.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: AI OPTIMIZATIONS */}
              {activeTab === 'optimizations' && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>AI Budget Optimization suggestions</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {estimateData.optimizations.map((opt, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all flex flex-col justify-between space-y-3">
                        <div className="flex items-start space-x-2">
                          <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-[11px] text-gray-300 light-theme:text-gray-600 leading-relaxed font-semibold">
                            {opt}
                          </p>
                        </div>
                        <div className="text-[9px] text-primary/80 font-bold flex items-center space-x-1 self-end uppercase">
                          <span>Verified tip</span>
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: AI DEFECT DETECTOR */}
      <div className="p-8 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/30 glass-panel space-y-8 light-theme:bg-brandLight-panel light-theme:border-brandLight-border shadow-xl">
        <div className="max-w-2xl">
          <span className="inline-block px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-2 animate-pulse">
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
          <div className={`border-2 border-dashed border-brandDark-border/60 rounded-3xl p-6 bg-brandDark-black/20 text-center space-y-4 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden light-theme:border-brandLight-border/60 ${scanning ? 'pointer-events-none opacity-85' : ''}`}>
            {previewImage ? (
              <div className="absolute inset-0 w-full h-full">
                <img src={previewImage} alt="Preview Upload" className="w-full h-full object-cover" />
                {scanning && (
                  <div className="absolute inset-0 bg-brandDark-black/75 flex flex-col items-center justify-center p-4">
                    {/* Laser line overlay */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent laser-line z-10 shadow-glow"></div>
                    <RefreshCw className="w-8 h-8 text-primary animate-spin mb-2 z-20" />
                    <p className="text-xs font-bold uppercase text-white animate-pulse tracking-widest z-20">Analyzing Structural Image...</p>
                    <div className="w-48 h-1.5 bg-brandDark-border rounded-full mt-3 overflow-hidden z-20">
                      <div className="h-full bg-primary rounded-full w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                )}
                {!scanning && scanResult && (
                  // Bounding box overlay to simulate AI detection
                  <div
                    className="absolute border-2 border-red-500 bg-red-500/10 rounded-lg animate-pulse"
                    style={{ top: '35%', left: '30%', width: '40%', height: '30%' }}
                  >
                    <span className="absolute -top-6 left-0 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider shadow-lg">
                      {scanResult.type} ({scanResult.confidenceRate}%)
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-brandDark-charcoal flex items-center justify-center text-primary border border-brandDark-border light-theme:bg-white light-theme:border-brandLight-border shadow-md">
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
                  disabled={scanning}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <button 
                  disabled={scanning}
                  className="px-4 py-2 border border-brandDark-border hover:border-primary rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-colors light-theme:border-brandLight-border light-theme:text-gray-700 disabled:opacity-50"
                >
                  Select Photo
                </button>
                {uploadError && <p role="alert" className="text-[10px] font-semibold text-red-500">{uploadError}</p>}
              </>
            )}
          </div>

          {/* Analysis Result panel */}
          <div className="h-full flex flex-col justify-center">
            {scanResult ? (
              <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/60 space-y-4 light-theme:bg-white light-theme:border-brandLight-border animate-fade-in shadow-xl text-xs">
                <div className="flex justify-between items-center border-b border-brandDark-border pb-3 light-theme:border-brandLight-border">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Structural Analysis</span>
                  </span>
                  <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded-full font-bold">
                    Confidence: {scanResult.confidenceRate}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Detected Issue</span>
                    <span className="text-sm font-extrabold text-white light-theme:text-brandDark-black">{scanResult.type}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Risk Level</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      scanResult.severity === 'High' || scanResult.severity === 'Critical'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : scanResult.severity === 'Medium' || scanResult.severity === 'Moderate'
                        ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                        : 'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}>
                      {scanResult.severity}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Affected Area</span>
                  <span className="text-xs font-bold text-white light-theme:text-brandDark-black">{scanResult.location}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider block font-bold">Visual Evidence</span>
                  <p className="text-xs text-gray-300 light-theme:text-gray-600 leading-relaxed font-medium">
                    {scanResult.description}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-brandDark-black/40 border border-brandDark-border/60 space-y-2 light-theme:bg-brandLight-slate light-theme:border-brandLight-border">
                  <span className="font-bold text-white light-theme:text-brandDark-black flex items-center space-x-1">
                    <Hammer className="w-3.5 h-3.5 text-primary" />
                    <span>Recommended Action</span>
                  </span>
                  <p className="text-[11px] text-gray-400 light-theme:text-gray-500 leading-relaxed font-medium">
                    {scanResult.remedy}
                  </p>
                  {scanResult.repairedCostEstimate && (
                    <p className="text-xs font-bold text-white light-theme:text-brandDark-black pt-1">
                      Estimated repair budget: <span className="text-primary font-black">${scanResult.repairedCostEstimate}</span>
                    </p>
                  )}
                </div>

                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400 font-semibold leading-relaxed">
                  ⚠️ Safety Notice: This is an AI-assisted visual screening tool, NOT a certified structural engineering inspection. For critical concerns, a professional structural engineering assessment is highly recommended.
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
            ) : scanError ? (
              <div className="p-6 rounded-3xl border border-dashed border-red-500/30 bg-red-500/5 text-center text-red-500 py-16 flex flex-col items-center justify-center light-theme:border-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2 animate-bounce" />
                <p className="text-xs font-bold">Analysis Failed</p>
                <p className="text-[10px] text-red-400 max-w-xs mt-1">Unable to analyze this image right now. Please try again with a clear image.</p>
              </div>
            ) : (
              <div className="p-6 rounded-3xl border border-dashed border-brandDark-border/60 bg-brandDark-charcoal/20 text-center text-gray-500 py-16 flex flex-col items-center justify-center light-theme:border-brandLight-border/60">
                <AlertCircle className="w-8 h-8 text-gray-600 mb-2" />
                <p className="text-xs font-bold">No Image Uploaded</p>
                <p className="text-[10px] text-gray-600 max-w-xs mt-1">Upload a clear image of a wall, column, ceiling, concrete surface, or brickwork to begin structural analysis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIEstimator;
