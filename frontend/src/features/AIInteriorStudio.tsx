import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Sliders, Camera, Download, Save, Info,
  Check, ZoomIn, ZoomOut, UserPlus, FileText, Compass,
  Pipette, RotateCcw, Box, Move, Bed, Sofa, UtensilsCrossed
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

type RoomType = 'living' | 'kitchen' | 'bedroom';

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
  const [activeRoom, setActiveRoom] = useState<RoomType>('living');
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
  const [wardrobeDoorOpen, setWardrobeDoorOpen] = useState<boolean>(true);
  const [wardrobeDoorProgress, setWardrobeDoorProgress] = useState<number>(1);
  const [kitchenDrawerOpen, setKitchenDrawerOpen] = useState<boolean>(true);
  const [kitchenDrawerProgress, setKitchenDrawerProgress] = useState<number>(1);
  const [windowOpen, setWindowOpen] = useState<boolean>(false);
  const [windowProgress, setWindowProgress] = useState<number>(0);

  // Camera Orbit & View states
  const [zoom, setZoom] = useState<number>(1.0);
  const [yaw, setYaw] = useState<number>(140);
  const [pitch, setPitch] = useState<number>(-10);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [sliderPos, setSliderPos] = useState<number>(50); // Split slider
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  // New simulated 3D interaction states
  const [kitchenDrawersOpen, setKitchenDrawersOpen] = useState<boolean[]>([false, false, false, false, false, false]);
  const [kitchenDrawersProgress, setKitchenDrawersProgress] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [bedOffset, setBedOffset] = useState<{x: number, y: number}>({ x: 120, y: -40 }); // Positioned in "target area"
  const [isDraggingBed, setIsDraggingBed] = useState<boolean>(false);
  
  // Object-specific material selection state
  const [selectedObject, setSelectedObject] = useState<string>('wardrobe_living');
  const [objectMaterials, setObjectMaterials] = useState<Record<string, string>>({
    'tv_unit': 'MDF',
    'wardrobe_living': 'Solid Wood',
    'kitchen_base': 'Plywood',
    'wardrobe_bedroom': 'Solid Wood',
    'bed': 'Solid Wood'
  });

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
    setObjectMaterials(prev => ({
      ...prev,
      [selectedObject]: mat
    }));
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
  const triggerRoomChange = (room: RoomType) => {
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
      // Individual drawers
      setKitchenDrawersProgress(prevArr => {
        let animating = false;
        const newArr = prevArr.map((prev, i) => {
          const target = kitchenDrawersOpen[i] ? 1.0 : 0.0;
          const diff = target - prev;
          if (Math.abs(diff) > 0.02) {
             animating = true;
             return prev + diff * 0.12;
          }
          return target;
        });
        if (animating && !animId) animId = requestAnimationFrame(tick);
        return newArr;
      });
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, [kitchenDrawerOpen, kitchenDrawersOpen]);

  // Run Window animation loop
  useEffect(() => {
    let animId: number;
    const tick = () => {
      setWindowProgress(prev => {
        const target = windowOpen ? 1.0 : 0.0;
        const diff = target - prev;
        if (Math.abs(diff) < 0.02) return target;
        animId = requestAnimationFrame(tick);
        return prev + diff * 0.15;
      });
    };
    tick();
    return () => cancelAnimationFrame(animId);
  }, [windowOpen]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.target.setPointerCapture(e.pointerId);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    
    const currentSplitX = (sliderPos / 100) * canvas.width;
    
    // Calculate exact cx, cy used in rendering for accurate hitboxes
    const w = canvas.width;
    const h = canvas.height;
    
    let currentRoomTargetYaw = 140;
    let currentRoomTargetPitch = -10;
    let currentRoomTargetZoom = 1.0;

    if (activeRoom === 'kitchen') {
      currentRoomTargetYaw = 200;
      currentRoomTargetPitch = -16;
      currentRoomTargetZoom = 1.15;
    } else if (activeRoom === 'bedroom') {
      currentRoomTargetYaw = 170;
      currentRoomTargetPitch = -5;
      currentRoomTargetZoom = 1.05;
    }

    const t = transitionProgress;
    const interpolatedYaw = yaw + (currentRoomTargetYaw - yaw) * t;
    const interpolatedPitch = pitch + (currentRoomTargetPitch - pitch) * t;
    const interpolatedZoom = zoom + (currentRoomTargetZoom - zoom) * t;

    const cx = w / 2 + (interpolatedYaw - 140) * 2.2 * interpolatedZoom;
    const cy = h / 2 - 10 + interpolatedPitch * 1.3 * interpolatedZoom;
    
    // Interactive click regions for the canvas elements
    if (Math.abs(clickX - currentSplitX) > 20 && clickX > currentSplitX) {
      if (activeRoom === 'bedroom') {
        const floorOffset = 70 * interpolatedZoom;
        const bedX = cx - 220 + bedOffset.x;
        const bedY = cy + floorOffset + 60 + bedOffset.y;
        const bedW = 200;
        const bedH = 80;
        if (clickX >= bedX && clickX <= bedX + bedW && clickY >= bedY - bedH && clickY <= bedY + 30) {
           setSelectedObject('bed');
           setIsDraggingBed(true);
           lastMouseX.current = e.clientX;
           lastMouseY.current = e.clientY;
           return;
        }

        const cx_wb = cx + 100;
        const cy_wb = cy - 110;
        if (clickX >= cx_wb && clickX <= cx_wb + 90 && clickY >= cy_wb && clickY <= cy_wb + 180) {
           setSelectedObject('wardrobe_bedroom');
        }

      } else if (activeRoom === 'living') {
        if (clickX >= cx - 100 && clickX <= cx + 80 && clickY >= cy + 25 && clickY <= cy + 70) {
          setSelectedObject('tv_unit');
        }
        if (clickX >= cx + 100 && clickX <= cx + 180 && clickY >= cy - 110 && clickY <= cy + 70) {
          setSelectedObject('wardrobe_living');
        }
      }

      if (activeRoom === 'kitchen') {
        const bx = cx - 130;
        const by = cy + 5;
        const bw = 260;
        const bh = 75;
        const cols = 3;
        const cw = (bw - 6) / cols;
        const dh = (bh - 6) / 2;
        
        if (clickX >= bx && clickX <= bx + bw && clickY >= by && clickY <= by + bh) {
           setSelectedObject('kitchen_base');
        }

        let clickedDrawer = false;
        for (let i = 0; i < cols; i++) {
          const cx_i = bx + 3 + i * cw;
          for (let j = 0; j < 2; j++) {
            const dy_j = by + 3 + j * dh;
            if (clickX >= cx_i && clickX <= cx_i + cw && clickY >= dy_j && clickY <= dy_j + dh) {
              setKitchenDrawersOpen(prev => {
                const arr = [...prev];
                arr[i * 2 + j] = !arr[i * 2 + j];
                return arr;
              });
              clickedDrawer = true;
            }
          }
        }
        if (clickedDrawer) return;
      }

      if (clickX > canvas.width * 0.65) {
        setWardrobeDoorOpen(prev => !prev);
      } else if (clickX < canvas.width * 0.4 && clickY > canvas.height * 0.5) {
        setKitchenDrawerOpen(prev => !prev);
      } else if (clickY < canvas.height * 0.4) {
        setWindowOpen(prev => !prev);
      }
    }

    if (Math.abs(clickX - currentSplitX) < 20) {
      setIsDraggingSlider(true);
    } else {
      setIsDragging(true);
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (isDraggingSlider) {
      const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const newPos = Math.max(0, Math.min(100, (clickX / canvas.width) * 100));
      setSliderPos(newPos);
    } else if (isDraggingBed) {
      const deltaX = e.clientX - lastMouseX.current;
      const deltaY = e.clientY - lastMouseY.current;
      setBedOffset(prev => {
         // Constrain bed movement
         let nx = prev.x + deltaX * (canvas.width / rect.width);
         let ny = prev.y + deltaY * (canvas.height / rect.height);
         if (nx < -50) nx = -50;
         if (nx > 250) nx = 250;
         if (ny < -150) ny = -150;
         if (ny > 50) ny = 50;
         return { x: nx, y: ny };
      });
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
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

  const handlePointerUpOrLeave = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    setIsDraggingSlider(false);
    setIsDraggingBed(false);
    e.target.releasePointerCapture(e.pointerId);
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
    let baseCost = 85000;
    if (activeRoom === 'kitchen') baseCost = 190000;
    if (activeRoom === 'bedroom') baseCost = 120000;
    
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
      let currentRoomTargetYaw = 140;
      let currentRoomTargetPitch = -10;
      let currentRoomTargetZoom = 1.0;

      if (activeRoom === 'kitchen') {
        currentRoomTargetYaw = 200;
        currentRoomTargetPitch = -16;
        currentRoomTargetZoom = 1.15;
      } else if (activeRoom === 'bedroom') {
        currentRoomTargetYaw = 170;
        currentRoomTargetPitch = -5;
        currentRoomTargetZoom = 1.05;
      }

      // Smooth camera path flythrough math (basic approach)
      const t = transitionProgress;
      const interpolatedYaw = yaw + (currentRoomTargetYaw - yaw) * t;
      const interpolatedPitch = pitch + (currentRoomTargetPitch - pitch) * t;
      const interpolatedZoom = zoom + (currentRoomTargetZoom - zoom) * t;

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



        // Detailed drawing helpers to match the reference image style
        const outlineColor = '#8B5A2B'; // Brown wood frame
        
        const drawMaterial = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, materialName: string, isAccent = false) => {
          if (materialName === 'Solid Wood') {
            ctx.fillStyle = isAccent ? '#A0522D' : '#8B4513';
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 1;
            for(let i=x+4; i<x+w-2; i+=8) {
              ctx.beginPath(); ctx.moveTo(i, y); ctx.lineTo(i, y+h); ctx.stroke();
            }
          } else if (materialName === 'Plywood') {
            ctx.fillStyle = isAccent ? '#E8E8D0' : '#F5F5DC';
            ctx.fillRect(x, y, w, h);
          } else if (materialName === 'MDF') {
            ctx.fillStyle = isAccent ? '#C1A37B' : '#D2B48C';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            ctx.fillRect(x, y, w*0.3, h);
          } else if (materialName === 'PVC') {
            ctx.fillStyle = isAccent ? '#4E342E' : '#3E2723';
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = 'rgba(255,255,255,0.02)';
            for(let i=y; i<y+h; i+=4) {
              ctx.fillRect(x, i, w, 1);
            }
          } else {
            const accentColor = blendColors(activeColor, '#E3C666', 0.6);
            ctx.fillStyle = isAccent ? accentColor : activeColor;
            ctx.fillRect(x, y, w, h);
          }
        };

        const drawDetailedWardrobe = (wx: number, wy: number, ww: number, wh: number, openProgress = 0, materialName = 'Plywood') => {
          ctx.fillStyle = outlineColor;
          ctx.fillRect(wx, wy, ww, wh); // Outer frame
          
          if (selectedObject === 'wardrobe_living' || selectedObject === 'wardrobe_bedroom') {
             // Selection highlight
             ctx.strokeStyle = 'rgba(255,255,255,0.3)';
             ctx.strokeRect(wx-2, wy-2, ww+4, wh+4);
          }
          
          const innerX = wx + 3;
          const innerY = wy + 3;
          const innerW = ww - 6;
          const innerH = wh - 6;
          const leftW = innerW * 0.4;
          const rightW = innerW * 0.6;

          // LEFT COLUMN
          const topDoorH = innerH * 0.6;
          drawMaterial(ctx, innerX, innerY, leftW, topDoorH, materialName, false);
          ctx.strokeStyle = outlineColor;
          ctx.strokeRect(innerX, innerY, leftW, topDoorH);
          
          // Accent strip
          drawMaterial(ctx, innerX + leftW/2, innerY, leftW/2, topDoorH, materialName, true);
          ctx.strokeRect(innerX + leftW/2, innerY, leftW/2, topDoorH);
          
          // Handles
          ctx.fillStyle = outlineColor;
          ctx.fillRect(innerX + leftW/2 - 6, innerY + topDoorH/2 - 15, 2, 30);
          ctx.fillRect(innerX + leftW/2 + 4, innerY + topDoorH/2 - 15, 2, 30);

          // Bottom 3 Drawers
          const drawerH = (innerH * 0.4) / 3;
          for (let i = 0; i < 3; i++) {
            const dY = innerY + topDoorH + (i * drawerH);
            const wOffset = openProgress * -15; 
            drawMaterial(ctx, innerX + wOffset, dY, leftW, drawerH, materialName, i === 1);
            ctx.strokeRect(innerX + wOffset, dY, leftW, drawerH);
            // Horizontal handle
            ctx.fillStyle = outlineColor;
            ctx.fillRect(innerX + wOffset + leftW/2 - 10, dY + drawerH/2 - 1, 20, 2);
          }

          // RIGHT COLUMN (Two tall doors)
          const rightDoorW = rightW / 2;
          const doorInnerX = innerX + leftW;
          
          // Draw Wardrobe Interior
          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(doorInnerX, innerY, rightW, innerH);
          ctx.fillStyle = outlineColor;
          ctx.fillRect(doorInnerX, innerY + innerH * 0.3, rightW, 3);
          ctx.fillRect(doorInnerX, innerY + innerH * 0.6, rightW, 3);
          
          drawMaterial(ctx, doorInnerX + 5, innerY + innerH * 0.1, rightW - 10, innerH * 0.15, materialName, false);
          
          const animW = Math.max(1, rightDoorW * (1 - (openProgress * 0.85)));
          
          drawMaterial(ctx, doorInnerX, innerY, animW, innerH, materialName, true);
          ctx.strokeRect(doorInnerX, innerY, animW, innerH);
          
          const rightDoorX = doorInnerX + rightW - animW;
          drawMaterial(ctx, rightDoorX, innerY, animW, innerH, materialName, false);
          ctx.strokeRect(rightDoorX, innerY, animW, innerH);

          ctx.fillStyle = outlineColor;
          ctx.fillRect(doorInnerX + animW - 4, innerY + innerH/2 - 30, 2, 60);
          ctx.fillRect(rightDoorX + 2, innerY + innerH/2 - 30, 2, 60);

          ctx.fillStyle = outlineColor;
          ctx.beginPath(); ctx.moveTo(wx + 8, wy + wh); ctx.lineTo(wx + 16, wy + wh); ctx.lineTo(wx + 12, wy + wh + 12); ctx.lineTo(wx + 4, wy + wh + 12); ctx.fill();
          ctx.beginPath(); ctx.moveTo(wx + ww - 16, wy + wh); ctx.lineTo(wx + ww - 8, wy + wh); ctx.lineTo(wx + ww - 4, wy + wh + 12); ctx.lineTo(wx + ww - 12, wy + wh + 12); ctx.fill();
        };

        const drawDetailedCabinet = (bx: number, by: number, bw: number, bh: number, isAnimatedDrawer = false, individualDrawersProgress?: number[], materialName = 'Plywood') => {
          ctx.fillStyle = outlineColor;
          ctx.fillRect(bx, by, bw, bh);
          
          if (selectedObject === 'tv_unit' || selectedObject === 'kitchen_base') {
             ctx.strokeStyle = 'rgba(255,255,255,0.3)';
             ctx.strokeRect(bx-2, by-2, bw+4, bh+4);
          }

          const cols = 3;
          const cw = (bw - 6) / cols;
          for (let i = 0; i < cols; i++) {
            const cx_i = bx + 3 + i * cw;
            const dh = (bh - 6) / 2;
            for (let j = 0; j < 2; j++) {
              const dy_j = by + 3 + j * dh;
              let prog = 0;
              if (individualDrawersProgress && individualDrawersProgress.length > i * 2 + j) {
                 prog = individualDrawersProgress[i * 2 + j];
              } else if (isAnimatedDrawer) {
                 prog = kitchenDrawerProgress;
              }
              const yOffset = prog * 15;
              
              drawMaterial(ctx, cx_i, dy_j + yOffset, cw, dh, materialName, (i + j) % 2 !== 0);
              ctx.strokeRect(cx_i, dy_j + yOffset, cw, dh);
              ctx.fillStyle = outlineColor;
              ctx.fillRect(cx_i + cw/2 - 12, dy_j + yOffset + dh/2 - 1, 24, 2);
            }
          }
        };

        // Draw Scene elements based on activeRoom
        if (activeRoom === 'living') {
          // TV Unit back panel
          ctx.fillStyle = '#2C302E';
          ctx.fillRect(cx - 120, cy - 70, 220, 130);

          // LED backlit strip glow
          ctx.fillStyle = lighting === 'Warm White' ? 'rgba(255, 90, 31, 0.15)' : 'rgba(255,255,255,0.12)';
          ctx.fillRect(cx - 95, cy - 50, 170, 80);

          // Smart TV screen
          ctx.fillStyle = '#08080C';
          ctx.fillRect(cx - 85, cy - 40, 150, 60);
          ctx.strokeStyle = '#FFFFFF';
          ctx.strokeRect(cx - 85, cy - 40, 150, 60);

          // Detailed Table / TV Cabinet (Now animated!)
          drawDetailedCabinet(cx - 100, cy + 25, 180, 45, true, undefined, objectMaterials['tv_unit']);

          // Detailed Wardrobe next to TV Unit
          drawDetailedWardrobe(cx + 100, cy - 110, 80, 180, wardrobeDoorProgress, objectMaterials['wardrobe_living']);

        } else if (activeRoom === 'kitchen') {
          // Window/Backsplash
          ctx.fillStyle = '#E8E8E8'; // Tile backsplash
          ctx.fillRect(cx - 132, cy - 80, 264, 75);
          ctx.strokeStyle = '#CCCCCC';
          for(let i = 0; i < 264; i+=15) { ctx.strokeRect(cx - 132 + i, cy - 80, 15, 75); }

          // Chimney / Range Hood
          ctx.fillStyle = '#C0C0C0';
          ctx.fillRect(cx - 40, cy - 130, 80, 40); // Hood duct
          ctx.fillStyle = '#A0A0A0';
          ctx.fillRect(cx - 55, cy - 90, 110, 15); // Hood base
          ctx.strokeStyle = '#606060';
          ctx.strokeRect(cx - 55, cy - 90, 110, 15);

          // Upper Cabinets
          ctx.fillStyle = activeColor;
          ctx.fillRect(cx - 132, cy - 130, 92, 50); // Left Upper
          ctx.strokeRect(cx - 132, cy - 130, 92, 50);
          ctx.fillRect(cx + 40, cy - 130, 92, 50); // Right Upper
          ctx.strokeRect(cx + 40, cy - 130, 92, 50);

          // Countertop surface
          ctx.fillStyle = '#F5F5F0'; 
          ctx.fillRect(cx - 132, cy - 5, 264, 10);
          ctx.strokeRect(cx - 132, cy - 5, 264, 10);

          // Stove top
          ctx.fillStyle = '#1A1A1A';
          ctx.fillRect(cx - 45, cy - 5, 90, 8);
          // Burners
          ctx.fillStyle = '#FF5A1F';
          ctx.beginPath(); ctx.arc(cx - 20, cy - 1, 5, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx + 20, cy - 1, 5, 0, Math.PI*2); ctx.fill();

          // Kitchen Items
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(cx - 110, cy - 25, 15, 20); // Small appliance / jar
          ctx.fillStyle = '#606060';
          ctx.fillRect(cx - 90, cy - 15, 25, 10); // Pan/Pot

          // Detailed Modular base boxes
          drawDetailedCabinet(cx - 130, cy + 5, 260, 75, false, kitchenDrawersProgress, objectMaterials['kitchen_base']);

          // Oven (placed in middle section of base cabinets)
          const ovenX = cx - 35;
          const ovenY = cy + 10;
          ctx.fillStyle = '#2A2A2A';
          ctx.fillRect(ovenX, ovenY, 70, 60);
          ctx.fillStyle = '#000000';
          ctx.fillRect(ovenX + 10, ovenY + 10, 50, 30); // Window
          ctx.fillStyle = '#C0C0C0';
          ctx.fillRect(ovenX + 10, ovenY + 5, 50, 4); // Handle

        } else if (activeRoom === 'bedroom') {
          // Bedroom Window
          const winX = cx - 80;
          const winY = cy - 130;
          const winW = 120;
          const winH = 90;
          ctx.fillStyle = '#D3E3E8'; // Glass
          ctx.fillRect(winX, winY, winW, winH);
          ctx.fillStyle = '#FFFFFF'; // Frame
          ctx.fillRect(winX - 5, winY - 5, winW + 10, 5); // Top
          ctx.fillRect(winX - 5, winY + winH, winW + 10, 5); // Bottom
          ctx.fillRect(winX - 5, winY, 5, winH); // Left
          ctx.fillRect(winX + winW, winY, 5, winH); // Right
          ctx.fillRect(winX + winW / 2 - 2, winY, 4, winH); // Middle vertical
          ctx.fillRect(winX, winY + winH / 2 - 2, winW, 4); // Middle horizontal

          // Subtle outdoor view through window
          ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
          ctx.fillRect(winX, winY, winW, winH);
          ctx.fillStyle = '#4A6B53'; // Tree hint
          ctx.beginPath(); ctx.moveTo(winX + 20, winY + winH); ctx.lineTo(winX + 40, winY + winH - 40); ctx.lineTo(winX + 60, winY + winH); ctx.fill();

          // Draw Detailed Bed (Side Profile matching user image)
          const bedW = 200;
          // Apply bedOffset so it moves according to drag
          const bedX = cx - 220 + bedOffset.x; 
          const bedY = cy + floorOffset + 60 + bedOffset.y; 
          
          const darkFrame = '#403038';
          const mattressPink = '#FCAEAD';
          const blanketPurple = '#36304A';
          const pillowGrey = '#A1A6BC';

          // Frame Base & Legs
          drawMaterial(ctx, bedX + 10, bedY, bedW - 10, 15, objectMaterials['bed'], false);
          drawMaterial(ctx, bedX + 10, bedY + 15, 8, 15, objectMaterials['bed'], false);
          drawMaterial(ctx, bedX + bedW - 15, bedY + 15, 8, 15, objectMaterials['bed'], false);
          
          if (selectedObject === 'bed') {
             ctx.strokeStyle = 'rgba(255,255,255,0.3)';
             ctx.strokeRect(bedX, bedY, bedW, 15);
          }
          
          // Headboard (slightly rounded top)
          ctx.beginPath();
          ctx.moveTo(bedX, bedY + 15);
          ctx.lineTo(bedX, bedY - 45);
          ctx.arcTo(bedX, bedY - 55, bedX + 15, bedY - 55, 10);
          ctx.lineTo(bedX + 15, bedY + 15);
          // Just use drawMaterial logic for headboard path manually
          ctx.fillStyle = objectMaterials['bed'] === 'Solid Wood' ? '#8B4513' : objectMaterials['bed'] === 'Plywood' ? '#F5F5DC' : objectMaterials['bed'] === 'MDF' ? '#D2B48C' : objectMaterials['bed'] === 'PVC' ? '#3E2723' : darkFrame;
          ctx.fill();
          
          // Mattress
          ctx.fillStyle = mattressPink;
          ctx.fillRect(bedX + 15, bedY - 15, bedW - 25, 15);
          // rounded front corner on mattress
          ctx.beginPath();
          ctx.arc(bedX + bedW - 10, bedY - 7.5, 7.5, -Math.PI/2, Math.PI/2);
          ctx.fill();
          
          // Pillow (Curve)
          ctx.fillStyle = pillowGrey;
          ctx.beginPath();
          ctx.moveTo(bedX + 15, bedY - 15);
          ctx.quadraticCurveTo(bedX + 45, bedY - 35, bedX + 65, bedY - 15);
          ctx.fill();
          
          // Blanket
          ctx.fillStyle = blanketPurple;
          ctx.fillRect(bedX + 75, bedY - 18, 115, 18); // Covers mattress
          ctx.beginPath();
          ctx.arc(bedX + 190, bedY - 9, 9, -Math.PI/2, Math.PI/2);
          ctx.fill();

          // Detailed Wardrobe
          drawDetailedWardrobe(cx + 100, cy - 110, 90, 180, wardrobeDoorProgress, objectMaterials['wardrobe_bedroom']);
        }

        // Ambiance filters
        if (lighting.includes('Warm')) {
          ctx.fillStyle = 'rgba(255, 90, 31, 0.08)';
          ctx.fillRect(0, 0, w, h);
        } else if (lighting.includes('Cool')) {
          ctx.fillStyle = 'rgba(100, 200, 255, 0.05)';
          ctx.fillRect(0, 0, w, h);
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
  }, [activeRoom, transitionProgress, morphProgress, paintColor, selectedMaterial, lighting, handleStyle, wardrobeDoorProgress, kitchenDrawerProgress, kitchenDrawersProgress, windowProgress, zoom, sliderPos, yaw, pitch, bedOffset, selectedObject, objectMaterials]);

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12"
    >
      {flash && (
        <div className="fixed inset-0 bg-white z-50 animate-ping pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brandLight-border pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold font-display text-brandDark-black flex items-center space-x-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brandDark-black to-gray-600">
              AI Interior Studio
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Design and customize modular interiors with real-time AI visualization. Compare materials, colors, finishes, layouts, and pricing before installation.
          </p>
        </div>
        
        {/* Animated Room Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          {[
            { id: 'living', name: 'Living Room', icon: <Sofa className="w-4 h-4" /> },
            { id: 'kitchen', name: 'Kitchen', icon: <UtensilsCrossed className="w-4 h-4" /> },
            { id: 'bedroom', name: 'Bedroom', icon: <Bed className="w-4 h-4" /> }
          ].map(room => (
             <button
              key={room.id}
              onClick={() => triggerRoomChange(room.id as RoomType)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center space-x-1.5 ${
                activeRoom === room.id
                  ? 'bg-primary text-white shadow-glow transform scale-[1.02]'
                  : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-200'
              }`}
            >
              {room.icon}
              <span>{room.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Split configurator layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE VISUALIZER (Span 3 / 75%) */}
        <div className="lg:col-span-3 space-y-4">
          <motion.div 
            layout
            className="relative rounded-3xl border border-brandLight-border overflow-hidden bg-white aspect-video flex flex-col justify-between shadow-2xl glass-panel group"
          >
            {/* View Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUpOrLeave}
              onPointerLeave={handlePointerUpOrLeave}
              className="w-full h-full object-cover cursor-crosshair touch-none"
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
              {(activeRoom === 'living' || activeRoom === 'bedroom') && (
                <button
                  onClick={() => setWardrobeDoorOpen(!wardrobeDoorOpen)}
                  className="px-2.5 py-1 bg-primary text-white text-[9px] font-bold rounded hover:bg-primary-dark transition-all"
                >
                  {wardrobeDoorOpen ? 'Close Wardrobe' : 'Open Wardrobe'}
                </button>
              )}
              {activeRoom === 'kitchen' && (
                <button
                  onClick={() => setKitchenDrawerOpen(!kitchenDrawerOpen)}
                  className="px-2.5 py-1 bg-primary text-white text-[9px] font-bold rounded hover:bg-primary-dark transition-all"
                >
                  {kitchenDrawerOpen ? 'Close Drawer' : 'Open Drawer'}
                </button>
              )}
            </div>
          </motion.div>

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
                setWardrobeDoorOpen(true);
                setKitchenDrawerOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold border border-brandLight-border bg-white text-gray-700 hover:text-black rounded-xl flex items-center space-x-1.5 hover:border-primary/45 transition-all shadow-sm group"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-180 transition-transform duration-500" />
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
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-1 space-y-6 max-h-[85vh] overflow-y-auto pr-1"
        >
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
                    className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                      selectedMaterial === mat
                        ? 'bg-primary/10 border-primary shadow-sm text-primary scale-[1.03]'
                        : 'bg-white border-brandLight-border text-gray-600 hover:text-black hover:border-gray-300'
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
                        : 'bg-white border-brandLight-border text-gray-600 hover:bg-gray-50'
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
                    className={`w-7 h-7 rounded-full border border-brandLight-border relative flex items-center justify-center transition-all ${
                       paintColor === c.hex ? 'scale-110 shadow-md border-primary' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {paintColor === c.hex && (
                      <Check className="w-3.5 h-3.5 text-primary mix-blend-difference drop-shadow-sm" />
                    )}
                  </button>
                ))}
                {/* Custom Color Input Swatch */}
                <div className="relative w-7 h-7 rounded-full border border-brandLight-border hover:scale-110 transition-transform flex items-center justify-center overflow-hidden bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 cursor-pointer shadow-sm">
                  <Pipette className="w-3.5 h-3.5 text-white pointer-events-none drop-shadow-sm" />
                  <input
                    type="color"
                    value={paintColor}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
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
                        : 'bg-white border-brandLight-border text-gray-600 hover:bg-gray-50'
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
                        : 'bg-white border-brandLight-border text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* REAL-TIME COST ESTIMATION PANEL */}
            <motion.div 
              key={activeRoom}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-gray-50 border border-brandLight-border space-y-2 text-[10px] text-gray-600 font-semibold shadow-inner"
            >
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
            </motion.div>

            {/* AI DECISION ASSISTANCE */}
            <div className="space-y-3 pt-4 border-t border-brandLight-border">
              <label className="text-xs text-primary font-bold uppercase tracking-wider block flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Recommended Deck</span>
              </label>
              <motion.div 
                key={selectedMaterial}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-primary/5 border border-primary/15 p-3 rounded-xl text-[9px] text-gray-600 leading-relaxed space-y-1"
              >
                <p><strong>Harmony Fit Score:</strong> 96%</p>
                <p><strong>Recommended Material:</strong> {selectedMaterial === 'PVC' ? 'Plywood for heavy load units.' : 'Solid Wood for high durability.'}</p>
                <p><strong>Maintenance Score:</strong> {materialMetrics[selectedMaterial].maintenance} level required.</p>
              </motion.div>
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
        </motion.div>

      </div>

      {/* BOTTOM ACTIONS BAR */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-3xl border border-brandLight-border bg-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl"
      >
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
            className="px-5 py-2 text-xs font-bold bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center space-x-1.5 transition-all shadow-glow transform hover:scale-105"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Book Interior Designer</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIModularStudio;
