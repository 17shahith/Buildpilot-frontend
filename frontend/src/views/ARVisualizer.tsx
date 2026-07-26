import React, { useState, useEffect, useRef } from 'react';
import { Eye, Camera, Check, RotateCcw, Share2, Layers, Compass, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const ARVisualizer: React.FC = () => {
  // Config state
  const [paintColor, setPaintColor] = useState<string>('#E0E0E6'); // Default light grey
  const [floorType, setFloorType] = useState<'hardwood' | 'marble' | 'carpet' | 'concrete'>('hardwood');
  const [lighting, setLighting] = useState<'day' | 'warm' | 'cool'>('day');
  const [furniture, setFurniture] = useState<boolean>(true);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanPoints, setScanPoints] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Paint Color options
  const colors = [
    { name: 'Bridger Orange', hex: '#FF5722' },
    { name: 'Warm Alabaster', hex: '#F5F5F0' },
    { name: 'Charcoal Slate', hex: '#2C302E' },
    { name: 'Sage Green', hex: '#7A8B7B' },
    { name: 'Pacific Blue', hex: '#2B506E' }
  ];

  // Simulating the room scan drawing inside a loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw background camera feed simulation (semi-transparent gray grid)
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);

      // Draw perspective room outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;

      // Draw vanishing points guides
      const cx = w / 2;
      const cy = h / 2 - 20;

      // Floor rendering based on floorType selection
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy + 80);
      ctx.lineTo(cx + 200, cy + 80);
      ctx.lineTo(w - 20, h - 20);
      ctx.lineTo(20, h - 20);
      ctx.closePath();

      if (floorType === 'hardwood') {
        ctx.fillStyle = lighting === 'warm' ? '#5c3a21' : lighting === 'cool' ? '#3d2b1f' : '#4a3219';
      } else if (floorType === 'marble') {
        ctx.fillStyle = lighting === 'warm' ? '#e8e5dc' : lighting === 'cool' ? '#d4dce0' : '#e0e0e0';
      } else if (floorType === 'carpet') {
        ctx.fillStyle = lighting === 'warm' ? '#78736b' : lighting === 'cool' ? '#5a6166' : '#696f73';
      } else { // concrete
        ctx.fillStyle = lighting === 'warm' ? '#4f4b46' : lighting === 'cool' ? '#3e4142' : '#454748';
      }
      ctx.fill();
      ctx.stroke();

      // Floor texture grids
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 200 + i * 80, cy + 80);
        ctx.lineTo(w * (i / 6), h - 20);
        ctx.stroke();
      }

      // Wall panel rendering based on paintColor selection
      // Left Wall
      ctx.beginPath();
      ctx.moveTo(20, 20);
      ctx.lineTo(cx - 200, cy - 80);
      ctx.lineTo(cx - 200, cy + 80);
      ctx.lineTo(20, h - 20);
      ctx.closePath();
      ctx.fillStyle = paintColor;
      ctx.fill();
      ctx.stroke();

      // Right Wall
      ctx.beginPath();
      ctx.moveTo(w - 20, 20);
      ctx.lineTo(cx + 200, cy - 80);
      ctx.lineTo(cx + 200, cy + 80);
      ctx.lineTo(w - 20, h - 20);
      ctx.closePath();
      ctx.fillStyle = paintColor;
      ctx.fill();
      ctx.stroke();

      // Back Wall
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy - 80);
      ctx.lineTo(cx + 200, cy - 80);
      ctx.lineTo(cx + 200, cy + 80);
      ctx.lineTo(cx - 200, cy + 80);
      ctx.closePath();
      ctx.fillStyle = '#CCCCCC';
      ctx.fill();
      ctx.stroke();

      // Draw Simulated Furniture (Sofa outline)
      if (furniture) {
        ctx.strokeStyle = '#FF5722';
        ctx.fillStyle = 'rgba(22, 22, 26, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Base sofa
        ctx.rect(cx - 100, cy + 30, 200, 70);
        ctx.fill();
        ctx.stroke();
        // Backrest
        ctx.beginPath();
        ctx.rect(cx - 95, cy - 10, 190, 40);
        ctx.fill();
        ctx.stroke();
        // Pillow text
        ctx.fillStyle = '#A0A0A5';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('3D Sofa Model Layer', cx, cy + 15);
      }

      // Draw active scanner mesh laser overlays (radar lines + flashing points)
      if (scanning) {
        angle += 0.03;
        const scanY = cy + Math.sin(angle) * 120;
        
        // Horizontal scan line
        ctx.strokeStyle = 'rgba(255, 87, 34, 0.8)';
        ctx.shadowColor = '#FF5722';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, scanY);
        ctx.lineTo(w - 30, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow

        // Scan dot markers
        ctx.fillStyle = '#FF5722';
        for (let j = 0; j < 5; j++) {
          const ptX = 100 + j * 90 + Math.cos(angle + j) * 20;
          const ptY = cy + Math.sin(angle * 1.5 + j) * 80;
          ctx.beginPath();
          ctx.arc(ptX, ptY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Coordinate indicators next to dots
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.font = '8px monospace';
          ctx.fillText(`X:${Math.round(ptX)} Y:${Math.round(ptY)}`, ptX + 8, ptY + 2);
        }
      }

      // Interactive auto-measure text
      ctx.fillStyle = '#FF5722';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText("Auto-Measure: ACTIVE", 25, 35);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText("Width: 14' 6\"", 25, 52);
      ctx.fillText("Depth: 12' 4\"", 25, 68);
      ctx.fillText("Ceiling: 9' 0\"", 25, 84);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [paintColor, floorType, lighting, furniture, scanning]);

  // Simulating start scanning action
  const handleStartScan = () => {
    setScanning(true);
    setScanPoints(0);
    const interval = setInterval(() => {
      setScanPoints(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          confetti({
            particleCount: 50,
            spread: 40,
            origin: { y: 0.7 }
          });
          return 100;
        }
        return prev + 20;
      });
    }, 800);
  };

  const handleShareSession = () => {
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.8 }
    });
    alert('AR Session Link generated! Saved to dashboard logs.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brandDark-border pb-6 light-theme:border-brandLight-border">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-display text-white light-theme:text-brandDark-black flex items-center space-x-2">
            <Eye className="w-8 h-8 text-primary animate-pulse" />
            <span>AR Space Visualiser (WebXR Sandbox)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium light-theme:text-gray-500">
            Scan plots, auto-measure ceilings, overlay paint variations, and preview structural layout scales inside real-time camera views.
          </p>
        </div>
      </div>

      {/* Grid: Simulator Screen vs Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualizer Canvas Column (span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl border border-brandDark-border/80 overflow-hidden bg-brandDark-black aspect-video flex flex-col justify-between shadow-2xl glass-panel">
            {/* View Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="w-full h-full object-cover"
            />

            {/* Scanning overlays */}
            {scanning && (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-primary/25 border border-primary/40 text-primary text-[10px] font-extrabold tracking-wider uppercase animate-pulse flex items-center space-x-1.5">
                <Zap className="w-3 h-3 text-primary animate-bounce" />
                <span>Mapping Room: {scanPoints}%</span>
              </div>
            )}

            {/* Compass badge */}
            <div className="absolute bottom-4 left-4 p-2 rounded-xl bg-brandDark-charcoal/80 border border-brandDark-border text-gray-400 text-[10px] font-mono flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>Yaw: 142° | Pitch: -12°</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <button
              onClick={handleStartScan}
              disabled={scanning}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-glow disabled:opacity-50 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>{scanning ? 'Running Lidar Scan...' : 'Start Camera Scan'}</span>
            </button>
            <button
              onClick={() => {
                setPaintColor('#E0E0E6');
                setFloorType('hardwood');
                setLighting('day');
                setFurniture(true);
              }}
              className="px-5 py-3 rounded-xl border border-brandDark-border bg-brandDark-charcoal text-gray-300 hover:text-white flex items-center space-x-1.5 text-xs font-semibold hover:border-primary/40 transition-all light-theme:bg-brandLight-slate light-theme:border-brandLight-border light-theme:text-gray-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Layout</span>
            </button>
            <button
              onClick={handleShareSession}
              className="px-5 py-3 rounded-xl border border-brandDark-border bg-brandDark-charcoal text-gray-300 hover:text-white flex items-center space-x-1.5 text-xs font-semibold hover:border-primary/40 transition-all light-theme:bg-brandLight-slate light-theme:border-brandLight-border light-theme:text-gray-700"
            >
              <Share2 className="w-3.5 h-3.5 text-primary" />
              <span>Share AR Session</span>
            </button>
          </div>
        </div>

        {/* Controls Sidebar Column */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/40 glass-panel space-y-6 light-theme:bg-brandLight-panel light-theme:border-brandLight-border">
            <h3 className="text-white light-theme:text-brandDark-black font-bold text-base font-display pb-3 border-b border-brandDark-border/40 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>AR Control Deck</span>
            </h3>

            {/* Wall Paint Swatches */}
            <div className="space-y-3">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Wall Paint Selection</label>
              <div className="flex gap-2">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setPaintColor(c.hex)}
                    className="w-8 h-8 rounded-full border border-brandDark-border relative flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {paintColor === c.hex && (
                      <Check className={`w-4 h-4 ${c.hex === '#F5F5F0' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Materials Selection */}
            <div className="space-y-2.5">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Floor Material</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'hardwood', label: 'Oak Hardwood' },
                  { id: 'marble', label: 'Carrara Marble' },
                  { id: 'carpet', label: 'Bouclé Carpet' },
                  { id: 'concrete', label: 'Polished Concrete' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setFloorType(opt.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      floorType === opt.id
                        ? 'bg-primary/10 text-primary border-primary/40 shadow-glow/5'
                        : 'bg-brandDark-black border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Light Settings */}
            <div className="space-y-2.5">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Lighting Atmosphere</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'day', label: 'Daylight' },
                  { id: 'warm', label: 'Warm Glow' },
                  { id: 'cool', label: 'Cool LED' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setLighting(opt.id as any)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      lighting === opt.id
                        ? 'bg-primary/10 text-primary border-primary/40'
                        : 'bg-brandDark-black border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sofa Model Overlay */}
            <div className="flex items-center justify-between pt-4 border-t border-brandDark-border/40">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white light-theme:text-brandDark-black block">Scale Furniture Models</span>
                <span className="text-[10px] text-gray-500">Previews sofa layout in 3D perspective</span>
              </div>
              <button
                onClick={() => setFurniture(!furniture)}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  furniture ? 'bg-primary' : 'bg-brandDark-black border border-brandDark-border light-theme:bg-brandLight-slate light-theme:border-brandLight-border'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow ${
                    furniture ? 'right-0.5' : 'left-0.5'
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARVisualizer;
