import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

export function LandingShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    let animationFrameId: number;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * smoothNoise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = v_texCoord;
        vec2 p = uv * 2.5;
        
        float n = fbm(p + u_time * 0.06);
        
        // Exact tokens mapped to project palette:
        // #16a34a -> vec3(0.086, 0.639, 0.290)
        // #14532d -> vec3(0.078, 0.325, 0.176)
        // #f4fcf0 -> vec3(0.957, 0.988, 0.941)
        vec3 color1 = vec3(0.086, 0.639, 0.290);
        vec3 color2 = vec3(0.078, 0.325, 0.176);
        vec3 bg = vec3(0.957, 0.988, 0.941);
        
        vec3 finalColor = mix(bg, color1, n * 0.25);
        finalColor = mix(finalColor, color2, fbm(p - u_time * 0.03) * 0.08);
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function compileShader(type: number, src: string) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    function syncSize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr) || 1280;
      const h = Math.floor(canvas.clientHeight * dpr) || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);
    syncSize();

    const startTime = performance.now();

    function render(currentTime: number) {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      const elapsed = shouldReduceMotion ? 0 : (currentTime - startTime) * 0.001;
      if (uTime) gl.uniform1f(uTime, elapsed);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!shouldReduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    }

    render(performance.now());

    return () => {
      ro.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    };
  }, [shouldReduceMotion]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none opacity-45 dark:opacity-20 transition-opacity z-[-1] mix-blend-multiply dark:mix-blend-screen">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
