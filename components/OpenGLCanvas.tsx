
import React, { useRef, useEffect } from 'react';
import { StadiumView } from '../types';

interface Props {
  view: StadiumView;
}

const OpenGLCanvas: React.FC<Props> = ({ view }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear Screen (glClear equivalent)
    ctx.fillStyle = '#010103';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (view === StadiumView.FRONT) {
      renderFrontStandView(ctx);
    } else {
      renderSideStandView(ctx, view);
    }
  };

  const renderFrontStandView = (ctx: CanvasRenderingContext2D) => {
    const w = 1000;
    const h = 600;
    
    // Stand Dimensions
    const standY = 130; 
    const standHeight = 150; 
    const centerGapWidth = 360; 
    const sideSeatingWidth = (w - centerGapWidth) / 2; // 320px each side

    // 1. Brightened Night Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, standY);
    skyGrad.addColorStop(0, '#0a0a2a');
    skyGrad.addColorStop(0.5, '#15155a');
    skyGrad.addColorStop(1, '#20208a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, standY);

    // 2. Seating Stand Base (Black)
    ctx.fillStyle = '#000';
    ctx.fillRect(0, standY, w, standHeight);

    // 3. Detailed Seat & Stair Detailing
    const rows = 12; 
    const cols = 50; 
    const rowH = standHeight / rows;
    const colW = w / cols;

    const startLeftStairCol = Math.floor(sideSeatingWidth / colW);
    const startRightStairCol = Math.floor((sideSeatingWidth + centerGapWidth) / colW);
    const centerCol = Math.floor(cols / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * colW;
        const y = standY + (r * rowH);

        const isInCenterGap = x >= sideSeatingWidth && x < (sideSeatingWidth + centerGapWidth);
        const isTopHalf = r < 6; 
        
        let isStair = false;
        
        if (c === 0 || c === cols - 1) {
          isStair = true;
        }
        if (c === centerCol || (cols % 2 === 0 && c === centerCol - 1)) {
          isStair = true;
        }
        if (r >= 6) {
          const flare = r - 6;
          const leftDiagCol = startLeftStairCol - flare;
          const rightDiagCol = startRightStairCol + flare;
          if (c === leftDiagCol || c === leftDiagCol - 1 || c === rightDiagCol || c === rightDiagCol + 1) {
            isStair = true;
          }
        }

        const isShelterArea = isTopHalf && isInCenterGap;
        const shouldDrawSeat = !isStair && !isShelterArea;

        if (isStair) {
          if (!isShelterArea) {
            ctx.fillStyle = '#222222';
            ctx.fillRect(x, y, colW, rowH);
            ctx.fillStyle = '#000';
            ctx.fillRect(x, y + rowH * 0.8, colW, rowH * 0.2);
            ctx.fillStyle = 'rgba(230, 230, 240, 0.25)';
            ctx.fillRect(x, y, colW, 1.2);
          }
        } else if (shouldDrawSeat) {
          const seatX = x + 2.5; 
          const seatW = colW - 5.0;
          const seatH = rowH * 0.08;
          const seatY = y + (rowH - seatH) / 2;

          const baseBlue = r % 2 === 0 ? '#1e40af' : '#1d4ed8';
          const seatGrad = ctx.createLinearGradient(seatX, seatY, seatX, seatY + seatH);
          seatGrad.addColorStop(0, '#3b82f6'); 
          seatGrad.addColorStop(0.5, baseBlue); 
          seatGrad.addColorStop(1, '#000'); 
          
          ctx.fillStyle = seatGrad;
          if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(seatX, seatY, seatW, seatH, 0.5);
            ctx.fill();
          } else {
            ctx.fillRect(seatX, seatY, seatW, seatH);
          }

          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.ellipse(seatX + seatW * 0.3, seatY + seatH * 0.3, seatW * 0.1, seatH * 0.1, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 4. Structural Pillars
    const pillarWidth = 14;
    const pillarTopY = standY - 80;
    ctx.fillStyle = '#111'; 
    ctx.fillRect(sideSeatingWidth, pillarTopY, pillarWidth, standHeight + 80); 
    ctx.fillRect(sideSeatingWidth + centerGapWidth - pillarWidth, pillarTopY, pillarWidth, standHeight + 80); 

    // 5. Flat Thin Roof
    ctx.fillStyle = '#050505';
    ctx.fillRect(sideSeatingWidth, pillarTopY, centerGapWidth, 3);

    // 6. TALL FLOOD LIGHT POLES (Lattice Design)
    drawFloodLightPole(ctx, 40, standY + standHeight, 40);
    drawFloodLightPole(ctx, 960, standY + standHeight, 40);

    // 7. Roof mounted secondary lights
    drawLight(ctx, sideSeatingWidth + pillarWidth/2, pillarTopY, 60); 
    drawLight(ctx, sideSeatingWidth + centerGapWidth - pillarWidth/2, pillarTopY, 60); 
    drawLight(ctx, w/2 - 90, pillarTopY, 60); 
    drawLight(ctx, w/2 + 90, pillarTopY, 60); 

    // 8. Team Shelter
    const shelterW = centerGapWidth - (pillarWidth * 2);
    const shelterH = 70;
    const shelterX = sideSeatingWidth + pillarWidth;
    const shelterY = standY + 5; 

    const frameGrad = ctx.createLinearGradient(shelterX, shelterY, shelterX + shelterW, shelterY);
    frameGrad.addColorStop(0, '#9ca3af');
    frameGrad.addColorStop(0.5, '#e5e7eb');
    frameGrad.addColorStop(1, '#9ca3af');
    ctx.fillStyle = frameGrad; 
    ctx.fillRect(shelterX, shelterY, shelterW, shelterH);
    
    const shelterRoofGrad = ctx.createLinearGradient(shelterX, shelterY, shelterX, shelterY + shelterH);
    shelterRoofGrad.addColorStop(0, 'rgba(40, 40, 45, 0.85)');
    shelterRoofGrad.addColorStop(0.5, 'rgba(60, 60, 70, 0.6)'); 
    shelterRoofGrad.addColorStop(1, 'rgba(30, 30, 35, 0.9)');
    ctx.fillStyle = shelterRoofGrad;
    ctx.beginPath();
    ctx.moveTo(shelterX - 5, shelterY + shelterH);
    ctx.lineTo(shelterX + shelterW + 5, shelterY + shelterH);
    ctx.quadraticCurveTo(shelterX + shelterW/2, shelterY - 25, shelterX - 5, shelterY + shelterH);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(shelterX + 4, shelterY + 18, shelterW - 8, shelterH - 22);
    
    ctx.fillStyle = '#334155';
    const benchSeats = 15;
    const benchSeatW = (shelterW - 40) / benchSeats;
    for (let i = 0; i < benchSeats; i++) {
        ctx.fillRect(shelterX + 20 + i * (benchSeatW + 2), shelterY + 25, benchSeatW - 2, 20);
    }

    // 9. Track
    const trackY = standY + standHeight;
    const trackHeight = 80;
    ctx.fillStyle = '#8b2a2a'; 
    ctx.fillRect(0, trackY, w, trackHeight);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.2;
    const laneCount = 8;
    for (let i = 0; i <= laneCount; i++) {
        const yPos = trackY + (i * (trackHeight / laneCount));
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(w, yPos);
        ctx.stroke();
    }

    // 10. Pitch
    const pitchY = trackY + trackHeight;
    const pitchH = h - pitchY;
    const stripeCount = 10;
    const stripeW = 1000 / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
        ctx.fillStyle = i % 2 === 0 ? '#1b4317' : '#23521e';
        ctx.fillRect(i * stripeW, pitchY, stripeW, pitchH);
    }

    // Pitch Markings
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2.5;
    const margin = 25;
    const bx = margin, by = pitchY + margin, bw = w - (margin * 2), bh = pitchH - (margin * 3);
    
    // Boundary line
    ctx.strokeRect(bx, by, bw, bh); 
    
    // Halfway line
    ctx.beginPath(); ctx.moveTo(w/2, by); ctx.lineTo(w/2, by + bh); ctx.stroke();
    
    // CENTRAL CIRCLE (Improved perspective with Ellipse)
    ctx.beginPath();
    ctx.ellipse(w/2, by + bh/2, 75, 35, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Center Spot
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(w/2, by + bh/2, 5, 0, Math.PI * 2); ctx.fill();

    // Goal Areas
    ctx.strokeRect(bx, by + bh/2 - 65, 80, 130);
    ctx.strokeRect(bx + bw - 80, by + bh/2 - 65, 80, 130);
    ctx.strokeRect(bx, by + bh/2 - 30, 30, 60);
    ctx.strokeRect(bx + bw - 30, by + bh/2 - 30, 30, 60);
  };

  const drawFloodLightPole = (ctx: CanvasRenderingContext2D, x: number, bottomY: number, topY: number) => {
    const poleWidth = 12;
    
    // Main structural beams
    ctx.fillStyle = '#111';
    ctx.fillRect(x - poleWidth/2, topY, poleWidth, bottomY - topY);
    
    // Lattice cross-bracing
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.5;
    const segments = 10;
    const segH = (bottomY - topY) / segments;
    for(let i=0; i<segments; i++) {
        const curY = topY + (i * segH);
        ctx.beginPath();
        ctx.moveTo(x - poleWidth/2, curY);
        ctx.lineTo(x + poleWidth/2, curY + segH);
        ctx.moveTo(x + poleWidth/2, curY);
        ctx.lineTo(x - poleWidth/2, curY + segH);
        ctx.stroke();
    }

    // Light Cluster Head
    const headW = 50;
    const headH = 25;
    ctx.fillStyle = '#050505';
    ctx.fillRect(x - headW/2, topY - headH, headW, headH);
    
    // Light Glow (Massive)
    const glowSize = 180;
    const gradient = ctx.createRadialGradient(x, topY - headH/2, 0, x, topY - headH/2, glowSize);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, topY - headH/2, glowSize, 0, Math.PI * 2);
    ctx.fill();

    // 6 individual flood bulbs
    for(let i=0; i<3; i++) {
        for(let j=0; j<2; j++) {
            const bx = x - headW/2 + 10 + i * 15;
            const by = topY - headH + 7 + j * 12;
            drawLight(ctx, bx, by, 40, false);
        }
    }
  }

  const renderSideStandView = (ctx: CanvasRenderingContext2D, side: StadiumView) => {
    const w = 1000, h = 600;
    ctx.fillStyle = '#0a0a30';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    if (side === StadiumView.LEFT) {
      ctx.moveTo(0, 120); ctx.lineTo(800, 180);
      ctx.lineTo(800, 420); ctx.lineTo(0, 480);
    } else {
      ctx.moveTo(1000, 120); ctx.lineTo(200, 180);
      ctx.lineTo(200, 420); ctx.lineTo(1000, 480);
    }
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${side} STAND PERSPECTIVE`, 500, 80);
    ctx.font = '14px monospace';
    ctx.fillStyle = '#999';
    ctx.fillText("PRESS [F] TO RESET VIEW", 500, 560);
  };

  const drawLight = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number = 135, drawSource: boolean = true) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.1, 'rgba(255, 255, 210, 0.8)');
    gradient.addColorStop(0.4, 'rgba(100, 100, 255, 0.1)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    
    if (drawSource) {
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  };

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [view]);

  return (
    <canvas 
      ref={canvasRef} 
      width={1000} 
      height={600} 
      className="max-w-full max-h-full border border-white/10 shadow-2xl rounded-sm bg-black"
    />
  );
};

export default OpenGLCanvas;
