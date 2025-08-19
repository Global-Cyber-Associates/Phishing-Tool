import { useEffect, useRef } from "react";

export default function GrainOverlay({ opacity = 0.3 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animationFrameId;

    const drawGrain = () => {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const buffer = imageData.data;

      for (let i = 0; i < buffer.length; i += 4) {
        const val = Math.random() * 20; // intensity
        buffer[i] = val + 21;     // Red (#15)
        buffer[i + 1] = val + 24; // Green (#18)
        buffer[i + 2] = val + 30; // Blue (#1E)
        buffer[i + 3] = 25 * opacity; // alpha
      }

      ctx.putImageData(imageData, 0, 0);
      animationFrameId = requestAnimationFrame(drawGrain);
    };

    drawGrain();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}
