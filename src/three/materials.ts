import * as THREE from "three";

import { findFinish, type FinishId } from "./finishData";

/** Amarelo do logo, quente como fita de LED. Multiplicado acima de 1 para o bloom brilhar. */
export const LED_COLOR = new THREE.Color("#ffb347");

const mulberry32 = (seed: number) => {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const rgba = (hex: string, alpha: number): string => {
  const color = new THREE.Color(hex);
  return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${alpha})`;
};

/** Veio de madeira desenhado em canvas: nenhuma imagem para baixar. */
const makeWoodTexture = (base: string, grain: string, seed: number): THREE.CanvasTexture => {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  const random = mulberry32(seed);

  if (context) {
    context.fillStyle = base;
    context.fillRect(0, 0, size, size);
    for (let line = 0; line < 320; line++) {
      let x = random() * size;
      context.strokeStyle = rgba(grain, 0.04 + random() * 0.16);
      context.lineWidth = 0.4 + random() * 2.4;
      context.beginPath();
      context.moveTo(x, 0);
      for (let y = 0; y <= size; y += 32) {
        x += (random() - 0.5) * 5 + Math.sin(y * 0.012 + line) * 1.2;
        context.lineTo(x, y);
      }
      context.stroke();
    }
    for (let speck = 0; speck < 2200; speck++) {
      context.fillStyle = rgba(random() > 0.5 ? grain : "#ffffff", 0.025 + random() * 0.04);
      context.fillRect(random() * size, random() * size, 1 + random() * 2, 6 + random() * 18);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
};

const bodyCache = new Map<FinishId, THREE.MeshStandardMaterial>();

export const getBodyMaterial = (id: FinishId): THREE.MeshStandardMaterial => {
  const cached = bodyCache.get(id);
  if (cached) return cached;

  const finish = findFinish(id);
  const material = new THREE.MeshStandardMaterial({ color: finish.color, roughness: finish.roughness, metalness: 0.02 });
  if (finish.grain) {
    material.map = makeWoodTexture(finish.color, finish.grain, id.length * 977);
    material.color = new THREE.Color("#ffffff");
  }
  bodyCache.set(id, material);
  return material;
};

export const sharedMaterials = {
  interior: new THREE.MeshStandardMaterial({ color: "#d9d1c3", roughness: 0.85 }),
  dark: new THREE.MeshStandardMaterial({ color: "#15120f", roughness: 0.9 }),
  metal: new THREE.MeshStandardMaterial({ color: "#d9b45a", metalness: 1, roughness: 0.28 }),
  stone: new THREE.MeshStandardMaterial({ color: "#b9b0a3", roughness: 0.42, metalness: 0.05 }),
  stoneDark: new THREE.MeshStandardMaterial({ color: "#26252a", roughness: 0.3, metalness: 0.15 }),
  splash: new THREE.MeshStandardMaterial({ color: "#4b423a", roughness: 0.55 }),
  wall: new THREE.MeshStandardMaterial({ color: "#4a3e34", roughness: 0.95 }),
  glass: new THREE.MeshStandardMaterial({ color: "#050506", roughness: 0.08, metalness: 0.3 }),
  ceramic: new THREE.MeshStandardMaterial({ color: "#f2eee6", roughness: 0.15, side: THREE.DoubleSide }),
  floor: new THREE.MeshStandardMaterial({ color: "#2a231d", roughness: 0.38, metalness: 0.15 }),
};

const textureCache = new Map<string, THREE.CanvasTexture>();

export type GlowKind = "linear" | "radial";

/** Degradê aditivo que "pinta" a luz do LED na parede e no chão. */
export const getGlowTexture = (kind: GlowKind): THREE.CanvasTexture => {
  const cached = textureCache.get(`glow-${kind}`);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient =
      kind === "linear"
        ? context.createLinearGradient(0, 0, 0, 256)
        : context.createRadialGradient(64, 128, 0, 64, 128, 128);
    gradient.addColorStop(0, "rgba(255, 190, 90, 0.95)");
    gradient.addColorStop(0.4, "rgba(255, 170, 60, 0.35)");
    gradient.addColorStop(1, "rgba(255, 150, 40, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(`glow-${kind}`, texture);
  return texture;
};

/** Textura de azulejo 10x10 cm com rejunte, para a parede do banheiro. */
export const getTileTexture = (): THREE.CanvasTexture => {
  const cached = textureCache.get("tile");
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#3a322b";
    context.fillRect(0, 0, 512, 512);
    context.strokeStyle = "rgba(0,0,0,0.55)";
    context.lineWidth = 3;
    for (let step = 0; step <= 512; step += 64) {
      context.beginPath();
      context.moveTo(step, 0);
      context.lineTo(step, 512);
      context.moveTo(0, step);
      context.lineTo(512, step);
      context.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 4);
  textureCache.set("tile", texture);
  return texture;
};

/** "Arte" abstrata que aparece na TV do painel quando ela é ligada. */
export const getScreenTexture = (): THREE.CanvasTexture => {
  const cached = textureCache.get("screen");
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 288;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createLinearGradient(0, 0, 512, 288);
    gradient.addColorStop(0, "#1d2b64");
    gradient.addColorStop(0.5, "#c0507a");
    gradient.addColorStop(1, "#f7cd48");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 288);
    context.fillStyle = "rgba(0,0,0,0.25)";
    context.beginPath();
    context.arc(380, 200, 140, 0, Math.PI * 2);
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set("screen", texture);
  return texture;
};

/** Reflexo de espelho desenhado em canvas: um espelho "de verdade" só reflete o ambiente, que aqui é escuro. */
const getMirrorTexture = (): THREE.CanvasTexture => {
  const cached = textureCache.get("mirror");
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (context) {
    const base = context.createLinearGradient(0, 0, 256, 512);
    base.addColorStop(0, "#dfe5e8");
    base.addColorStop(0.5, "#aeb9bf");
    base.addColorStop(1, "#cfd7db");
    context.fillStyle = base;
    context.fillRect(0, 0, 256, 512);
    // faixas de luz diagonais, como o reflexo de uma janela
    for (const [x, width, alpha] of [
      [20, 46, 0.42],
      [96, 18, 0.3],
      [150, 70, 0.22],
    ] as const) {
      const streak = context.createLinearGradient(x, 0, x + width, 0);
      streak.addColorStop(0, "rgba(255,255,255,0)");
      streak.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
      streak.addColorStop(1, "rgba(255,255,255,0)");
      context.save();
      context.translate(128, 256);
      context.rotate(-0.38);
      context.translate(-128, -256);
      context.fillStyle = streak;
      context.fillRect(x - 60, -200, width + 120, 900);
      context.restore();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set("mirror", texture);
  return texture;
};

let mirrorMaterial: THREE.MeshStandardMaterial | null = null;

export const getMirrorMaterial = (): THREE.MeshStandardMaterial => {
  mirrorMaterial ??= new THREE.MeshStandardMaterial({
    map: getMirrorTexture(),
    color: "#ffffff",
    roughness: 0.14,
    metalness: 0.25,
    envMapIntensity: 1.1,
  });
  return mirrorMaterial;
};
