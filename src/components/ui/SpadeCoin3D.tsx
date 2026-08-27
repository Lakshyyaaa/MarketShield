"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface MarketShieldCoin3DProps {
  className?: string;
  size?: number;
}

export const MarketShieldCoin3D: React.FC<MarketShieldCoin3DProps> = ({
  className = "",
  size = 560,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    // Flatter organic isometric orientation
    let rotationY = 0.30;
    let rotationX = -0.08;
    let rotationZ = -0.05;
    let timeAccum = 0;

    const dpr = window.devicePixelRatio || 2;
    const width = size;
    const height = size * 1.15;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const radius = size * 0.44;
    const thickness = 24; // Slim organic coin thickness
    const centerX = width / 2 + 8;
    const centerY = height / 2 - 10;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      timeAccum += 0.01;
      const idleYaw = Math.sin(timeAccum * 0.5) * 0.04;
      const idlePitch = Math.cos(timeAccum * 0.4) * 0.02;

      const targetRotY = 0.30 + idleYaw + (isHovered ? mousePos.x * 0.15 : 0);
      const targetRotX = -0.08 + idlePitch + (isHovered ? mousePos.y * 0.12 : 0);

      rotationY += (targetRotY - rotationY) * 0.08;
      rotationX += (targetRotX - rotationX) * 0.08;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosZ = Math.cos(rotationZ);
      const sinZ = Math.sin(rotationZ);

      // 3D Projection math
      const project = (ox: number, oy: number, oz: number) => {
        // Roll around Z
        const x0 = ox * cosZ - oy * sinZ;
        const y0 = ox * sinZ + oy * cosZ;
        const z0 = oz;

        // Yaw around Y
        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;

        // Pitch around X
        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        const fov = 950;
        const scale = fov / (fov + z2);

        return {
          x: centerX + x1 * scale,
          y: centerY - y2 * scale,
          z: z2,
          scale,
        };
      };

      // 1. Soft Ambient Ground Shadow
      const shadowPt = project(0, -radius * 1.05, 0);
      const shadowGrad = ctx.createRadialGradient(
        shadowPt.x,
        shadowPt.y + 8,
        5,
        shadowPt.x,
        shadowPt.y + 8,
        radius * 0.65
      );
      shadowGrad.addColorStop(0, "rgba(24, 40, 14, 0.12)");
      shadowGrad.addColorStop(0.5, "rgba(24, 40, 14, 0.03)");
      shadowGrad.addColorStop(1, "rgba(24, 40, 14, 0)");

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(shadowPt.x, shadowPt.y + 8, radius * 0.62, radius * 0.16, 0, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();
      ctx.restore();

      // 2. Smooth, Organic Coin Silhouette Perimeter with Natural Notches
      const numPts = 120;
      const perimeterPoints: { x: number; y: number }[] = [];

      for (let i = 0; i < numPts; i++) {
        const theta = (i / numPts) * Math.PI * 2;
        let r = radius;

        // Gentle organic waviness
        r += Math.sin(theta * 3) * (radius * 0.008) + Math.cos(theta * 5) * (radius * 0.005);

        // Smooth left notch
        if (theta > 2.82 && theta < 3.38) {
          const notchProg = Math.sin(((theta - 2.82) / (3.38 - 2.82)) * Math.PI);
          r -= notchProg * (radius * 0.16);
        }

        // Smooth top-left bite
        if (theta > 1.95 && theta < 2.32) {
          const biteProg = Math.sin(((theta - 1.95) / (2.32 - 1.95)) * Math.PI);
          r -= biteProg * (radius * 0.07);
        }

        // Smooth bottom-right notch
        if (theta > 5.35 && theta < 5.82) {
          const notchProg = Math.sin(((theta - 5.35) / (5.82 - 5.35)) * Math.PI);
          r -= notchProg * (radius * 0.06);
        }

        perimeterPoints.push({
          x: Math.cos(theta) * r,
          y: Math.sin(theta) * r,
        });
      }

      const zBack = -thickness / 2;
      const zFront = thickness / 2;

      // 3. Draw Soft Extruded Side Rim / Edge
      for (let i = 0; i < perimeterPoints.length; i++) {
        const pt1 = perimeterPoints[i];
        const pt2 = perimeterPoints[(i + 1) % perimeterPoints.length];

        const normalX = (pt1.x + pt2.x) / 2 / radius;
        const normalY = (pt1.y + pt2.y) / 2 / radius;

        const facing = -normalX * sinY + normalY * sinX * cosY;

        if (facing < 0.15) {
          const p1Front = project(pt1.x, pt1.y, zFront);
          const p2Front = project(pt2.x, pt2.y, zFront);
          const p1Back = project(pt1.x, pt1.y, zBack);
          const p2Back = project(pt2.x, pt2.y, zBack);

          ctx.beginPath();
          ctx.moveTo(p1Front.x, p1Front.y);
          ctx.lineTo(p2Front.x, p2Front.y);
          ctx.lineTo(p2Back.x, p2Back.y);
          ctx.lineTo(p1Back.x, p1Back.y);
          ctx.closePath();

          const shade = Math.max(0.08, 0.35 - facing * 0.5);
          ctx.fillStyle = `rgba(24, 40, 14, ${shade * 0.14})`;
          ctx.fill();

          ctx.strokeStyle = `rgba(24, 40, 14, ${0.28 + shade * 0.35})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      // 4. Draw Front Face Background Fill
      ctx.beginPath();
      const firstFront = project(perimeterPoints[0].x, perimeterPoints[0].y, zFront);
      ctx.moveTo(firstFront.x, firstFront.y);
      for (let i = 1; i < perimeterPoints.length; i++) {
        const p = project(perimeterPoints[i].x, perimeterPoints[i].y, zFront);
        ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.fillStyle = "#edf3e8";
      ctx.fill();
      ctx.strokeStyle = "rgba(24, 40, 14, 0.85)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // 5. Clean, Smooth Contour Lines on Front Face Plane (75 lines)
      const numContours = 75;
      const contourStep = (radius * 2.05) / numContours;

      const holeCenterX = radius * 0.48;
      const holeCenterY = radius * 0.28;
      const holeRadius = radius * 0.13; // Reduced hole size (0.13 * radius)

      for (let c = 0; c < numContours; c++) {
        const py = -radius * 1.0 + c * contourStep;

        const circleR = radius * 0.98;
        if (Math.abs(py) > circleR) continue;

        const halfW = Math.sqrt(Math.max(0, circleR * circleR - py * py));
        let leftX = -halfW;
        let rightX = halfW;

        // Adjust left side if passing through left notch
        if (py > -radius * 0.35 && py < radius * 0.35) {
          const notchProg = Math.cos((py / (radius * 0.35)) * (Math.PI / 2));
          leftX += notchProg * (radius * 0.15);
        }

        const numSegments = 36;
        const segStep = (rightX - leftX) / numSegments;

        ctx.beginPath();
        let isStarted = false;

        for (let s = 0; s <= numSegments; s++) {
          const px = leftX + s * segStep;

          // Check if point is inside the circular cutout hole
          const distToHole = Math.hypot(px - holeCenterX, py - holeCenterY);
          if (distToHole < holeRadius) {
            isStarted = false;
            continue;
          }

          // Flat front-face plane (no 3D displacement for $)
          const pt = project(px, py, zFront);

          if (!isStarted) {
            ctx.moveTo(pt.x, pt.y);
            isStarted = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }

        const isMajor = c % 4 === 0;
        ctx.strokeStyle = isMajor ? "rgba(24, 40, 14, 0.60)" : "rgba(24, 40, 14, 0.28)";
        ctx.lineWidth = isMajor ? 1.0 : 0.65;
        ctx.stroke();
      }

      // 6. Through-Hole Cutout in Top Right Quadrant
      const holeSegments = 32;

      // Hole front rim
      ctx.beginPath();
      for (let i = 0; i <= holeSegments; i++) {
        const theta = (i / holeSegments) * Math.PI * 2;
        const hx = holeCenterX + Math.cos(theta) * holeRadius;
        const hy = holeCenterY + Math.sin(theta) * holeRadius;
        const hp = project(hx, hy, zFront);
        if (i === 0) ctx.moveTo(hp.x, hp.y);
        else ctx.lineTo(hp.x, hp.y);
      }
      ctx.strokeStyle = "rgba(24, 40, 14, 0.85)";
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Hole inner wall depth
      for (let i = 0; i <= holeSegments; i += 2) {
        const theta = (i / holeSegments) * Math.PI * 2;
        const hx = holeCenterX + Math.cos(theta) * holeRadius;
        const hy = holeCenterY + Math.sin(theta) * holeRadius;

        const hpFront = project(hx, hy, zFront);
        const hpBack = project(hx, hy, zBack);

        const normX = Math.cos(theta);
        const normY = Math.sin(theta);
        const facing = -normX * sinY + normY * sinX * cosY;

        if (facing > 0.08) {
          ctx.beginPath();
          ctx.moveTo(hpFront.x, hpFront.y);
          ctx.lineTo(hpBack.x, hpBack.y);
          ctx.strokeStyle = "rgba(24, 40, 14, 0.35)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // 7. Clean, Smooth, Thin Dollar Sign ($) Outline on top of contour lines
      const dScaleX = radius * 0.40;
      const dScaleY = radius * 0.72;

      // Smooth Bezier S-Curve Points
      const sPoints = [
        { x: dScaleX * 0.55, y: dScaleY * 0.82 },
        { x: 0, y: dScaleY * 0.94 },
        { x: -dScaleX * 0.65, y: dScaleY * 0.76 },
        { x: -dScaleX * 0.55, y: dScaleY * 0.28 },
        { x: 0, y: 0 },
        { x: dScaleX * 0.55, y: -dScaleY * 0.28 },
        { x: dScaleX * 0.65, y: -dScaleY * 0.76 },
        { x: 0, y: -dScaleY * 0.94 },
        { x: -dScaleX * 0.55, y: -dScaleY * 0.82 },
      ];

      // Draw smooth S-curve via Cardinal / Catmull-Rom spline approximation
      ctx.beginPath();
      const pStart = project(sPoints[0].x, sPoints[0].y, zFront);
      ctx.moveTo(pStart.x, pStart.y);

      for (let i = 0; i < sPoints.length - 1; i++) {
        const p0 = sPoints[Math.max(0, i - 1)];
        const p1 = sPoints[i];
        const p2 = sPoints[i + 1];
        const p3 = sPoints[Math.min(sPoints.length - 1, i + 2)];

        for (let t = 0; t <= 10; t++) {
          const u = t / 10;
          const u2 = u * u;
          const u3 = u2 * u;

          const sx = 0.5 * (
            (2 * p1.x) +
            (-p0.x + p2.x) * u +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3
          );

          const sy = 0.5 * (
            (2 * p1.y) +
            (-p0.y + p2.y) * u +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3
          );

          const projPt = project(sx, sy, zFront);
          ctx.lineTo(projPt.x, projPt.y);
        }
      }

      ctx.strokeStyle = "#18280e";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Clean Double Vertical Spines
      const spineX1 = -radius * 0.065;
      const spineX2 = radius * 0.065;
      const spineTop = dScaleY * 1.02;
      const spineBot = -dScaleY * 1.02;

      // Spine 1
      const pS1Top = project(spineX1, spineTop, zFront);
      const pS1Bot = project(spineX1, spineBot, zFront);
      ctx.beginPath();
      ctx.moveTo(pS1Top.x, pS1Top.y);
      ctx.lineTo(pS1Bot.x, pS1Bot.y);
      ctx.strokeStyle = "#18280e";
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Spine 2
      const pS2Top = project(spineX2, spineTop, zFront);
      const pS2Bot = project(spineX2, spineBot, zFront);
      ctx.beginPath();
      ctx.moveTo(pS2Top.x, pS2Top.y);
      ctx.lineTo(pS2Bot.x, pS2Bot.y);
      ctx.strokeStyle = "#18280e";
      ctx.lineWidth = 1.3;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, isHovered, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      className={clsx(
        "relative flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing select-none w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px] lg:max-w-[600px] mx-auto",
        className
      )}
      style={{ aspectRatio: "1/1.15" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};
