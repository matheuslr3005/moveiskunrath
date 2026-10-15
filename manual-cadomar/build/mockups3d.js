// <cdm-3d kind="truck|facade|tshirt|cap|uniform" variant="" proposta="a|b|c">
// Renders a three.js scene once to a PNG <img> (prints cleanly, one shared WebGL context).
(function () {
  if (customElements.get('cdm-3d')) return;
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';
  let threeP = null;
  const getThree = () => threeP || (threeP = import(THREE_URL));
  const R = '#DA251C', K = '#14161A', W = '#FFFFFF';

  function colors(p, fundo, mono) {
    const bg = fundo === 'escuro' ? K : fundo === 'vermelho' ? R : W;
    let c1, c2, c3;
    if (p === 'a') {
      if (mono === 'preto') { c1 = K; c2 = W; }
      else if (mono === 'branco') { c1 = W; c2 = bg === W ? K : bg; }
      else if (fundo === 'vermelho') { c1 = W; c2 = R; }
      else { c1 = R; c2 = W; }
    } else if (p === 'b') {
      if (mono) { c1 = c2 = mono === 'preto' ? K : W; }
      else if (fundo === 'vermelho') { c1 = c2 = W; }
      else if (fundo === 'escuro') { c1 = R; c2 = W; }
      else { c1 = R; c2 = R; }
    } else {
      if (mono === 'preto') { c1 = K; c3 = W; c2 = K; }
      else if (mono === 'branco') { c1 = W; c3 = bg === W ? K : bg; c2 = W; }
      else if (fundo === 'vermelho') { c1 = W; c3 = R; c2 = W; }
      else if (fundo === 'escuro') { c1 = R; c3 = W; c2 = W; }
      else { c1 = R; c3 = W; c2 = K; }
    }
    return { c1, c2, c3 };
  }

  let fontsOk = false;
  async function ensureFonts() {
    if (fontsOk) return;
    const specs = ['italic 800 semi-expanded 40px Archivo', 'italic 900 semi-expanded 40px Archivo', 'italic 900 expanded 40px Archivo', '800 expanded 40px Archivo', '800 40px Archivo', '400 40px Archivo'];
    for (let i = 0; i < 20; i++) {
      const r = await Promise.all(specs.map(s => document.fonts.load(s).catch(() => [])));
      if (r.every(a => a && a.length)) { await document.fonts.ready; fontsOk = true; return; }
      await new Promise(res => setTimeout(res, 150));
    }
  }
  function font(ctx, style, weight, stretch, size) {
    ctx.font = `${style} ${weight} ${stretch} ${size}px Archivo`;
    try { ctx.fontStretch = stretch; } catch (e) {}
  }
  function para(ctx, x, y, w, h, color) {
    const o = 0.306 * h;
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(x + o, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w - o, y + h); ctx.lineTo(x, y + h);
    ctx.closePath(); ctx.fill();
  }
  const capH = ctx => ctx.measureText('H').actualBoundingBoxAscent;
  function setWord(ctx, p, h) {
    if (p === 'a') { const fs = 0.62 * h; font(ctx, 'italic', 800, 'semi-expanded', fs); ctx.letterSpacing = (0.01 * fs) + 'px'; return fs; }
    if (p === 'b') { h *= 0.62; const fs = 1.32 * h; font(ctx, 'italic', 900, 'semi-expanded', fs); ctx.letterSpacing = (-0.025 * fs) + 'px'; return fs; }
    const fs = 0.86 * h; font(ctx, 'normal', 800, 'expanded', fs); ctx.letterSpacing = (0.04 * fs) + 'px'; return fs;
  }
  function logoWidth(ctx, p, h) {
    ctx.save(); setWord(ctx, p, h); const tw = ctx.measureText('CADOMAR').width; ctx.restore();
    if (p === 'a') return tw + 1.24 * h;
    if (p === 'b') return 1.27 * 0.62 * h + tw;
    return 1.46 * h + tw;
  }
  function drawLogo(ctx, o, x, y, h, align) {
    const p = o.p || 'a', c = colors(p, o.fundo || 'claro', o.mono || '');
    const w = logoWidth(ctx, p, h);
    if (align === 'center') x -= w / 2; else if (align === 'right') x -= w;
    ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
    if (p === 'a') {
      para(ctx, x, y, w, h, c.c1); setWord(ctx, p, h);
      const tw = ctx.measureText('CADOMAR').width; ctx.fillStyle = c.c2;
      ctx.fillText('CADOMAR', x + (w - tw) / 2, y + h / 2 + capH(ctx) / 2);
    } else if (p === 'b') {
      const hb = 0.62 * h, yb = y + (h - hb) / 2;
      para(ctx, x, yb, 0.42 * hb, hb, c.c1); para(ctx, x + 0.27 * hb, yb, 0.54 * hb, hb, c.c1); para(ctx, x + 0.66 * hb, yb, 0.66 * hb, hb, c.c1);
      setWord(ctx, p, h); ctx.fillStyle = c.c2;
      ctx.fillText('CADOMAR', x + 1.27 * hb, yb + hb / 2 + capH(ctx) / 2);
    } else {
      para(ctx, x, y, 1.2 * h, h, c.c1);
      font(ctx, 'italic', 900, 'expanded', 0.82 * h); ctx.letterSpacing = '0px';
      const cw = ctx.measureText('C').width; ctx.fillStyle = c.c3;
      ctx.fillText('C', x + 0.6 * h - cw / 2, y + h / 2 + capH(ctx) / 2);
      setWord(ctx, p, h); ctx.fillStyle = c.c2;
      ctx.fillText('CADOMAR', x + 1.46 * h, y + h / 2 + capH(ctx) / 2);
    }
    ctx.restore(); return w;
  }
  // fit logo of height h into maxW
  function fitH(ctx, p, h, maxW) { const w = logoWidth(ctx, p, h); return w > maxW ? h * maxW / w : h; }

  function tex(T, w, h, draw) {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d'); draw(ctx, w, h);
    const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t;
  }
  function label(ctx, txt, x, y, size, color, spacing, weight, align) {
    font(ctx, 'normal', weight || 800, 'normal', size); ctx.letterSpacing = (spacing || 0) * size + 'px';
    ctx.fillStyle = color; ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, x, y);
  }

  const M = (T, color, rough, metal, extra) => new T.MeshStandardMaterial(Object.assign({ color, roughness: rough ?? 0.6, metalness: metal ?? 0 }, extra || {}));
  function mesh(T, geo, mat, parent, pos, rot) {
    const m = new T.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true;
    if (pos) m.position.set(pos[0], pos[1], pos[2]);
    if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
    if (parent) parent.add(m); return m;
  }
  function decal(T, parent, texture, w, h, pos, rot) {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshStandardMaterial({ map: texture, transparent: true, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.set(pos[0], pos[1], pos[2]); if (rot) m.rotation.set(rot[0], rot[1], rot[2]); m.receiveShadow = true; parent.add(m); return m;
  }
  function lights(T, scene, target, dir, size, intensity) {
    scene.add(new T.HemisphereLight(0xffffff, 0xaeb8c2, 1.15));
    const d = new T.DirectionalLight(0xffffff, intensity || 2.4);
    d.position.set(target[0] + dir[0], target[1] + dir[1], target[2] + dir[2]);
    d.target.position.set(target[0], target[1], target[2]);
    d.castShadow = true; d.shadow.mapSize.set(2048, 2048);
    const s = d.shadow.camera; s.left = -size; s.right = size; s.top = size; s.bottom = -size; s.near = 0.1; s.far = 120;
    d.shadow.bias = -0.0005; d.shadow.normalBias = 0.02;
    scene.add(d, d.target);
    const f = new T.DirectionalLight(0xffffff, 0.55);
    f.position.set(target[0] - dir[0], target[1] + dir[1] * 0.3, target[2] + dir[2]); scene.add(f);
  }
  function shadowGround(T, scene, y, opacity, size) {
    const g = new T.Mesh(new T.PlaneGeometry(size || 200, size || 200), new T.ShadowMaterial({ opacity: opacity ?? 0.22 }));
    g.rotation.x = -Math.PI / 2; g.position.y = y; g.receiveShadow = true; scene.add(g); return g;
  }
  // frame a group from a view direction so its projected box fills `cover` of the frame
  function frame(T, camera, obj, dir, cover) {
    const box = new T.Box3().setFromObject(obj);
    const pts = []; for (let i = 0; i < 8; i++) pts.push(new T.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z));
    const target = box.getCenter(new T.Vector3()); const dv = new T.Vector3(...dir).normalize();
    let d = box.getSize(new T.Vector3()).length() * 1.5;
    for (let it = 0; it < 6; it++) {
      camera.position.copy(target).addScaledVector(dv, d); camera.lookAt(target); camera.updateMatrixWorld(); camera.updateProjectionMatrix();
      let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
      pts.forEach(p => { const q = p.clone().project(camera); minX = Math.min(minX, q.x); maxX = Math.max(maxX, q.x); minY = Math.min(minY, q.y); maxY = Math.max(maxY, q.y); });
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, ext = Math.max((maxX - minX) / 2, (maxY - minY) / 2);
      const halfH = d * Math.tan(camera.fov * Math.PI / 360), halfW = halfH * camera.aspect;
      const right = new T.Vector3().setFromMatrixColumn(camera.matrixWorld, 0), up = new T.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
      target.addScaledVector(right, cx * halfW).addScaledVector(up, cy * halfH);
      d *= ext / cover;
    }
    camera.position.copy(target).addScaledVector(dv, d); camera.lookAt(target); camera.updateProjectionMatrix();
  }
  function roundRect(T, w, h, r) {
    const s = new T.Shape();
    s.moveTo(r, 0); s.lineTo(w - r, 0); s.quadraticCurveTo(w, 0, w, r); s.lineTo(w, h - r); s.quadraticCurveTo(w, h, w - r, h);
    s.lineTo(r, h); s.quadraticCurveTo(0, h, 0, h - r); s.lineTo(0, r); s.quadraticCurveTo(0, 0, r, 0); return s;
  }

  const BUILD = {};

  BUILD.truck = (T, o, aspect) => {
    const scene = new T.Scene(), g = new T.Group(); scene.add(g);
    const D = 2.5;
    const red = M(T, R, 0.32, 0.2), white = M(T, 0xf3f4f6, 0.5), dark = M(T, 0x1d2026, 0.75), tire = M(T, 0x17181b, 0.9);
    const glass = M(T, 0x1b2a38, 0.08, 0.5), steel = M(T, 0xb9bdc2, 0.3, 0.75), chrome = M(T, 0xdfe3e7, 0.15, 0.9);
    // cab
    const s = new T.Shape();
    s.moveTo(0, 1.0); s.lineTo(0, 2.3); s.lineTo(0.28, 3.45); s.quadraticCurveTo(0.36, 3.75, 0.72, 3.75); s.lineTo(2.4, 3.75); s.lineTo(2.4, 1.0); s.closePath();
    mesh(T, new T.ExtrudeGeometry(s, { depth: D - 0.12, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 5, curveSegments: 16 }), red, g, [0, 0, 0.06]);
    // roof fairing
    const f = new T.Shape(); f.moveTo(0.9, 3.75); f.quadraticCurveTo(1.6, 4.2, 2.4, 4.22); f.lineTo(2.4, 3.75); f.closePath();
    mesh(T, new T.ExtrudeGeometry(f, { depth: D - 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 }), red, g, [0, 0, 0.15]);
    // windshield
    const ws = new T.Group(); ws.position.set(0.064, 2.9, D / 2); ws.rotation.z = -Math.atan2(0.28, 1.15); g.add(ws);
    mesh(T, new T.PlaneGeometry(D - 0.32, 1.02), glass, ws, [0, 0, 0], [0, -Math.PI / 2, 0]);
    // grille + lights + bumper
    mesh(T, new T.PlaneGeometry(D - 0.6, 0.9), dark, g, [-0.065, 1.72, D / 2], [0, -Math.PI / 2, 0]);
    for (let i = 0; i < 6; i++) mesh(T, new T.BoxGeometry(0.02, 0.03, D - 0.66), chrome, g, [-0.07, 1.36 + i * 0.14, D / 2]);
    const lamp = M(T, 0xffffff, 0.2, 0, { emissive: 0xfff6e0, emissiveIntensity: 0.6 });
    mesh(T, new T.BoxGeometry(0.06, 0.16, 0.38), lamp, g, [-0.07, 1.2, 0.34]);
    mesh(T, new T.BoxGeometry(0.06, 0.16, 0.38), lamp, g, [-0.07, 1.2, D - 0.34]);
    mesh(T, new T.BoxGeometry(0.34, 0.34, D + 0.04), dark, g, [0.06, 0.92, D / 2]);
    // side window, door line, mirror
    mesh(T, new T.PlaneGeometry(0.95, 0.92), glass, g, [1.02, 2.98, D + 0.004]);
    mesh(T, new T.BoxGeometry(0.06, 0.95, 0.06), dark, g, [0.36, 2.95, D + 0.12]);
    mesh(T, new T.BoxGeometry(0.12, 0.42, 0.22), dark, g, [0.36, 3.28, D + 0.2]);
    const doorLogo = tex(T, 1024, 300, (c, w, h) => { const hh = fitH(c, o.p, h * 0.6, w * 0.92); drawLogo(c, { p: o.p, fundo: 'vermelho' }, w / 2, (h - hh) / 2, hh, 'center'); });
    decal(T, g, doorLogo, 1.7, 0.5, [1.25, 1.92, D + 0.006]);
    // steps + tank
    mesh(T, new T.BoxGeometry(0.6, 0.06, 0.28), chrome, g, [1.2, 0.86, D - 0.1]);
    mesh(T, new T.CylinderGeometry(0.3, 0.3, 1.0, 32), steel, g, [2.2, 0.98, D - 0.36], [0, 0, Math.PI / 2]);
    // stack
    mesh(T, new T.CylinderGeometry(0.08, 0.08, 2.8, 20), chrome, g, [2.52, 3.0, D - 0.18]);
    // chassis
    mesh(T, new T.BoxGeometry(16.0, 0.3, 1.0), dark, g, [8.4, 1.0, D / 2]);
    // trailer
    const L = 13.6, H = 2.85, x0 = 2.85, y0 = 1.3;
    mesh(T, new T.ExtrudeGeometry(roundRect(T, L, H, 0.08), { depth: D - 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }), white, g, [x0, y0, 0.02]);
    const side = tex(T, 2400, Math.round(2400 * (H - 0.12) / (L - 0.12)), (c, w, h) => {
      c.fillStyle = '#F3F4F6'; c.fillRect(0, 0, w, h);
      c.fillStyle = R; c.fillRect(0, h * 0.84, w, h * 0.16);
      para(c, w * 0.08, h * 0.84, h * 0.4, h * 0.16, '#F3F4F6'); para(c, w * 0.08 + h * 0.25, h * 0.84, h * 0.5, h * 0.16, '#F3F4F6');
      const lh = fitH(c, o.p, h * 0.3, w * 0.6); drawLogo(c, { p: o.p, fundo: 'claro' }, w / 2, h * 0.24, lh, 'center');
      label(c, 'TRANSPORTE · LOGÍSTICA · ARMAZENAGEM', w / 2, h * 0.68, h * 0.055, K, 0.18);
      label(c, '(51) 3052-2666  ·  cadomar.com.br', w / 2, h * 0.92, h * 0.065, W, 0.06);
    });
    decal(T, g, side, L - 0.12, H - 0.12, [x0 + L / 2, y0 + H / 2, D + 0.002]);
    // trailer front + rear frame
    mesh(T, new T.BoxGeometry(0.08, H, D + 0.04), M(T, 0xdfe2e6, 0.5), g, [x0 + L - 0.02, y0 + H / 2, D / 2]);
    mesh(T, new T.BoxGeometry(L, 0.1, 0.06), M(T, 0xc3c8ce, 0.4, 0.4), g, [x0 + L / 2, y0 + 0.05, D + 0.02]);
    // landing gear + underrun
    mesh(T, new T.BoxGeometry(0.12, 0.9, 0.12), dark, g, [6.2, 0.75, D - 0.4]);
    mesh(T, new T.BoxGeometry(6.6, 0.08, 0.05), steel, g, [9.3, 0.95, D - 0.08]);
    // wheels
    const wheel = (x, z) => {
      mesh(T, new T.CylinderGeometry(0.52, 0.52, 0.36, 48), tire, g, [x, 0.52, z], [Math.PI / 2, 0, 0]);
      mesh(T, new T.CylinderGeometry(0.3, 0.3, 0.38, 32), steel, g, [x, 0.52, z], [Math.PI / 2, 0, 0]);
      mesh(T, new T.CylinderGeometry(0.1, 0.1, 0.4, 16), dark, g, [x, 0.52, z], [Math.PI / 2, 0, 0]);
    };
    [0.95, 3.35, 4.5, 13.4, 14.55, 15.7].forEach(x => { wheel(x, 0.19); wheel(x, D - 0.19); });
    // mudguards
    mesh(T, new T.BoxGeometry(2.4, 0.06, 0.5), dark, g, [3.92, 1.12, D - 0.24]);
    lights(T, scene, [8, 1, 1.25], [-7, 14, 10], 14, 2.5);
    shadowGround(T, scene, 0, 0.26);
    const cam = new T.PerspectiveCamera(24, aspect, 0.1, 400);
    frame(T, cam, g, [-0.62, 0.3, 1], 0.94);
    return { scene, camera: cam };
  };

  BUILD.facade = (T, o, aspect) => {
    const scene = new T.Scene(), g = new T.Group(); scene.add(g);
    const Wd = 16, H = 5.4, Dp = 9;
    const wall = M(T, 0xe6e9ec, 0.9), dark = M(T, K, 0.6), glass = M(T, 0x2c4a63, 0.06, 0.55), frameM = M(T, 0x434952, 0.4, 0.6);
    const white = M(T, 0xffffff, 0.5), red = M(T, R, 0.4, 0.1);
    mesh(T, new T.BoxGeometry(Wd, H, Dp), wall, g, [0, H / 2, 0]);
    mesh(T, new T.BoxGeometry(Wd + 0.04, 0.5, Dp + 0.04), M(T, 0x868d97, 0.9), g, [0, 0.25, 0]);
    // fascia
    const fz = Dp / 2 + 0.25;
    mesh(T, new T.BoxGeometry(Wd + 0.6, 1.8, 0.5), white, g, [0, H - 0.6, fz - 0.15]);
    mesh(T, new T.BoxGeometry(Wd + 0.6, 0.22, 0.52), red, g, [0, H - 1.6, fz - 0.15]);
    const sign = tex(T, 2400, 260, (c, w, h) => { const lh = fitH(c, o.p, h * 0.58, w * 0.5); drawLogo(c, { p: o.p, fundo: 'claro' }, w / 2, (h - lh) / 2, lh, 'center'); });
    decal(T, g, sign, Wd + 0.5, 1.7, [0, H - 0.6, fz + 0.102]);
    // side band
    mesh(T, new T.BoxGeometry(0.06, 0.22, Dp), red, g, [Wd / 2 + 0.03, H - 1.6, 0]);
    const sideSign = tex(T, 1600, 320, (c, w, h) => { const lh = fitH(c, o.p, h * 0.42, w * 0.6); drawLogo(c, { p: o.p, fundo: 'claro' }, w / 2, (h - lh) / 2, lh, 'center'); });
    decal(T, g, sideSign, 6, 1.2, [Wd / 2 + 0.01, H - 0.75, -0.5], [0, Math.PI / 2, 0]);
    // storefront glass
    const gz = Dp / 2 + 0.01;
    mesh(T, new T.PlaneGeometry(8.4, 3.2), glass, g, [-3.4, 2.2, gz]);
    for (let i = 0; i <= 6; i++) mesh(T, new T.BoxGeometry(0.1, 3.3, 0.1), frameM, g, [-7.6 + i * 1.4, 2.2, gz + 0.04]);
    mesh(T, new T.BoxGeometry(8.5, 0.1, 0.1), frameM, g, [-3.4, 3.8, gz + 0.04]);
    mesh(T, new T.BoxGeometry(8.5, 0.1, 0.1), frameM, g, [-3.4, 0.6, gz + 0.04]);
    // dock door
    const dock = tex(T, 512, 512, (c, w, h) => { c.fillStyle = '#C3C8CE'; c.fillRect(0, 0, w, h); c.fillStyle = '#A9AFB6'; for (let y = 0; y < h; y += 28) c.fillRect(0, y, w, 4); });
    mesh(T, new T.PlaneGeometry(4.2, 3.8), new T.MeshStandardMaterial({ map: dock, roughness: 0.6, metalness: 0.3 }), g, [3.6, 2.05, gz]);
    mesh(T, new T.BoxGeometry(4.6, 0.2, 0.3), frameM, g, [3.6, 4.05, gz + 0.1]);
    mesh(T, new T.BoxGeometry(0.4, 0.6, 0.3), dark, g, [1.7, 0.8, gz + 0.15]);
    mesh(T, new T.BoxGeometry(0.4, 0.6, 0.3), dark, g, [5.5, 0.8, gz + 0.15]);
    // small window
    mesh(T, new T.PlaneGeometry(1.6, 1.2), glass, g, [6.9, 2.4, gz]);
    // totem
    const tg = new T.Group(); tg.position.set(10.6, 0, Dp / 2 + 3.5); tg.rotation.y = -0.35; g.add(tg);
    mesh(T, new T.BoxGeometry(1.4, 6.4, 0.5), dark, tg, [0, 3.2, 0]);
    mesh(T, new T.BoxGeometry(1.42, 0.3, 0.52), red, tg, [0, 0.5, 0]);
    const tt = tex(T, 300, 1400, (c, w, h) => { c.save(); c.translate(w / 2, h / 2); c.rotate(-Math.PI / 2); const lh = fitH(c, o.p, w * 0.42, h * 0.8); drawLogo(c, { p: o.p, fundo: 'escuro' }, 0, -lh / 2, lh, 'center'); c.restore(); });
    decal(T, tg, tt, 1.2, 5.6, [0, 3.6, 0.252]);
    // ground: concrete apron + sidewalk
    const ground = mesh(T, new T.PlaneGeometry(120, 120), M(T, 0xd5d9dd, 0.95), scene, [0, 0, 0], [-Math.PI / 2, 0, 0]); ground.castShadow = false;
    mesh(T, new T.BoxGeometry(Wd + 14, 0.14, 2.2), M(T, 0xbfc5cb, 0.95), scene, [2, 0.07, Dp / 2 + 1.3]);
    lights(T, scene, [2, 2, 2], [-9, 16, 14], 18, 2.6);
    const cam = new T.PerspectiveCamera(28, aspect, 0.1, 400);
    frame(T, cam, g, [0.55, 0.22, 1], 0.9);
    return { scene, camera: cam };
  };

  function shirtShape(T, collarY) {
    const P = ([x, y]) => [(x - 150) / 100, (160 - y) / 100];
    const pts = [[100, 18], [58, 32], [8, 78], [42, 124], [72, 104], [72, 306], [228, 306], [228, 104], [258, 124], [292, 78], [242, 32], [200, 18]];
    const s = new T.Shape(); s.moveTo(...P(pts[0])); for (let i = 1; i < pts.length; i++) s.lineTo(...P(pts[i]));
    s.quadraticCurveTo(...P([150, collarY]), ...P([100, 18])); return s;
  }
  function apparelScene(T, aspect, build) {
    const scene = new T.Scene(), g = new T.Group(); scene.add(g);
    build(g);
    g.rotation.set(0.06, -0.22, 0.02);
    const back = new T.Mesh(new T.PlaneGeometry(40, 40), new T.ShadowMaterial({ opacity: 0.09 })); back.position.z = -1.6; back.receiveShadow = true; scene.add(back);
    lights(T, scene, [0, 0, 0], [-2, 4, 9], 5, 2.3);
    const cam = new T.PerspectiveCamera(28, aspect, 0.1, 100);
    frame(T, cam, g, [0.12, 0.06, 1], 0.86);
    return { scene, camera: cam };
  }
  const EXT = { depth: 0.06, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.1, bevelSegments: 10, curveSegments: 24 };

  BUILD.tshirt = (T, o, aspect) => apparelScene(T, aspect, g => {
    const back = o.variant === 'costas';
    const color = back ? R : 0xf7f7f5;
    const fab = M(T, color, 0.95);
    mesh(T, new T.ExtrudeGeometry(shirtShape(T, back ? 32 : 62), EXT), fab, g);
    const zF = 0.06 + 0.16 + 0.004;
    const curve = new T.QuadraticBezierCurve3(new T.Vector3(-0.5, 1.42, zF - 0.02), new T.Vector3(0, back ? 1.28 : 0.98, zF - 0.02), new T.Vector3(0.5, 1.42, zF - 0.02));
    mesh(T, new T.TubeGeometry(curve, 40, 0.035, 12, false), M(T, back ? 0xbe1e15 : 0xe6e7e9, 0.9), g);
    mesh(T, new T.ExtrudeGeometry(new T.Shape().absellipse(0, 1.38, 0.5, 0.22, 0, Math.PI * 2), { depth: 0.02, bevelEnabled: false }), M(T, back ? 0x9c1710 : 0xc9cbce, 1), g, [0, 0, -0.06]);
    if (back) {
      const t = tex(T, 1400, 700, (c, w, h) => { const lh = fitH(c, o.p, h * 0.3, w * 0.92); drawLogo(c, { p: o.p, fundo: 'vermelho' }, w / 2, h * 0.2, lh, 'center'); label(c, 'DESDE 1968', w / 2, h * 0.78, h * 0.07, W, 0.3); });
      decal(T, g, t, 1.2, 0.6, [0, 0.62, zF]);
    } else {
      const t = tex(T, 800, 240, (c, w, h) => { const lh = fitH(c, o.p, h * 0.6, w * 0.96); drawLogo(c, { p: o.p, fundo: 'claro' }, w / 2, (h - lh) / 2, lh, 'center'); });
      decal(T, g, t, 0.44, 0.13, [0.36, 0.86, zF]);
    }
  });

  BUILD.uniform = (T, o, aspect) => apparelScene(T, aspect, g => {
    const fab = M(T, 0x24445F, 0.92), fabD = M(T, 0x182F42, 0.92);
    mesh(T, new T.ExtrudeGeometry(shirtShape(T, 40), EXT), fab, g);
    const zF = 0.06 + 0.16 + 0.004;
    // collar wings
    const cl = new T.Shape(); cl.moveTo(-0.5, 1.44); cl.lineTo(-0.02, 1.0); cl.lineTo(-0.3, 1.02); cl.closePath();
    const cr = new T.Shape(); cr.moveTo(0.5, 1.44); cr.lineTo(0.02, 1.0); cr.lineTo(0.3, 1.02); cr.closePath();
    const cExt = { depth: 0.02, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 4 };
    mesh(T, new T.ExtrudeGeometry(cl, cExt), fabD, g, [0, 0, zF - 0.01]);
    mesh(T, new T.ExtrudeGeometry(cr, cExt), fabD, g, [0, 0, zF - 0.01]);
    mesh(T, new T.BoxGeometry(0.08, 1.9, 0.02), fabD, g, [0, 0.05, zF]);
    for (let i = 0; i < 4; i++) mesh(T, new T.CylinderGeometry(0.025, 0.025, 0.02, 16), M(T, 0xd7e2ec, 0.4), g, [0, 0.85 - i * 0.42, zF + 0.015], [Math.PI / 2, 0, 0]);
    const stripes = tex(T, 1024, 256, (c, w, h) => { c.fillStyle = '#D9DDE1'; c.fillRect(0, h * 0.1, w, h * 0.32); c.fillStyle = R; c.fillRect(0, h * 0.58, w, h * 0.32); });
    const sm = decal(T, g, stripes, 1.56, 0.36, [0, -0.62, zF + 0.002]); sm.material.metalness = 0.5; sm.material.roughness = 0.35;
    const t = tex(T, 800, 240, (c, w, h) => { const lh = fitH(c, o.p, h * 0.6, w * 0.96); drawLogo(c, { p: o.p, fundo: 'escuro' }, w / 2, (h - lh) / 2, lh, 'center'); });
    decal(T, g, t, 0.42, 0.126, [0.36, 0.72, zF + 0.002]);
    const n = tex(T, 600, 120, (c, w, h) => label(c, 'MOTORISTA', w / 2, h / 2, h * 0.42, W, 0.2));
    decal(T, g, n, 0.36, 0.072, [-0.38, 0.72, zF + 0.002]);
  });

  BUILD.cap = (T, o, aspect) => {
    const scene = new T.Scene(), g = new T.Group(); scene.add(g);
    const one = (crownColor, brimColor, fundo, x, ry) => {
      const c = new T.Group(); c.position.x = x; c.rotation.y = ry; g.add(c);
      const fab = M(T, crownColor, 0.92), brimM = M(T, brimColor, 0.85);
      const sc = [1, 0.86, 1.12];
      const crown = mesh(T, new T.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), fab, c); crown.scale.set(...sc);
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3 + Math.PI / 6, pts = [];
        for (let k = 0; k <= 24; k++) { const th = k / 24 * Math.PI / 2; pts.push(new T.Vector3(-Math.cos(a) * Math.sin(th) * 1.003 * sc[0], Math.cos(th) * 1.003 * sc[1], Math.sin(a) * Math.sin(th) * 1.003 * sc[2])); }
        mesh(T, new T.TubeGeometry(new T.CatmullRomCurve3(pts), 24, 0.008, 6, false), M(T, 0x000000, 1, 0, { transparent: true, opacity: 0.25 }), c);
      }
      mesh(T, new T.SphereGeometry(0.07, 16, 12), fab, c, [0, 0.86, 0]);
      const t = tex(T, 1024, 512, (cx, w, h) => { const lh = fitH(cx, o.p, h * 0.3, w * 0.8); drawLogo(cx, { p: o.p, fundo }, w / 2, h * 0.42, lh, 'center'); });
      const lg = new T.Mesh(new T.SphereGeometry(1.006, 48, 24, Math.PI / 2 - 0.62, 1.24, 0.5, 0.95), new T.MeshStandardMaterial({ map: t, transparent: true, roughness: 0.8, polygonOffset: true, polygonOffsetFactor: -2 }));
      lg.scale.set(...sc); c.add(lg);
      const bs = new T.Shape(); bs.absellipse(0, 0, 1.03, 1.95, 0, Math.PI, false); bs.absellipse(0, 0, 0.98, 1.08, Math.PI, 0, true);
      const bg = new T.Group(); bg.position.set(0, 0.0, 1.0); bg.rotation.x = 0.06; c.add(bg);
      const bgeo = new T.ExtrudeGeometry(bs, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 48 });
      const pos = bgeo.attributes.position; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i); pos.setZ(i, pos.getZ(i) + 0.2 * x * x); } bgeo.computeVertexNormals();
      mesh(T, bgeo, brimM, bg, [0, 0.03, -1.0], [Math.PI / 2, 0, 0]);
      mesh(T, new T.CylinderGeometry(1.0, 1.0, 0.1, 64, 1, true), M(T, crownColor === K ? 0x2a2e35 : 0xbe1e15, 0.9, 0, { side: T.DoubleSide }), c, [0, 0.03, 0]).scale.set(1, 1, 1.12);
    };
    if (o.variant === 'preto') one(K, R, 'escuro', 0, -0.5);
    else if (o.variant === 'vermelho') one(R, R, 'vermelho', 0, 0.85);
    else { one(R, R, 'vermelho', -1.25, -0.25); one(K, R, 'escuro', 1.35, -0.75); }
    lights(T, scene, [0, 0, 0], [-3, 6, 6], 5, 2.4);
    shadowGround(T, scene, -0.32, 0.2);
    const cam = new T.PerspectiveCamera(28, aspect, 0.1, 100);
    frame(T, cam, g, [0.1, 0.62, 1], 0.84);
    return { scene, camera: cam };
  };

  let renderer = null, queue = Promise.resolve();
  function dispose(scene) {
    scene.traverse(m => { if (m.geometry) m.geometry.dispose(); if (m.material) { const ms = Array.isArray(m.material) ? m.material : [m.material]; ms.forEach(x => { if (x.map) x.map.dispose(); x.dispose(); }); } });
  }
  function render(kind, opts, w, h) {
    const job = queue.then(async () => {
      const T = await getThree(); await ensureFonts();
      if (!renderer) {
        renderer = new T.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.toneMapping = T.NeutralToneMapping || T.NoToneMapping; renderer.toneMappingExposure = 1.0;
        renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
        renderer.setClearColor(0x000000, 0); renderer.setPixelRatio(1);
      }
      renderer.setSize(w, h, false);
      const { scene, camera } = (BUILD[kind] || BUILD.truck)(T, opts, w / h);
      renderer.render(scene, camera);
      const url = renderer.domElement.toDataURL('image/png');
      dispose(scene); return url;
    });
    queue = job.catch(() => {}); return job;
  }

  class Cdm3D extends HTMLElement {
    static get observedAttributes() { return ['kind', 'proposta', 'variant']; }
    connectedCallback() {
      this.style.display = 'block'; this.style.overflow = 'hidden';
      if (!this._img) { this._img = document.createElement('img'); this._img.alt = ''; this._img.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:contain;'; this.appendChild(this._img); }
      if (!this._ro) this._ro = new ResizeObserver(() => this._schedule());
      this._ro.observe(this); this._schedule();
    }
    disconnectedCallback() { if (this._ro) this._ro.disconnect(); }
    attributeChangedCallback() { this._schedule(); }
    _schedule() { clearTimeout(this._t); this._t = setTimeout(() => this._render(), 150); }
    async _render() {
      const w = Math.min(1400, Math.round(this.clientWidth)), h = Math.min(1000, Math.round(this.clientHeight));
      if (w < 20 || h < 20) return;
      if (this._last && Math.abs(this._last[0] - w) < 6 && Math.abs(this._last[1] - h) < 6 && this._lastAttr === [this.getAttribute('kind'), this.getAttribute('proposta'), this.getAttribute('variant')].join()) return;
      this._last = [w, h]; this._lastAttr = [this.getAttribute('kind'), this.getAttribute('proposta'), this.getAttribute('variant')].join();
      const kind = this.getAttribute('kind') || 'truck', p = this.getAttribute('proposta') || 'a', variant = this.getAttribute('variant') || '';
      const key = [kind, p, variant, w, h].join('|'); if (key === this._key) return; this._key = key;
      try { const url = await render(kind, { p, variant }, w * 2, h * 2); if (this._key === key) this._img.src = url; }
      catch (e) { console.error('cdm-3d', e); this._key = null; }
    }
  }
  customElements.define('cdm-3d', Cdm3D);
})();
