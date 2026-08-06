import React, { useState, useEffect, useRef } from 'react';
import {
  Sliders, Camera, Download, Save, Share2, Info,
  Check, RefreshCw, ZoomIn, ZoomOut, UserPlus, FileText, Compass,
  Pipette, Move, RotateCcw, Box
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MaterialMetric {
  durability: number;
  water: number;
  scratch: number;
  termite: number;
  maintenance: string;
  warranty: string;
  price: string;
  recommend: string;
}

const materialMetrics: Record<string, MaterialMetric> = {
  'Solid Wood': { durability: 5, water: 3, scratch: 4, termite: 2, maintenance: 'High', warranty: '10 Years', price: 'Premium', recommend: 'Highly recommended for premium classic look.' },
  'Plywood': { durability: 4, water: 4, scratch: 4, termite: 4, maintenance: 'Medium', warranty: '7 Years', price: 'Moderate', recommend: 'Best all-rounder for wet/dry areas.' },
  'MDF': { durability: 3, water: 2, scratch: 3, termite: 3, maintenance: 'Low', warranty: '5 Years', price: 'Economic', recommend: 'Ideal for dry areas, wardrobes, and cabinets.' },
  'PVC': { durability: 3, water: 5, scratch: 2, termite: 5, maintenance: 'Low', warranty: '15 Years', price: 'Economic', recommend: 'Extremely water-resistant, ideal for kitchen sinks.' }
};

const AIModularStudio: React.FC = () => {
  // Top selector: wardrobe, tv, kitchen
  const [activeProduct, setActiveProduct] = useState<'wardrobe' | 'tv' | 'kitchen'>('wardrobe');

  // Shared Configs
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Plywood');
  const [finishOption, setFinishOption] = useState<string>('Matte');
  const [paintColor, setPaintColor] = useState<string>('#F5F5F0'); // Ivory/Alabaster
  const [lighting, setLighting] = useState<string>('Warm White');
  const [handleStyle, setHandleStyle] = useState<string>('Modern');

  // 1. Wardrobe Configs
  const [wardrobeDoorType, setWardrobeDoorType] = useState<string>('Sliding Door');
  const [wardrobeSize, setWardrobeSize] = useState<string>('Double Door');
  const [wardrobeAccessories, setWardrobeAccessories] = useState<string[]>(['Hanging Section', 'Drawers']);

  // 2. TV Unit Configs
  const [tvUnitWidth, setTvUnitWidth] = useState<number>(6); // Feet
  const [tvUnitHeight, setTvUnitHeight] = useState<number>(5); // Feet
  const [tvShelfCount, setTvShelfCount] = useState<number>(3);
  const [tvCabinetLayout, setTvCabinetLayout] = useState<string>('Open Shelf');

  // 3. Modular Kitchen Configs
  const [kitchenType, setKitchenType] = useState<string>('L Shape');
  const [kitchenCountertop, setKitchenCountertop] = useState<string>('Quartz');
  const [kitchenAccessories, setKitchenAccessories] = useState<string[]>(['Soft Close Drawers', 'Cutlery Organizer']);

  // General Orbit & View state
  const [zoom, setZoom] = useState<number>(1.0);
  const [yaw, setYaw] = useState<number>(140);
  const [pitch, setPitch] = useState<number>(-10);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [sliderPos, setSliderPos] = useState<number>(50); // Split slider %
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // Simulation states
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanPoints, setScanPoints] = useState<number>(0);
  const [flash, setFlash] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);

  // Color Options
  const colors = [
    { name: 'Classic Ivory', hex: '#FFFFF0' },
    { name: 'Warm Alabaster', hex: '#F5F5F0' },
    { name: 'Charcoal Slate', hex: '#2C302E' },
    { name: 'Sage Green', hex: '#7A8B7B' },
    { name: 'Pacific Blue', hex: '#2B506E' },
    { name: 'Ash Grey', hex: '#B2BEB5' }
  ];

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    
    const currentSplitX = (sliderPos / 100) * canvas.width;
    if (Math.abs(clickX - currentSplitX) < 20) {
      setIsDraggingSlider(true);
    } else {
      setIsDragging(true);
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (isDraggingSlider) {
      const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const newPos = Math.max(0, Math.min(100, (clickX / canvas.width) * 100));
      setSliderPos(newPos);
    } else if (isDragging) {
      const deltaX = e.clientX - lastMouseX.current;
      const deltaY = e.clientY - lastMouseY.current;

      setYaw(prev => {
        let next = prev + deltaX * 0.5;
        if (next > 220) next = 220;
        if (next < 80) next = 80;
        return next;
      });

      setPitch(prev => {
        let next = prev - deltaY * 0.5;
        if (next > 30) next = 30;
        if (next < -40) next = -40;
        return next;
      });

      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    setIsDraggingSlider(false);
  };

  // Dynamic Cost Calculations
  const calculateCosts = () => {
    let baseCost = 50000;
    if (activeProduct === 'wardrobe') {
      baseCost = wardrobeSize === 'Single Door' ? 32000 : wardrobeSize === 'Double Door' ? 62000 : 92000;
    } else if (activeProduct === 'tv') {
      baseCost = 25000 + (tvUnitWidth * 4000) + (tvShelfCount * 2500);
    } else {
      baseCost = kitchenType === 'Straight Kitchen' ? 110000 : kitchenType === 'L Shape' ? 170000 : 230000;
    }

    const matMultiplier = selectedMaterial === 'Solid Wood' ? 1.6 : selectedMaterial === 'Plywood' ? 1.25 : selectedMaterial === 'MDF' ? 0.95 : 0.85;
    const finishAdder = finishOption === 'High Gloss' || finishOption === 'Acrylic' ? 18000 : 6000;

    const materialCost = Math.round(baseCost * matMultiplier + finishAdder);
    const hardwareCost = Math.round(materialCost * 0.14);
    const accessoriesCost = Math.round(materialCost * 0.08);
    const laborCost = Math.round(materialCost * 0.12);
    const transportCost = 4500;
    const installationCost = Math.round(materialCost * 0.07);
    const subTotal = materialCost + hardwareCost + accessoriesCost + laborCost + transportCost + installationCost;
    const gst = Math.round(subTotal * 0.18);
    const grandTotal = subTotal + gst;

    return {
      materialCost,
      hardwareCost,
      accessoriesCost,
      laborCost,
      transportCost,
      installationCost,
      gst,
      grandTotal
    };
  };

  const costs = calculateCosts();

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let scanAngle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const splitX = (sliderPos / 100) * w;

      // Base coordinate projections
      const cx = w / 2 + (yaw - 140) * 2.2 * zoom;
      const cy = h / 2 - 10 + pitch * 1.3 * zoom;

      // DRAW BEFORE MODULE STATE (Raw metal framing structure)
      const drawBeforeState = () => {
        ctx.fillStyle = '#060609';
        ctx.fillRect(0, 0, w, h);

        // Technical drafting grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const grid = 30;
        for (let x = 0; x < w; x += grid) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = 0; y < h; y += grid) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(255, 87, 34, 0.3)';
        ctx.lineWidth = 1.5;

        if (activeProduct === 'wardrobe') {
          // Draw raw wardrobe skeleton carcass
          ctx.strokeRect(cx - 80, cy - 100, 160, 200);
          ctx.beginPath();
          ctx.moveTo(cx, cy - 100); ctx.lineTo(cx, cy + 100); // division
          ctx.moveTo(cx - 80, cy - 20); ctx.lineTo(cx + 80, cy - 20); // main shelf
          ctx.moveTo(cx - 80, cy + 40); ctx.lineTo(cx + 80, cy + 40); // drawer division
          ctx.stroke();
        } else if (activeProduct === 'tv') {
          // Draw raw wall panels skeleton
          ctx.strokeRect(cx - 120, cy - 60, 240, 120);
          ctx.strokeRect(cx - 100, cy - 30, 200, 60); // TV frame box outline
        } else {
          // Draw kitchen modular base boxes
          ctx.strokeRect(cx - 130, cy + 10, 260, 70);
          ctx.beginPath();
          ctx.moveTo(cx - 40, cy + 10); ctx.lineTo(cx - 40, cy + 80);
          ctx.moveTo(cx + 40, cy + 10); ctx.lineTo(cx + 40, cy + 80);
          ctx.stroke();
        }

        // Before Label
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('BEFORE: CARCASS FRAMING STRUCTURE', 20, 30);
      };

      // DRAW AFTER MODULE STATE (Finished styled furniture)
      const drawAfterState = () => {
        ctx.fillStyle = '#0F0F12';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;

        if (activeProduct === 'wardrobe') {
          // Draw styled wardrobe with selected paint color, finish, and handle
          ctx.fillStyle = paintColor;
          ctx.fillRect(cx - 85, cy - 105, 170, 210);
          ctx.strokeRect(cx - 85, cy - 105, 170, 210);

          // Door panel details
          ctx.strokeStyle = 'rgba(255, 87, 34, 0.4)';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 105); ctx.lineTo(cx, cy + 105);
          ctx.stroke();

          // Handles (Modern/Gold/Black/Wood)
          ctx.fillStyle = handleStyle === 'Gold' ? '#D4AF37' : handleStyle === 'Black' ? '#1A1A1A' : '#8B5A2B';
          ctx.fillRect(cx - 10, cy - 15, 4, 30);
          ctx.fillRect(cx + 6, cy - 15, 4, 30);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${wardrobeDoorType} (${wardrobeSize})`, cx, cy + 120);

        } else if (activeProduct === 'tv') {
          // Draw TV Unit back panel and shelves
          ctx.fillStyle = '#2C302E'; // Back panel wall color
          ctx.fillRect(cx - 130, cy - 70, 260, 140);

          // LED Backlight glow if active
          ctx.fillStyle = lighting.includes('Warm') ? 'rgba(255, 140, 0, 0.15)' : 'rgba(255, 255, 255, 0.12)';
          ctx.fillRect(cx - 105, cy - 45, 210, 90);

          // TV Screen
          ctx.fillStyle = '#050505';
          ctx.fillRect(cx - 90, cy - 35, 180, 70);
          ctx.strokeRect(cx - 90, cy - 35, 180, 70);

          // Floating unit base
          ctx.fillStyle = paintColor;
          ctx.fillRect(cx - 110, cy + 40, 220, 25);
          ctx.strokeRect(cx - 110, cy + 40, 220, 25);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`TV Unit Panel - Width: ${tvUnitWidth}ft`, cx, cy + 85);

        } else {
          // Draw Kitchen Base Counter cabinets & backsplash
          ctx.fillStyle = '#2A2A2E'; // Backsplash wall
          ctx.fillRect(cx - 140, cy - 60, 280, 130);

          // Countertop texture (Granite, Quartz, Marble)
          ctx.fillStyle = kitchenCountertop === 'Granite' ? '#4A4A4A' : kitchenCountertop === 'Marble' ? '#F5F5F0' : '#E6E6FA';
          ctx.fillRect(cx - 142, cy + 10, 284, 15);
          ctx.strokeRect(cx - 142, cy + 10, 284, 15);

          // Base cabinets
          ctx.fillStyle = paintColor;
          ctx.fillRect(cx - 140, cy + 25, 280, 55);
          ctx.strokeRect(cx - 140, cy + 25, 280, 55);

          // Cabinet lines
          ctx.strokeStyle = 'rgba(255, 87, 34, 0.3)';
          ctx.beginPath();
          ctx.moveTo(cx - 70, cy + 25); ctx.lineTo(cx - 70, cy + 80);
          ctx.moveTo(cx, cy + 25); ctx.lineTo(cx, cy + 80);
          ctx.moveTo(cx + 70, cy + 25); ctx.lineTo(cx + 70, cy + 80);
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${kitchenType} Kitchen`, cx, cy + 95);
        }

        // Ambiance illumination glow
        if (lighting.includes('Warm')) {
          ctx.fillStyle = 'rgba(255, 120, 0, 0.08)';
          ctx.fill();
        } else if (lighting.includes('Cool')) {
          ctx.fillStyle = 'rgba(0, 150, 255, 0.05)';
          ctx.fill();
        }
      };

      // 1. Draw Before carcass
      drawBeforeState();

      // 2. Draw After styled layout onto clipped half
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, w - splitX, h);
      ctx.clip();
      drawAfterState();
      ctx.restore();

      // 3. Draw divider slider handle line
      ctx.strokeStyle = '#FF5722';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.stroke();

      // Draw slider handle circle
      ctx.fillStyle = '#FF5722';
      ctx.shadowColor = 'rgba(255, 87, 34, 0.4)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(splitX, h / 2, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('◀ ▶', splitX, h / 2 + 4);

      // Radar line scanner overlay during scan simulation
      if (scanning) {
        scanAngle += 0.05;
        const scanY = cy + Math.sin(scanAngle) * 90;
        ctx.strokeStyle = 'rgba(255, 87, 34, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, scanY);
        ctx.lineTo(w - 10, scanY);
        ctx.stroke();
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [activeProduct, selectedMaterial, finishOption, paintColor, lighting, handleStyle, wardrobeDoorType, wardrobeSize, wardrobeAccessories, tvUnitWidth, tvUnitHeight, tvShelfCount, tvCabinetLayout, kitchenType, kitchenCountertop, kitchenAccessories, zoom, sliderPos, scanning, yaw, pitch]);

  const handleCameraScan = () => {
    setScanning(true);
    setScanPoints(0);
    const interval = setInterval(() => {
      setScanPoints(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          confetti({
            particleCount: 50,
            spread: 45,
            origin: { y: 0.7 }
          });
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 }
    });

    const link = document.createElement('a');
    link.download = `Modular_Studio_${activeProduct}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShareSession = () => {
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.8 }
    });
    alert('Modular design link shared successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {flash && (
        <div className="fixed inset-0 bg-white z-50 animate-ping pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brandDark-border pb-6 light-theme:border-brandLight-border">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-display text-white light-theme:text-brandDark-black flex items-center space-x-2">
            <Box className="w-8 h-8 text-primary animate-pulse-slow" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 light-theme:from-brandDark-black light-theme:to-gray-600">
              AI Modular Interior Studio
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium light-theme:text-gray-500">
            Design and customize modular interiors with real-time AI visualization. Compare materials, finishes, and pricing.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCameraScan}
            className="px-4 py-2.5 rounded-xl bg-brandDark-black border border-brandDark-border text-gray-300 hover:text-white hover:border-primary text-xs font-semibold flex items-center space-x-1.5 transition-all light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-700"
          >
            <Camera className="w-4 h-4 text-primary" />
            <span>Scan Unit Space</span>
          </button>
          <button
            onClick={handleCaptureSnapshot}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-glow transition-all flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Image</span>
          </button>
        </div>
      </div>

      {/* Product Selection Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { id: 'wardrobe', label: '🏠 Wardrobe', desc: 'Custom doors, handles, accessories' },
          { id: 'tv', label: '📺 TV Unit', desc: 'Wall panels, backlights, shelving count' },
          { id: 'kitchen', label: '🍽 Modular Kitchen', desc: 'Kitchen shapes, countertops, accessories' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveProduct(item.id as any)}
            className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
              activeProduct === item.id
                ? 'bg-primary/10 border-primary/45 shadow-glow text-primary'
                : 'bg-brandDark-charcoal border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border'
            }`}
          >
            <span className="font-extrabold text-sm block">{item.label}</span>
            <span className="text-[10px] opacity-80 block font-semibold">{item.desc}</span>
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE VISUALIZER (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl border border-brandDark-border/80 overflow-hidden bg-brandDark-black aspect-video flex flex-col justify-between shadow-2xl glass-panel group">
            {/* View Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="w-full h-full object-cover"
            />

            {/* Help Overlay HUD */}
            <div className="absolute top-4 left-4 pointer-events-none bg-brandDark-charcoal/80 border border-brandDark-border text-gray-400 text-[9px] px-2.5 py-1 rounded-lg flex items-center space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <Move className="w-3.5 h-3.5 text-primary" />
              <span>Drag center bar to split Before / After view</span>
            </div>

            {/* Zoom Control Deck */}
            <div className="absolute bottom-4 left-4 bg-brandDark-charcoal/90 border border-brandDark-border p-1 rounded-xl flex items-center space-x-1">
              <button
                onClick={() => setZoom(prev => Math.min(2.0, prev + 0.1))}
                className="p-1.5 rounded hover:bg-brandDark-black text-gray-400 hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                className="p-1.5 rounded hover:bg-brandDark-black text-gray-400 hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[9px] text-gray-500 font-mono px-1">{Math.round(zoom * 100)}%</span>
            </div>

            {scanning && (
              <div className="absolute inset-0 bg-brandDark-black/80 flex flex-col items-center justify-center p-4">
                <RefreshCw className="w-8 h-8 text-primary animate-spin mb-2" />
                <p className="text-xs font-bold uppercase text-white animate-pulse tracking-widest text-center">Configuring layout: {scanPoints}%</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
            <button
              onClick={() => {
                setPaintColor('#F5F5F0');
                setSelectedMaterial('Plywood');
                setFinishOption('Matte');
                setLighting('Warm White');
                setHandleStyle('Modern');
                setZoom(1.0);
                setYaw(140);
                setPitch(-10);
              }}
              className="px-4 py-2 text-xs font-bold border border-brandDark-border bg-brandDark-charcoal text-gray-300 hover:text-white rounded-xl flex items-center space-x-1.5 hover:border-primary/45 transition-all light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Configuration</span>
            </button>
            <button
              onClick={() => alert('Design saved successfully!')}
              className="px-4 py-2 text-xs font-bold border border-brandDark-border bg-brandDark-charcoal text-gray-300 hover:text-white rounded-xl flex items-center space-x-1.5 hover:border-primary/45 transition-all light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-700"
            >
              <Save className="w-3.5 h-3.5 text-primary" />
              <span>Save Project</span>
            </button>
            <button
              onClick={handleShareSession}
              className="px-4 py-2 text-xs font-bold border border-brandDark-border bg-brandDark-charcoal text-gray-300 hover:text-white rounded-xl flex items-center space-x-1.5 hover:border-primary/45 transition-all light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-700"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compare Layouts</span>
            </button>
          </div>

          {/* MATERIAL METRICS DECK */}
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/40 glass-panel space-y-4 light-theme:bg-brandLight-panel light-theme:border-brandLight-border shadow-md">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center space-x-1.5">
              <Info className="w-4 h-4" />
              <span>Material Specification & Durability Metrics</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] text-gray-400 light-theme:text-gray-600 font-semibold">
              <div className="bg-brandDark-black/60 p-3 rounded-xl border border-brandDark-border light-theme:bg-white light-theme:border-brandLight-border">
                <span className="block text-gray-500 uppercase tracking-wide text-[8px] font-bold">Durability</span>
                <span className="text-white light-theme:text-brandDark-black text-xs font-extrabold">{materialMetrics[selectedMaterial].durability} / 5</span>
              </div>
              <div className="bg-brandDark-black/60 p-3 rounded-xl border border-brandDark-border light-theme:bg-white light-theme:border-brandLight-border">
                <span className="block text-gray-500 uppercase tracking-wide text-[8px] font-bold">Water Resistance</span>
                <span className="text-white light-theme:text-brandDark-black text-xs font-extrabold">{materialMetrics[selectedMaterial].water} / 5</span>
              </div>
              <div className="bg-brandDark-black/60 p-3 rounded-xl border border-brandDark-border light-theme:bg-white light-theme:border-brandLight-border">
                <span className="block text-gray-500 uppercase tracking-wide text-[8px] font-bold">Scratch Resistance</span>
                <span className="text-white light-theme:text-brandDark-black text-xs font-extrabold">{materialMetrics[selectedMaterial].scratch} / 5</span>
              </div>
              <div className="bg-brandDark-black/60 p-3 rounded-xl border border-brandDark-border light-theme:bg-white light-theme:border-brandLight-border">
                <span className="block text-gray-500 uppercase tracking-wide text-[8px] font-bold">Termite Resistance</span>
                <span className="text-white light-theme:text-brandDark-black text-xs font-extrabold">{materialMetrics[selectedMaterial].termite} / 5</span>
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/15 p-3 rounded-xl text-[10px] text-gray-400 light-theme:text-gray-600 leading-relaxed font-semibold">
              <span className="text-primary font-bold block">AI Recommendation note:</span>
              {materialMetrics[selectedMaterial].recommend} (Warranty: {materialMetrics[selectedMaterial].warranty} | Maintenance: {materialMetrics[selectedMaterial].maintenance})
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI CONFIGURATION PANEL (Span 3) */}
        <div className="lg:col-span-3 space-y-6 max-h-[85vh] overflow-y-auto pr-1">
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/40 glass-panel space-y-6 light-theme:bg-brandLight-panel light-theme:border-brandLight-border shadow-xl">
            <h3 className="text-white light-theme:text-brandDark-black font-bold text-base font-display pb-3 border-b border-brandDark-border/40 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>AI Configuration Panel</span>
            </h3>

            {/* WARDROBE SECTION */}
            {activeProduct === 'wardrobe' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Door Style</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Sliding Door', 'Hinged Door', 'Glass Door', 'Mirror Door'].map(d => (
                      <button
                        key={d}
                        onClick={() => setWardrobeDoorType(d)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-left ${
                          wardrobeDoorType === d
                            ? 'bg-primary/15 text-primary border-primary/40'
                            : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Wardrobe Size</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Single Door', 'Double Door', 'Triple Door'].map(s => (
                      <button
                        key={s}
                        onClick={() => setWardrobeSize(s)}
                        className={`py-1.5 px-2 rounded-xl text-[9px] font-bold border transition-all text-center truncate ${
                          wardrobeSize === s
                            ? 'bg-primary/15 text-primary border-primary/40'
                            : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                        }`}
                      >
                        {s.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Internal Accessories</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Hanging Section', 'Drawers', 'Shoe Rack', 'Jewelry Drawer'].map(acc => {
                      const isActive = wardrobeAccessories.includes(acc);
                      return (
                        <button
                          key={acc}
                          onClick={() => setWardrobeAccessories(prev =>
                            prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
                          )}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-left flex items-center justify-between ${
                            isActive
                              ? 'bg-primary/15 text-primary border-primary/40'
                              : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                          }`}
                        >
                          <span>{acc}</span>
                          {isActive && <Check className="w-3 h-3 text-primary ml-1 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TV UNIT SECTION */}
            {activeProduct === 'tv' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Width (feet)</span>
                    <span className="text-primary">{tvUnitWidth} ft</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="1"
                    value={tvUnitWidth}
                    onChange={(e) => setTvUnitWidth(Number(e.target.value))}
                    className="w-full h-1 bg-brandDark-black light-theme:bg-brandLight-slate rounded appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Height (feet)</span>
                    <span className="text-primary">{tvUnitHeight} ft</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="8"
                    step="1"
                    value={tvUnitHeight}
                    onChange={(e) => setTvUnitHeight(Number(e.target.value))}
                    className="w-full h-1 bg-brandDark-black light-theme:bg-brandLight-slate rounded appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Shelf Count</span>
                    <span className="text-primary">{tvShelfCount} shelves</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={tvShelfCount}
                    onChange={(e) => setTvShelfCount(Number(e.target.value))}
                    className="w-full h-1 bg-brandDark-black light-theme:bg-brandLight-slate rounded appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Cabinet Layout</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Open Shelf', 'Closed Shelf', 'Glass Shelf'].map(l => (
                      <button
                        key={l}
                        onClick={() => setTvCabinetLayout(l)}
                        className={`py-1.5 px-2 rounded-xl text-[9px] font-bold border transition-all text-center truncate ${
                          tvCabinetLayout === l
                            ? 'bg-primary/15 text-primary border-primary/40'
                            : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                        }`}
                      >
                        {l.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MODULAR KITCHEN SECTION */}
            {activeProduct === 'kitchen' && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Kitchen Type</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Straight Kitchen', 'L Shape', 'U Shape', 'Island Kitchen'].map(t => (
                      <button
                        key={t}
                        onClick={() => setKitchenType(t)}
                        className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-left ${
                          kitchenType === t
                            ? 'bg-primary/15 text-primary border-primary/40'
                            : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Countertop Material</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Granite', 'Quartz', 'Marble'].map(m => (
                      <button
                        key={m}
                        onClick={() => setKitchenCountertop(m)}
                        className={`py-1.5 px-2 rounded-xl text-[9px] font-bold border transition-all text-center truncate ${
                          kitchenCountertop === m
                            ? 'bg-primary/15 text-primary border-primary/40'
                            : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Kitchen Organizers</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Soft Close Drawers', 'Cutlery Organizer', 'Magic Corner', 'Bottle Pull Out'].map(acc => {
                      const isActive = kitchenAccessories.includes(acc);
                      return (
                        <button
                          key={acc}
                          onClick={() => setKitchenAccessories(prev =>
                            prev.includes(acc) ? prev.filter(a => a !== acc) : [...prev, acc]
                          )}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-left flex items-center justify-between ${
                            isActive
                              ? 'bg-primary/15 text-primary border-primary/40'
                              : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                          }`}
                        >
                          <span>{acc}</span>
                          {isActive && <Check className="w-3 h-3 text-primary ml-1 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* MATERIAL SELECTION */}
            <div className="space-y-2 pt-4 border-t border-brandDark-border/40">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Material Base</label>
              <div className="grid grid-cols-4 gap-1">
                {['Solid Wood', 'Plywood', 'MDF', 'PVC'].map(mat => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`py-1.5 rounded-xl text-[9px] font-bold border transition-all text-center ${
                      selectedMaterial === mat
                        ? 'bg-primary/15 text-primary border-primary/40'
                        : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                    }`}
                  >
                    {mat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* FINISH OPTIONS */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Finish Coating</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Matte', 'Glossy', 'High Gloss', 'Textured', 'Acrylic', 'Laminate'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFinishOption(f)}
                    className={`py-1 rounded-xl text-[9px] font-bold border transition-all text-center truncate ${
                      finishOption === f
                        ? 'bg-primary/15 text-primary border-primary/40'
                        : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR PALETTE */}
            <div className="space-y-3">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Cabinet Color Swatches</label>
              <div className="flex gap-2 items-center flex-wrap">
                {colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPaintColor(c.hex)}
                    className="w-7 h-7 rounded-full border border-brandDark-border relative flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {paintColor === c.hex && (
                      <Check className={`w-3.5 h-3.5 ${c.hex === '#F5F5F0' || c.hex === '#FFFFF0' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
                {/* Custom Color Input Swatch */}
                <div className="relative w-7 h-7 rounded-full border border-brandDark-border hover:scale-110 transition-transform flex items-center justify-center overflow-hidden bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 cursor-pointer">
                  <Pipette className="w-3.5 h-3.5 text-white pointer-events-none" />
                  <input
                    type="color"
                    value={paintColor}
                    onChange={(e) => setPaintColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-fullScale"
                  />
                </div>
              </div>
            </div>

            {/* LIGHTING & HARDWARE */}
            <div className="space-y-3 pt-4 border-t border-brandDark-border/40">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Lighting & Hardware</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['Warm White', 'Cool White', 'Natural', 'Ambient'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLighting(l)}
                    className={`py-1 px-2 rounded-xl text-[10px] font-bold border transition-all text-left truncate ${
                      lighting === l
                        ? 'bg-primary/15 text-primary border-primary/40'
                        : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Handle style */}
              <div className="grid grid-cols-3 gap-1 mt-2">
                {['Modern', 'Gold', 'Black', 'Wood'].map(h => (
                  <button
                    key={h}
                    onClick={() => setHandleStyle(h)}
                    className={`py-1 rounded-lg text-[9px] font-bold border transition-all text-center ${
                      handleStyle === h
                        ? 'bg-primary/15 text-primary border-primary/40'
                        : 'bg-brandDark-black/60 border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* REAL-TIME COST ESTIMATION PANEL */}
            <div className="p-4 rounded-2xl bg-brandDark-black/60 border border-brandDark-border space-y-2 text-[10px] text-gray-400 light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600 font-semibold shadow-inner">
              <span className="text-primary font-black uppercase tracking-wider text-[9px] block">Live Pricing Breakdown</span>
              <div className="flex justify-between">
                <span>Material Cost:</span>
                <span className="text-white light-theme:text-brandDark-black">₹{costs.materialCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Hardware Cost:</span>
                <span className="text-white light-theme:text-brandDark-black">₹{costs.hardwareCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Installation Cost:</span>
                <span className="text-white light-theme:text-brandDark-black">₹{costs.installationCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-brandDark-border pb-1 light-theme:border-brandLight-border">
                <span>GST (18%):</span>
                <span className="text-white light-theme:text-brandDark-black">₹{costs.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-primary font-bold">Estimated Grand Total:</span>
                <span className="text-white light-theme:text-brandDark-black font-black">₹{costs.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ACTIONS BAR */}
      <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/60 flex flex-col md:flex-row justify-between items-center gap-4 light-theme:bg-white light-theme:border-brandLight-border shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 light-theme:text-gray-500">
          <Info className="w-4 h-4 text-primary" />
          <span>Save designs, share layout combinations, or match directly with verified interior designer partners.</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => alert('PDF quotation proposal generated!')}
            className="px-4 py-2 text-xs font-bold bg-brandDark-black border border-brandDark-border hover:border-primary text-gray-300 hover:text-white rounded-xl flex items-center space-x-1.5 transition-all light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-700"
          >
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>Request Quote</span>
          </button>
          <button
            onClick={() => alert('AR configuration loaded. Open camera on mobile app to project.')}
            className="px-4 py-2 text-xs font-bold bg-brandDark-black border border-brandDark-border hover:border-primary text-gray-300 hover:text-white rounded-xl flex items-center space-x-1.5 transition-all light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-700"
          >
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>AR Preview</span>
          </button>
          <button
            onClick={() => alert('Booking designer appointment matching process...')}
            className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center space-x-1.5 transition-all shadow-glow"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Book Designer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModularStudio;
