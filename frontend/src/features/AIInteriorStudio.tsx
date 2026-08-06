import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Sliders, Camera, Download, Save, Share2, Info,
  Check, RefreshCw, ZoomIn, ZoomOut, UserPlus, FileText, Compass,
  Pipette, Move, RotateCcw, Box, HelpCircle
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
  'Solid Wood': { durability: 5, water: 3, scratch: 4, termite: 2, maintenance: 'High', warranty: '10 Years', price: '₹₹₹₹', recommend: 'Highly recommended for premium classic look.' },
  'Plywood': { durability: 4, water: 4, scratch: 4, termite: 4, maintenance: 'Medium', warranty: '7 Years', price: '₹₹₹', recommend: 'Best all-rounder for wet/dry areas.' },
  'MDF': { durability: 3, water: 2, scratch: 3, termite: 3, maintenance: 'Low', warranty: '5 Years', price: '₹₹', recommend: 'Ideal for dry areas, wardrobes, and cabinets.' },
  'PVC': { durability: 3, water: 5, scratch: 2, termite: 5, maintenance: 'Low', warranty: '15 Years', price: '₹', recommend: 'Extremely water-resistant, ideal for kitchen sinks.' }
};

const AIModularStudio: React.FC = () => {
  // Config state
  const [activeRoom, setActiveRoom] = useState<'living' | 'kitchen'>('living');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('Plywood');
  const [prevMaterial, setPrevMaterial] = useState<string>('Plywood');
  const [finishOption, setFinishOption] = useState<string>('Matte');
  const [paintColor, setPaintColor] = useState<string>('#F5F5F0'); // Ivory
  const [prevPaintColor, setPrevPaintColor] = useState<string>('#F5F5F0');
  const [lighting, setLighting] = useState<string>('Warm White');
  const [handleStyle, setHandleStyle] = useState<string>('Modern');
  const [budget, setBudget] = useState<number>(300000);

  // Animations progress states (0 to 1)
  const [transitionProgress, setTransitionProgress] = useState<number>(1.0); // Room walkthrough progress
  const [morphProgress, setMorphProgress] = useState<number>(1.0); // Material texture morph progress
  const [wardrobeDoorOpen, setWardrobeDoorOpen] = useState<boolean>(false);
  const [wardrobeDoorProgress, setWardrobeDoorProgress] = useState<number>(0);
  const [kitchenDrawerOpen, setKitchenDrawerOpen] = useState<boolean>(false);
  const [kitchenDrawerProgress, setKitchenDrawerProgress] = useState<number>(0);

  // Camera Orbit & View states
  const [zoom, setZoom] = useState<number>(1.0);
  const [yaw, setYaw] = useState<number>(140);
  const [pitch, setPitch] = useState<number>(-10);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [sliderPos, setSliderPos] = useState<number>(50); // Split slider
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // Simulation states
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanPoints, setScanPoints] = useState<number>(0);
  const [flash, setFlash] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);

  const colors = [
    { name: 'Classic Ivory', hex: '#FFFFF0' },
    { name: 'Warm Alabaster', hex: '#F5F5F0' },
    { name: 'Charcoal Slate', hex: '#2C302E' },
    { name: 'Sage Green', hex: '#7A8B7B' },
    { name: 'Pacific Blue', hex: '#2B506E' },
    { name: 'Ash Grey', hex: '#B2BEB5' }
  ];

  // Helper to trigger material morph animation
  const handleMaterialSelect = (mat: string) => {
    setPrevMaterial(selectedMaterial);
    setSelectedMaterial(mat);
    setMorphProgress(0);
  };

  // Helper to trigger color morph animation
  const handleColorSelect = (hex: string) => {
    setPrevPaintColor(paintColor);
    setPaintColor(hex);
    setMorphProgress(0);
  };

  // Run morph animation progress loop
  useEffect(() => {
    if (morphProgress >= 1.0) return;
    let animId: number;
    const tick = () => {
      setMorphProgress(prev => {
        if (prev >= 1.0) return 1.0;
        animId = requestAnimationFrame(tick);
        return prev + 0.05;
      });
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, [selectedMaterial, paintColor]);

  // Run room transition camera walkthrough animation loop
  const triggerRoomChange = (room: 'living' | 'kitchen') => {
    setActiveRoom(room);
    setTransitionProgress(0);
  };

  useEffect(() => {
    if (transitionProgress >= 1.0) return;
    let animId: number;
    const tick = () => {
      setTransitionProgress(prev => {
        if (prev >= 1.0) return 1.0;
        animId = requestAnimationFrame(tick);
        return prev + 0.04;
      });
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, [activeRoom]);

  // Run Wardrobe Door sliding animation loop
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setWardrobeDoorProgress(prev => {
        const target = wardrobeDoorOpen ? 1.0 : 0.0;
        const diff = target - prev;
        if (Math.abs(diff) < 0.02) return target;
        animId = requestAnimationFrame(tick);
        return prev + diff * 0.15;
      });
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, [wardrobeDoorOpen]);

  // Run Kitchen Drawer soft-close animation loop
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setKitchenDrawerProgress(prev => {
        const target = kitchenDrawerOpen ? 1.0 : 0.0;
        const diff = target - prev;
        if (Math.abs(diff) < 0.02) return target;
        animId = requestAnimationFrame(tick);
        return prev + diff * 0.12; // soft-close physics
      });
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, [kitchenDrawerOpen]);

  // Drag handlers
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

  // Color blending helper for texture transition
  const blendColors = (color1: string, color2: string, ratio: number) => {
    const hex = (x: number) => {
      const s = x.toString(16);
      return s.length === 1 ? '0' + s : s;
    };
    const c1 = color1.replace('#', '');
    const c2 = color2.replace('#', '');
    const r1 = parseInt(c1.substring(0, 2), 16);
    const g1 = parseInt(c1.substring(2, 4), 16);
    const b1 = parseInt(c1.substring(4, 6), 16);
    const r2 = parseInt(c2.substring(0, 2), 16);
    const g2 = parseInt(c2.substring(2, 4), 16);
    const b2 = parseInt(c2.substring(4, 6), 16);

    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    return `#${hex(r)}${hex(g)}${hex(b)}`;
  };

  // Cost calculation
  const calculateCosts = () => {
    const baseCost = activeRoom === 'living' ? 85000 : 190000;
    const matMultiplier = selectedMaterial === 'Solid Wood' ? 1.6 : selectedMaterial === 'Plywood' ? 1.25 : selectedMaterial === 'MDF' ? 0.95 : 0.85;
    const materialCost = Math.round(baseCost * matMultiplier);
    const hardwareCost = Math.round(materialCost * 0.12);
    const installationCost = Math.round(materialCost * 0.08);
    const gst = Math.round((materialCost + hardwareCost + installationCost) * 0.18);
    return {
      materialCost,
      hardwareCost,
      installationCost,
      gst,
      grandTotal: materialCost + hardwareCost + installationCost + gst
    };
  };

  const costs = calculateCosts();

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Split position
      const splitX = (sliderPos / 100) * w;

      // Cinematic room position interpolation
      const currentRoomTargetYaw = activeRoom === 'living' ? 140 : 220;
      const currentRoomTargetPitch = activeRoom === 'living' ? -10 : -16;
      const currentRoomTargetZoom = activeRoom === 'living' ? 1.0 : 1.15;

      const startingYaw = activeRoom === 'living' ? 220 : 140;
      const startingPitch = activeRoom === 'living' ? -16 : -10;
      const startingZoom = activeRoom === 'living' ? 1.15 : 1.0;

      // Smooth camera path flythrough math
      const t = transitionProgress;
      const interpolatedYaw = startingYaw + (currentRoomTargetYaw - startingYaw) * t;
      const interpolatedPitch = startingPitch + (currentRoomTargetPitch - startingPitch) * t;
      const interpolatedZoom = startingZoom + (currentRoomTargetZoom - startingZoom) * t;

      const cx = w / 2 + (interpolatedYaw - 140) * 2.2 * interpolatedZoom;
      const cy = h / 2 - 10 + interpolatedPitch * 1.3 * interpolatedZoom;

      const wallOffset = 180 * interpolatedZoom;
      const floorOffset = 70 * interpolatedZoom;

      // Texture morphing calculation
      const activeColor = blendColors(prevPaintColor, paintColor, morphProgress);

      // Coordinate projections
      const backLeftTop = { x: cx - wallOffset, y: cy - floorOffset };
      const backLeftBottom = { x: cx - wallOffset, y: cy + floorOffset };
      const backRightTop = { x: cx + wallOffset, y: cy - floorOffset };
      const backRightBottom = { x: cx + wallOffset, y: cy + floorOffset };

      const leftWallTop = { x: -50, y: -50 };
      const leftWallBottom = { x: -50, y: h + 50 };
      const rightWallTop = { x: w + 50, y: -50 };
      const rightWallBottom = { x: w + 50, y: h + 50 };

      // DRAW BEFORE LAYOUT (Unfinished structural wireframe)
      const drawBeforeState = () => {
        ctx.fillStyle = '#060609';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const grid = 25;
        for (let x = 0; x < w; x += grid) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(255, 90, 31, 0.25)';
        ctx.lineWidth = 1.5;

        // Base Room bounds skeleton
        ctx.beginPath();
        ctx.moveTo(backLeftBottom.x, backLeftBottom.y);
        ctx.lineTo(backRightBottom.x, backRightBottom.y);
        ctx.lineTo(rightWallBottom.x, rightWallBottom.y);
        ctx.lineTo(leftWallBottom.x, leftWallBottom.y);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('BEFORE: CARCASS FRAMING DETECTED', 20, 30);
      };

      // DRAW AFTER CONFIGURATION
      const drawAfterState = () => {
        ctx.fillStyle = '#101014';
        ctx.fillRect(0, 0, w, h);

        // Ceiling
        ctx.fillStyle = '#FFFFF0'; // Ivory ceiling
        ctx.beginPath();
        ctx.moveTo(leftWallTop.x, leftWallTop.y);
        ctx.lineTo(rightWallTop.x, rightWallTop.y);
        ctx.lineTo(backRightTop.x, backRightTop.y);
        ctx.lineTo(backLeftTop.x, backLeftTop.y);
        ctx.closePath();
        ctx.fill();

        // Floor
        ctx.fillStyle = '#4A3219'; // Oak wood default floor
        ctx.beginPath();
        ctx.moveTo(backLeftBottom.x, backLeftBottom.y);
        ctx.lineTo(backRightBottom.x, backRightBottom.y);
        ctx.lineTo(rightWallBottom.x, rightWallBottom.y);
        ctx.lineTo(leftWallBottom.x, leftWallBottom.y);
        ctx.closePath();
        ctx.fill();

        // Walls
        const drawWall = (p1: any, p2: any, p3: any, p4: any, color: string) => {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        };

        drawWall(leftWallTop, backLeftTop, backLeftBottom, leftWallBottom, activeColor);
        drawWall(rightWallTop, backRightTop, backRightBottom, rightWallBottom, activeColor);
        drawWall(backLeftTop, backRightTop, backRightBottom, backLeftBottom, '#CCCCCC');

        // Draw Living Room Scene elements
        if (interpolatedYaw < 180) {
          // TV Unit back panel
          ctx.fillStyle = '#2C302E';
          ctx.fillRect(cx - 100, cy - 60, 200, 110);

          // LED backlit strip glow
          ctx.fillStyle = lighting === 'Warm White' ? 'rgba(255, 90, 31, 0.15)' : 'rgba(255,255,255,0.12)';
          ctx.fillRect(cx - 85, cy - 45, 170, 80);

          // Smart TV screen
          ctx.fillStyle = '#08080C';
          ctx.fillRect(cx - 75, cy - 35, 150, 60);
          ctx.strokeStyle = '#FFFFFF';
          ctx.strokeRect(cx - 75, cy - 35, 150, 60);

          // Wardrobe next to TV Unit
          ctx.fillStyle = activeColor;
          ctx.fillRect(cx + 105, cy - 90, 70, 180);
          ctx.strokeRect(cx + 105, cy - 90, 70, 180);

          // Sliding mirror door open/close animation
          const slideOffset = wardrobeDoorProgress * 30;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // semi-transparent mirror glass
          ctx.fillRect(cx + 105 + slideOffset, cy - 90, 35, 180);
          ctx.strokeStyle = '#FF5A1F';
          ctx.strokeRect(cx + 105 + slideOffset, cy - 90, 35, 180);

        } else {
          // Draw Kitchen modular base boxes
          ctx.fillStyle = activeColor;
          ctx.fillRect(cx - 130, cy + 10, 260, 70);
          ctx.strokeRect(cx - 130, cy + 10, 260, 70);

          // Countertop surface
          ctx.fillStyle = '#F5F5F0'; // quartz light countertop
          ctx.fillRect(cx - 132, cy + 5, 264, 10);
          ctx.strokeRect(cx - 132, cy + 5, 264, 10);

          // Animated Kitchen drawers soft close
          const drawerSlide = kitchenDrawerProgress * 15;
          ctx.fillStyle = '#2C302E';
          ctx.fillRect(cx - 60, cy + 20 + drawerSlide, 50, 20);
          ctx.strokeRect(cx - 60, cy + 20 + drawerSlide, 50, 20);
        }

        // Ambiance filters
        if (lighting.includes('Warm')) {
          ctx.fillStyle = 'rgba(255, 90, 31, 0.08)';
          ctx.fill();
        }
      };

      // 1. Draw Before structural carcass
      drawBeforeState();

      // 2. Draw After styled layout onto clipped half
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, w - splitX, h);
      ctx.clip();
      drawAfterState();
      ctx.restore();

      // 3. Draw divider slider handle line
      ctx.strokeStyle = '#FF5A1F';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.stroke();

      // Draw slider handle circle
      ctx.fillStyle = '#FF5A1F';
      ctx.shadowColor = 'rgba(255, 90, 31, 0.4)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(splitX, h / 2, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('◀ ▶', splitX, h / 2 + 4);

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameId);
  }, [activeRoom, transitionProgress, morphProgress, paintColor, selectedMaterial, lighting, handleStyle, wardrobeDoorProgress, kitchenDrawerProgress, zoom, sliderPos, yaw, pitch]);

  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    const link = document.createElement('a');
    link.download = `BuildPilot_ModularConfig_${activeRoom}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {flash && (
        <div className="fixed inset-0 bg-white z-50 animate-ping pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brandLight-border pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-display text-brandDark-black flex items-center space-x-2">
            <Box className="w-8 h-8 text-primary animate-pulse-slow" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brandDark-black to-gray-600">
              🏠 AI Modular Interior Design Studio
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Design and customize modular interiors with real-time AI visualization. Compare materials, colors, finishes, layouts, and pricing before installation.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => triggerRoomChange(activeRoom === 'living' ? 'kitchen' : 'living')}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-glow transition-all flex items-center space-x-1.5"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>Go to {activeRoom === 'living' ? 'Kitchen' : 'Living Room'}</span>
          </button>
        </div>
      </div>

      {/* Split configurator layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE VISUALIZER (Span 3 / 75%) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative rounded-3xl border border-brandLight-border overflow-hidden bg-white aspect-video flex flex-col justify-between shadow-2xl glass-panel group">
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
            <div className="absolute top-4 left-4 pointer-events-none bg-white/90 border border-brandLight-border text-gray-600 text-[9px] px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shadow-sm">
              <Move className="w-3.5 h-3.5 text-primary" />
              <span>Drag center bar to split Before / After view</span>
            </div>

            {/* Zoom Control Deck */}
            <div className="absolute bottom-4 left-4 bg-white/90 border border-brandLight-border p-1 rounded-xl flex items-center space-x-1 shadow-sm">
              <button
                onClick={() => setZoom(prev => Math.min(2.0, prev + 0.1))}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[9px] text-gray-500 font-mono px-1">{Math.round(zoom * 100)}%</span>
            </div>

            {/* Animation controllers overlay */}
            <div className="absolute bottom-4 right-4 bg-white/90 border border-brandLight-border p-1.5 rounded-xl flex items-center space-x-2 shadow-sm">
              {activeRoom === 'living' ? (
                <button
                  onClick={() => setWardrobeDoorOpen(!wardrobeDoorOpen)}
                  className="px-2.5 py-1 bg-primary text-white text-[9px] font-bold rounded hover:bg-primary-dark transition-all"
                >
                  {wardrobeDoorOpen ? 'Close Wardrobe' : 'Open Wardrobe'}
                </button>
              ) : (
                <button
                  onClick={() => setKitchenDrawerOpen(!kitchenDrawerOpen)}
                  className="px-2.5 py-1 bg-primary text-white text-[9px] font-bold rounded hover:bg-primary-dark transition-all"
                >
                  {kitchenDrawerOpen ? 'Close Drawer' : 'Open Drawer'}
                </button>
              )}
            </div>
          </div>

          {/* Quick Studio Bar Actions */}
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
                setWardrobeDoorOpen(false);
                setKitchenDrawerOpen(false);
              }}
              className="px-4 py-2 text-xs font-bold border border-brandLight-border bg-white text-gray-700 hover:text-black rounded-xl flex items-center space-x-1.5 hover:border-primary/45 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Configuration</span>
            </button>
            <button
              onClick={() => alert('Design saved successfully!')}
              className="px-4 py-2 text-xs font-bold border border-brandLight-border bg-white text-gray-700 hover:text-black rounded-xl flex items-center space-x-1.5 hover:border-primary/45 transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-primary" />
              <span>Save Design</span>
            </button>
            <button
              onClick={handleCaptureSnapshot}
              className="px-4 py-2 text-xs font-bold border border-brandLight-border bg-white text-gray-700 hover:text-black rounded-xl flex items-center space-x-1.5 hover:border-primary/45 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HD Image</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: AI CONFIGURATION PANEL (Span 1 / 25%) */}
        <div className="lg:col-span-1 space-y-6 max-h-[85vh] overflow-y-auto pr-1">
          <div className="p-6 rounded-3xl border border-brandLight-border bg-white glass-panel space-y-6 shadow-xl">
            <h3 className="text-brandDark-black font-bold text-base font-display pb-3 border-b border-brandLight-border flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>AI Customization Panel</span>
            </h3>

            {/* MATERIAL SELECTION CARDS */}
            <div className="space-y-3">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">🪵 Material Base</label>
              <div className="grid grid-cols-2 gap-2">
                {['Solid Wood', 'Plywood', 'MDF', 'PVC'].map(mat => (
                  <button
                    key={mat}
                    onClick={() => handleMaterialSelect(mat)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedMaterial === mat
                        ? 'bg-primary/10 border-primary shadow-sm text-primary'
                        : 'bg-white border-brandLight-border text-gray-600 hover:text-black'
                    }`}
                  >
                    <span className="font-extrabold text-[11px] block">{mat}</span>
                    <span className="text-[8px] block opacity-80 mt-0.5">Durability: {materialMetrics[mat].durability}/5</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FINISH OPTIONS */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Finish Coating</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['Matte', 'Glossy', 'High Gloss', 'Textured'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFinishOption(f)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-center truncate ${
                      finishOption === f
                        ? 'bg-primary/15 text-primary border-primary/45 shadow-sm'
                        : 'bg-white border-brandLight-border text-gray-600 hover:text-black'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR PALETTE */}
            <div className="space-y-3">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Cabinet Colors</label>
              <div className="flex gap-2 items-center flex-wrap">
                {colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleColorSelect(c.hex)}
                    className="w-7 h-7 rounded-full border border-brandLight-border relative flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {paintColor === c.hex && (
                      <Check className="w-3.5 h-3.5 text-black" />
                    )}
                  </button>
                ))}
                {/* Custom Color Input Swatch */}
                <div className="relative w-7 h-7 rounded-full border border-brandLight-border hover:scale-110 transition-transform flex items-center justify-center overflow-hidden bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 cursor-pointer">
                  <Pipette className="w-3.5 h-3.5 text-white pointer-events-none" />
                  <input
                    type="color"
                    value={paintColor}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-fullScale"
                  />
                </div>
              </div>
            </div>

            {/* LIGHTING & HARDWARE */}
            <div className="space-y-3 pt-4 border-t border-brandLight-border">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Lighting Ambiance</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['Warm White', 'Cool White', 'Natural', 'Ambient'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLighting(l)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-center truncate ${
                      lighting === l
                        ? 'bg-primary/15 text-primary border-primary/45 shadow-sm'
                        : 'bg-white border-brandLight-border text-gray-600 hover:text-black'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Handle style */}
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {['Modern', 'Gold', 'Black', 'Wood'].map(h => (
                  <button
                    key={h}
                    onClick={() => setHandleStyle(h)}
                    className={`py-1.5 rounded-lg text-[9px] font-bold border transition-all text-center ${
                      handleStyle === h
                        ? 'bg-primary/15 text-primary border-primary/45 shadow-sm'
                        : 'bg-white border-brandLight-border text-gray-600 hover:text-black'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* REAL-TIME COST ESTIMATION PANEL */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-brandLight-border space-y-2 text-[10px] text-gray-600 font-semibold shadow-inner">
              <span className="text-primary font-black uppercase tracking-wider text-[9px] block">Live Pricing Estimations</span>
              <div className="flex justify-between">
                <span>Material Cost:</span>
                <span className="text-black">₹{costs.materialCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Hardware Cost:</span>
                <span className="text-black">₹{costs.hardwareCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-brandLight-border pb-1">
                <span>GST (18%):</span>
                <span className="text-black">₹{costs.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-primary font-bold">Estimated Cost:</span>
                <span className="text-black font-black">₹{costs.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* AI DECISION ASSISTANCE */}
            <div className="space-y-3 pt-4 border-t border-brandLight-border">
              <label className="text-xs text-primary font-bold uppercase tracking-wider block flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Recommended Deck</span>
              </label>
              <div className="bg-primary/5 border border-primary/15 p-3 rounded-xl text-[9px] text-gray-600 leading-relaxed space-y-1">
                <p><strong>Harmony Fit Score:</strong> 96%</p>
                <p><strong>Recommended Material:</strong> {selectedMaterial === 'PVC' ? 'Plywood for heavy load units.' : 'Solid Wood for high durability.'}</p>
                <p><strong>Maintenance Score:</strong> {materialMetrics[selectedMaterial].maintenance} level required.</p>
              </div>
            </div>

            {/* AI BUDGET OPTIMIZER */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Budget Optimizer</label>
              <input
                type="range"
                min="100000"
                max="1000000"
                step="50000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[9px] text-gray-500">
                <span>₹1L</span>
                <span>₹3L</span>
                <span>₹5L+</span>
                <span className="font-bold text-primary">Limit: ₹{(budget / 100000).toFixed(1)}L</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ACTIONS BAR */}
      <div className="p-6 rounded-3xl border border-brandLight-border bg-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
          <Info className="w-4 h-4 text-primary" />
          <span>Compare materials, colors, and layouts. Instantly launch preview modes or book verified designers.</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => alert('PDF configuration proposal generated successfully!')}
            className="px-4 py-2 text-xs font-bold bg-white border border-brandLight-border text-gray-700 hover:text-black rounded-xl flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span>Export Design PDF</span>
          </button>
          <button
            onClick={() => alert('Booking designer appointment process...')}
            className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center space-x-1.5 transition-all shadow-glow"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Book Interior Designer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModularStudio;
