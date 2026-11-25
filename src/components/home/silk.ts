import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';

const vertex = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

/**
 * Flowing silk in emerald and ocean: domain-warped noise folded into ribbons,
 * kept to one side so the headline stays on clean paper. The cursor nudges it.
 */
const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uFlip;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
float fbm(vec3 p) {
  float f = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { f += a * snoise(p); p *= 2.02; a *= 0.5; }
  return f;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  if (uFlip > 0.5) uv.x = 1.0 - uv.x;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.045;
  vec2 m = (uMouse - 0.5) * 0.35;
  vec2 q = vec2(fbm(vec3(p * 0.55 + m, t)), fbm(vec3(p * 0.55 + 5.2, t)));
  vec2 r = vec2(fbm(vec3(p * 0.7 + 2.2 * q + vec2(1.7, 9.2), t * 1.4)),
                fbm(vec3(p * 0.7 + 2.2 * q + vec2(8.3, 2.8), t * 1.4)));
  float f = fbm(vec3(p * 0.8 + 1.8 * r, t));

  vec3 paper = vec3(0.961, 0.973, 0.984);
  vec3 emerald = vec3(0.059, 0.624, 0.455);
  vec3 ocean = vec3(0.122, 0.435, 0.878);
  vec3 mint = vec3(0.72, 0.94, 0.86);
  vec3 col = mix(emerald, ocean, smoothstep(0.15, 0.95, uv.y * 0.6 + uv.x * 0.5 + r.x * 0.35));
  col = mix(col, mint, smoothstep(0.55, 1.0, f + 0.35) * 0.45);

  // Silk folds and their sheen.
  float folds = 0.5 + 0.5 * sin(f * 6.0 + r.y * 3.0 + t * 6.0);
  float ribbon = smoothstep(-0.15, 0.55, f + r.x * 0.6);
  // Kept to the far side (and lower) so the headline sits on paper.
  float side = smoothstep(0.32, 0.95, uv.x + (0.5 - uv.y) * 0.35 + f * 0.25);
  float mask = clamp(ribbon * side, 0.0, 1.0);
  col += pow(folds, 7.0) * 0.22;
  col = mix(paper, col, mask * 0.92);
  // Soft vignette into the page.
  col = mix(col, paper, smoothstep(0.75, 1.15, length(uv - vec2(0.7, 0.45))));
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Starts the silk in a canvas; returns a function that stops it and frees the GPU. */
export function startSilk(canvas: HTMLCanvasElement, opts: { rtl: boolean; still: boolean }) {
  const renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 12 },
    uRes: { value: new Vector2() },
    uMouse: { value: new Vector2(0.5, 0.5) },
    uFlip: { value: opts.rtl ? 1 : 0 },
  };
  const material = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms });
  const mesh = new Mesh(new PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    renderer.setSize(w, h, false);
    const size = renderer.getDrawingBufferSize(new Vector2());
    uniforms.uRes.value.copy(size);
    if (opts.still) renderer.render(scene, camera);
  };
  resize();

  let frame = 0;
  let visible = true;
  const target = new Vector2(0.5, 0.5);
  const start = performance.now();
  const loop = () => {
    frame = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    uniforms.uTime.value = 12 + (performance.now() - start) / 1000;
    uniforms.uMouse.value.lerp(target, 0.04);
    renderer.render(scene, camera);
  };
  if (opts.still) renderer.render(scene, camera);
  else loop();

  const onMove = (e: PointerEvent) => target.set(e.clientX / innerWidth, 1 - e.clientY / innerHeight);
  const io = new IntersectionObserver(([entry]) => (visible = !!entry?.isIntersecting));
  io.observe(canvas);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener('pointermove', onMove, { passive: true });

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('pointermove', onMove);
    io.disconnect();
    ro.disconnect();
    mesh.geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
