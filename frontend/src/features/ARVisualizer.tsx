import React, { useState, useEffect, useRef } from 'react';
import { Eye, Camera, Check, RotateCcw, Share2, Layers, Compass, Zap, Move, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

const ARVisualizer: React.FC = () => {
  // Config state
  const [paintColor, setPaintColor] = useState<string>('#E0E0E6'); // Default light grey
  const [floorType, setFloorType] = useState<'hardwood' | 'marble' | 'carpet' | 'concrete'>('hardwood');
  const [lighting, setLighting] = useState<'day' | 'warm' | 'cool'>('day');
  const [furniture, setFurniture] = useState<boolean>(true);
  const [furnitureType, setFurnitureType] = useState<'sofa' | 'table' | 'chair'>('sofa');
  const [furnitureScale, setFurnitureScale] = useState<number>(1.0);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanPoints, setScanPoints] = useState<number>(0);

  // Orbit states (Yaw / Pitch)
  const [yaw, setYaw] = useState<number>(142);
  const [pitch, setPitch] = useState<number>(-12);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);

  // Paint Color options
  const colors = [
    { name: 'Bridger Orange', hex: '#FF5722' },
    { name: 'Warm Alabaster', hex: '#F5F5F0' },
    { name: 'Charcoal Slate', hex: '#2C302E' },
    { name: 'Sage Green', hex: '#7A8B7B' },
    { name: 'Pacific Blue', hex: '#2B506E' }
  ];

  // Mouse drag handlers for Orbit
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
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
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Simulating the room scan drawing inside a loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let scanAngle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw background camera feed simulation (sleek mesh grid pattern)
      ctx.fillStyle = '#060609';
      ctx.fillRect(0, 0, w, h);

      // Camera feed ambient mesh grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Dynamic Vanishing Points based on Yaw and Pitch
      const cx = w / 2 + (yaw - 142) * 2.5;
      const cy = h / 2 - 20 + pitch * 1.5;

      const wallOffset = 180;
      const floorOffset = 70;

      // Coordinate Points mapping
      const backLeftTop = { x: cx - wallOffset, y: cy - floorOffset };
      const backLeftBottom = { x: cx - wallOffset, y: cy + floorOffset };
      const backRightTop = { x: cx + wallOffset, y: cy - floorOffset };
      const backRightBottom = { x: cx + wallOffset, y: cy + floorOffset };

      const leftWallTop = { x: -40, y: -40 };
      const leftWallBottom = { x: -40, y: h + 40 };
      const rightWallTop = { x: w + 40, y: -40 };
      const rightWallBottom = { x: w + 40, y: h + 40 };

      // 1. Draw Floor
      ctx.beginPath();
      ctx.moveTo(backLeftBottom.x, backLeftBottom.y);
      ctx.lineTo(backRightBottom.x, backRightBottom.y);
      ctx.lineTo(rightWallBottom.x, rightWallBottom.y);
      ctx.lineTo(leftWallBottom.x, leftWallBottom.y);
      ctx.closePath();

      // Floor Material Rendering
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

      // Floor texture perspective lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      const numFloorPlanks = 8;
      for (let i = 0; i <= numFloorPlanks; i++) {
        const ratio = i / numFloorPlanks;
        const startX = backLeftBottom.x + (backRightBottom.x - backLeftBottom.x) * ratio;
        const endX = leftWallBottom.x + (rightWallBottom.x - leftWallBottom.x) * ratio;
        ctx.beginPath();
        ctx.moveTo(startX, backLeftBottom.y);
        ctx.lineTo(endX, leftWallBottom.y);
        ctx.stroke();
      }

      // 2. Draw Walls (Left Wall, Right Wall, Back Wall)
      const drawWall = (p1: any, p2: any, p3: any, p4: any, color: string) => {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Apply lighting overlay glow
        if (lighting === 'warm') {
          ctx.fillStyle = 'rgba(255, 120, 0, 0.12)';
          ctx.fill();
        } else if (lighting === 'cool') {
          ctx.fillStyle = 'rgba(0, 150, 255, 0.08)';
          ctx.fill();
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      // Left Wall
      drawWall(leftWallTop, backLeftTop, backLeftBottom, leftWallBottom, paintColor);
      // Right Wall
      drawWall(rightWallTop, backRightTop, backRightBottom, rightWallBottom, paintColor);
      // Back Wall
      drawWall(backLeftTop, backRightTop, backRightBottom, backLeftBottom, '#CCCCCC');

      // 3. Draw Furniture overlay inside room coordinates
      if (furniture) {
        const fX = cx;
        const fY = cy + floorOffset - 10;
        const fScale = furnitureScale;

        ctx.save();
        ctx.translate(fX, fY);
        ctx.scale(fScale, fScale);

        if (furnitureType === 'sofa') {
          // Perspective Sofa drawing
          ctx.strokeStyle = '#FF5722';
          ctx.fillStyle = 'rgba(20, 20, 25, 0.9)';
          ctx.lineWidth = 2;

          // Backrest
          ctx.beginPath();
          ctx.rect(-80, -35, 160, 40);
          ctx.fill();
          ctx.stroke();

          // Main cushion seating base
          ctx.beginPath();
          ctx.rect(-85, 5, 170, 40);
          ctx.fill();
          ctx.stroke();

          // Left Armrest
          ctx.beginPath();
          ctx.rect(-95, -25, 15, 65);
          ctx.fill();
          ctx.stroke();

          // Right Armrest
          ctx.beginPath();
          ctx.rect(80, -25, 15, 65);
          ctx.fill();
          ctx.stroke();

          // Text overlay
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('3D Sofa Model', 0, 25);
        } else if (furnitureType === 'table') {
          // Dining Table
          ctx.strokeStyle = '#FF5722';
          ctx.fillStyle = 'rgba(40, 25, 15, 0.9)';
          ctx.lineWidth = 2;

          // Table Top (Isometric shape)
          ctx.beginPath();
          ctx.moveTo(-70, -10);
          ctx.lineTo(70, -10);
          ctx.lineTo(55, 15);
          ctx.lineTo(-55, 15);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Table Legs
          const drawLeg = (lx: number, ly: number) => {
            ctx.beginPath();
            ctx.rect(lx, ly, 6, 25);
            ctx.fillStyle = 'rgba(255, 87, 34, 0.8)';
            ctx.fill();
          };
          drawLeg(-60, 10);
          drawLeg(45, 10);
          drawLeg(-62, -10);
          drawLeg(52, -10);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('3D Table Model', 0, 5);
        } else {
          // Lounge Chair
          ctx.strokeStyle = '#FF5722';
          ctx.fillStyle = 'rgba(30, 35, 45, 0.9)';
          ctx.lineWidth = 2;

          // Backrest
          ctx.beginPath();
          ctx.rect(-30, -40, 60, 45);
          ctx.fill();
          ctx.stroke();

          // Seat
          ctx.beginPath();
          ctx.rect(-32, 5, 64, 30);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Lounge Chair', 0, 22);
        }

        ctx.restore();
      }

      // 4. Lidar Cyberpunk Scanner animation overlays
      if (scanning) {
        scanAngle += 0.04;
        const scanY = cy + Math.sin(scanAngle) * 90;

        // Glowing horizontal line
        ctx.strokeStyle = 'rgba(255, 87, 34, 0.95)';
        ctx.shadowColor = '#FF5722';
        ctx.shadowBlur = 18;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(10, scanY);
        ctx.lineTo(w - 10, scanY);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow

        // Scan coordinate dot indicators
        ctx.fillStyle = '#FF5722';
        for (let j = 0; j < 6; j++) {
          const ptX = 80 + j * 90 + Math.cos(scanAngle + j) * 30;
          const ptY = cy + Math.sin(scanAngle * 1.4 + j) * 60;

          // Dot
          ctx.beginPath();
          ctx.arc(ptX, ptY, 4, 0, Math.PI * 2);
          ctx.fill();

          // Wireframe lines connecting dots
          ctx.strokeStyle = 'rgba(255, 87, 34, 0.25)';
          ctx.beginPath();
          ctx.moveTo(ptX, ptY);
          ctx.lineTo(cx, cy);
          ctx.stroke();

          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.font = '7px monospace';
          ctx.fillText(`X:${Math.round(ptX)} Y:${Math.round(ptY)}`, ptX + 8, ptY + 2);
        }

        // Concentric scanning radar rings
        ctx.strokeStyle = 'rgba(255, 87, 34, 0.15)';
        ctx.beginPath();
        ctx.arc(cx, cy, Math.abs(Math.sin(scanAngle) * 150), 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Active Auto-Measure text overlays
      ctx.fillStyle = '#FF5722';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText("LIDAR DEPTH MAPPER: ON", 20, 30);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`Width: ${(12 + (yaw - 142) * 0.05).toFixed(1)}'`, 20, 45);
      ctx.fillText(`Depth: ${(10 - pitch * 0.05).toFixed(1)}'`, 20, 58);
      ctx.fillText("Height: 9.0' (Locked)", 20, 71);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [paintColor, floorType, lighting, furniture, furnitureType, furnitureScale, scanning, yaw, pitch]);

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
    }, 500);
  };

  const handleShareSession = () => {
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.8 }
    });
    alert('AR Session Link generated! Saved to dashboard logs.');
  };

  // Canvas Snapshot Export
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
    link.download = `BuildPilot_AR_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Flash overlay for camera capture */}
      {flash && (
        <div className="fixed inset-0 bg-white z-50 animate-ping pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brandDark-border pb-6 light-theme:border-brandLight-border">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-display text-white light-theme:text-brandDark-black flex items-center space-x-2">
            <Eye className="w-8 h-8 text-primary animate-pulse" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 light-theme:from-brandDark-black light-theme:to-gray-600">
              AR Space Visualiser (WebXR Sandbox)
            </span>
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
          <div className="relative rounded-3xl border border-brandDark-border/80 overflow-hidden bg-brandDark-black aspect-video flex flex-col justify-between shadow-2xl glass-panel group">
            {/* View Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
            />

            {/* Orbit Help Indicator */}
            <div className="absolute top-4 left-4 pointer-events-none bg-brandDark-charcoal/80 border border-brandDark-border text-gray-400 text-[9px] px-2 py-1 rounded-lg flex items-center space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <Move className="w-3.5 h-3.5 text-primary" />
              <span>Click & Drag to rotate space perspective</span>
            </div>

            {/* Scanning status badge */}
            {scanning && (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-primary/25 border border-primary/40 text-primary text-[10px] font-extrabold tracking-wider uppercase animate-pulse flex items-center space-x-1.5">
                <Zap className="w-3 h-3 text-primary animate-bounce" />
                <span>Mapping Room: {scanPoints}%</span>
              </div>
            )}

            {/* Compass badge */}
            <div className="absolute bottom-4 left-4 p-2 rounded-xl bg-brandDark-charcoal/80 border border-brandDark-border text-gray-400 text-[10px] font-mono flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>Yaw: {Math.round(yaw)}° | Pitch: {Math.round(pitch)}°</span>
            </div>

            {/* Snapshot Button overlay */}
            <button
              onClick={handleCaptureSnapshot}
              className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-primary hover:bg-primary-dark border border-primary/40 text-white flex items-center space-x-1.5 text-xs font-extrabold shadow-glow hover:scale-105 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Capture Snapshot</span>
            </button>
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
                setFurnitureType('sofa');
                setFurnitureScale(1.0);
                setYaw(142);
                setPitch(-12);
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
          <div className="p-6 rounded-3xl border border-brandDark-border bg-brandDark-charcoal/40 glass-panel space-y-6 light-theme:bg-brandLight-panel light-theme:border-brandLight-border shadow-xl">
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
                        ? 'bg-primary/10 text-primary border-primary/40 shadow-glow'
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
                        ? 'bg-primary/10 text-primary border-primary/40 shadow-glow'
                        : 'bg-brandDark-black border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sofa Model Overlay Toggle & Model Selector */}
            <div className="space-y-4 pt-4 border-t border-brandDark-border/40">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white light-theme:text-brandDark-black block">Scale Furniture Models</span>
                  <span className="text-[10px] text-gray-500">Previews layout in 3D perspective</span>
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

              {furniture && (
                <div className="space-y-3 animate-fade-in">
                  {/* Model type selectors */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sofa', label: 'Sofa' },
                      { id: 'table', label: 'Table' },
                      { id: 'chair', label: 'Chair' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setFurnitureType(opt.id as any)}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                          furnitureType === opt.id
                            ? 'bg-primary/10 text-primary border-primary/40'
                            : 'bg-brandDark-black border-brandDark-border text-gray-400 hover:text-white light-theme:bg-white light-theme:border-brandLight-border light-theme:text-gray-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Scale Adjuster slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-gray-400">
                      <span>Model Scale</span>
                      <span className="text-primary">{Math.round(furnitureScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      value={furnitureScale}
                      onChange={(e) => setFurnitureScale(Number(e.target.value))}
                      className="w-full h-1 bg-brandDark-black light-theme:bg-brandLight-slate rounded appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARVisualizer;
