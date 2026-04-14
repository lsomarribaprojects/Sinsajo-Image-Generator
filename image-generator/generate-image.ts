#!/usr/bin/env npx tsx
/**
 * Sinsajo Image Generator v3
 * Multi-provider AI image generation with smart routing for sales & marketing.
 *
 * Built by Sinsajo Creators — AI-powered digital marketing agency
 * https://www.sinsajocreators.com | #WeMakeYourBrandFly
 *
 * Providers: Gemini, OpenRouter, Ideogram, Flux (fal.ai), Recraft, OpenAI
 *
 * @author Sinsajo Creators <sales@sinsajocreators.com>
 * @license MIT
 */

import fs from "fs";
import path from "path";

// ─── Types ───────────────────────────────────────────────────────────

type ProviderName = "gemini" | "openrouter" | "ideogram" | "flux" | "recraft" | "openai";

interface GenerateResult {
  imageBuffer: Buffer | null;
  textResponse: string | null;
}

interface TypePreset {
  providers: ProviderName[];
  aspect: string;
  prefix: string;
}

interface ApiKeys {
  geminiKey?: string;
  openrouterKey?: string;
  ideogramKey?: string;
  falKey?: string;
  recraftKey?: string;
  openaiKey?: string;
}

// ─── CLI Parsing ─────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
}

const prompt = getArg("prompt");
const inputImage = getArg("image");
const outputPath = getArg("output");
const aspectArg = getArg("aspect");
const modelArg = getArg("model");
const typeArg = getArg("type");
const providerArg = getArg("provider") as ProviderName | undefined;
const qualityArg = getArg("quality") || "medium";

// ─── Type Presets (Sales Image Routing) ──────────────────────────────

const TYPE_PRESETS: Record<string, TypePreset> = {
  "ad-creative": {
    providers: ["ideogram", "openai", "gemini"],
    aspect: "16:9",
    prefix: "Marketing banner ad creative with bold, perfectly readable headline text. High contrast, professional design. ",
  },
  "product-mockup": {
    providers: ["recraft", "flux", "openai"],
    aspect: "1:1",
    prefix: "Professional product mockup photography on clean minimal background, studio lighting. ",
  },
  "social-post": {
    providers: ["openai", "gemini", "openrouter"],
    aspect: "1:1",
    prefix: "Eye-catching social media post, modern design, vibrant colors. ",
  },
  thumbnail: {
    providers: ["ideogram", "openai", "gemini"],
    aspect: "16:9",
    prefix: "YouTube thumbnail with bold readable text, high contrast, attention-grabbing. ",
  },
  logo: {
    providers: ["recraft", "ideogram", "gemini"],
    aspect: "1:1",
    prefix: "Minimalist professional logo design, clean vector style, simple and memorable. ",
  },
  lifestyle: {
    providers: ["flux", "openai", "gemini"],
    aspect: "16:9",
    prefix: "Photorealistic lifestyle product photography, natural lighting, real-world setting. ",
  },
  infographic: {
    providers: ["openai", "ideogram", "gemini"],
    aspect: "16:9",
    prefix: "Professional infographic with clear data visualization, structured layout, readable text. ",
  },
  "email-header": {
    providers: ["gemini", "openai", "openrouter"],
    aspect: "3:2",
    prefix: "Email header banner, professional and clean, modern design. ",
  },
  "story-cover": {
    providers: ["ideogram", "openai", "gemini"],
    aspect: "9:16",
    prefix: "Vertical story cover with bold engaging text, mobile-optimized design. ",
  },
  testimonial: {
    providers: ["ideogram", "openai", "recraft"],
    aspect: "1:1",
    prefix: "Professional testimonial card with perfectly readable quote text, clean layout. ",
  },
};

// ─── Help ────────────────────────────────────────────────────────────

if (!prompt) {
  console.error("Sinsajo Image Generator v3");
  console.error("==========================\n");
  console.error("Usage: npx tsx generate-image.ts --prompt 'description' [OPTIONS]\n");
  console.error("Options:");
  console.error("  --prompt      Text description (REQUIRED)");
  console.error("  --type        Smart routing by image type (see below)");
  console.error("  --provider    Force a specific provider: gemini, openrouter, ideogram, flux, recraft, openai");
  console.error("  --image       Input image path (for editing)");
  console.error("  --output      Output path (default: generated/img-{ts}.png)");
  console.error("  --aspect      Aspect ratio: 1:1, 16:9, 9:16, 4:3, 3:2 (default: 1:1)");
  console.error("  --model       Model ID override");
  console.error("  --quality     Quality: low, medium, high (default: medium)\n");
  console.error("Image Types (--type):");
  console.error("  ad-creative     Ad banners with text      → Ideogram > OpenAI > Gemini");
  console.error("  product-mockup  Product photography        → Recraft > Flux > OpenAI");
  console.error("  social-post     Social media graphics      → OpenAI > Gemini > OpenRouter");
  console.error("  thumbnail       YouTube/video thumbnails   → Ideogram > OpenAI > Gemini");
  console.error("  logo            Logo & brand assets        → Recraft > Ideogram > Gemini");
  console.error("  lifestyle       Lifestyle product shots    → Flux > OpenAI > Gemini");
  console.error("  infographic     Data visualizations        → OpenAI > Ideogram > Gemini");
  console.error("  email-header    Email campaign headers     → Gemini > OpenAI > OpenRouter");
  console.error("  story-cover     Instagram/TikTok stories   → Ideogram > OpenAI > Gemini");
  console.error("  testimonial     Client testimonial cards   → Ideogram > OpenAI > Recraft\n");
  console.error("Examples:");
  console.error('  npx tsx generate-image.ts --prompt "A futuristic city at sunset"');
  console.error('  npx tsx generate-image.ts --type ad-creative --prompt "50% OFF Summer Sale"');
  console.error('  npx tsx generate-image.ts --type thumbnail --prompt "How I Made $10K"');
  console.error('  npx tsx generate-image.ts --provider recraft --prompt "Minimalist S logo"');
  console.error('  npx tsx generate-image.ts --type lifestyle --prompt "Coffee mug on desk"');
  process.exit(1);
}

// ─── Load API Keys ───────────────────────────────────────────────────

function loadEnvKeys(): ApiKeys {
  const envPaths = [".env.local", ".env"];
  const keys: Record<string, string | undefined> = {};

  const KEY_NAMES = [
    "GEMINI_API_KEY",
    "OPENROUTER_API_KEY",
    "IDEOGRAM_API_KEY",
    "FAL_API_KEY",
    "RECRAFT_API_KEY",
    "OPENAI_API_KEY",
  ];

  for (const envPath of envPaths) {
    const fullPath = path.resolve(process.cwd(), envPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const keyName of KEY_NAMES) {
        if (!keys[keyName]) {
          const match = content.match(new RegExp(`${keyName}=(.+)`));
          if (match) keys[keyName] = match[1].trim();
        }
      }
    }
  }

  // Check environment variables
  for (const keyName of KEY_NAMES) {
    if (!keys[keyName] && process.env[keyName]) keys[keyName] = process.env[keyName];
  }

  return {
    geminiKey: keys.GEMINI_API_KEY,
    openrouterKey: keys.OPENROUTER_API_KEY,
    ideogramKey: keys.IDEOGRAM_API_KEY,
    falKey: keys.FAL_API_KEY,
    recraftKey: keys.RECRAFT_API_KEY,
    openaiKey: keys.OPENAI_API_KEY,
  };
}

const apiKeys = loadEnvKeys();

function hasKey(provider: ProviderName): boolean {
  const map: Record<ProviderName, string | undefined> = {
    gemini: apiKeys.geminiKey,
    openrouter: apiKeys.openrouterKey,
    ideogram: apiKeys.ideogramKey,
    flux: apiKeys.falKey,
    recraft: apiKeys.recraftKey,
    openai: apiKeys.openaiKey,
  };
  return !!map[provider];
}

// ─── Provider Selection ──────────────────────────────────────────────

function selectProvider(): ProviderName {
  // 1. Manual override
  if (providerArg) {
    if (!hasKey(providerArg)) {
      console.error(`ERROR: Provider '${providerArg}' selected but no API key found.`);
      const keyMap: Record<ProviderName, string> = {
        gemini: "GEMINI_API_KEY",
        openrouter: "OPENROUTER_API_KEY",
        ideogram: "IDEOGRAM_API_KEY",
        flux: "FAL_API_KEY",
        recraft: "RECRAFT_API_KEY",
        openai: "OPENAI_API_KEY",
      };
      console.error(`Set ${keyMap[providerArg]} in .env`);
      process.exit(1);
    }
    return providerArg;
  }

  // 2. Smart routing by type
  if (typeArg && TYPE_PRESETS[typeArg]) {
    const chain = TYPE_PRESETS[typeArg].providers;
    for (const p of chain) {
      if (hasKey(p)) return p;
    }
    console.error(`ERROR: No API key found for type '${typeArg}'.`);
    console.error(`Needs one of: ${chain.join(", ")}`);
    process.exit(1);
  }

  // 3. Default: Gemini → OpenRouter (backward compatible)
  if (apiKeys.geminiKey) return "gemini";
  if (apiKeys.openrouterKey) return "openrouter";
  if (apiKeys.openaiKey) return "openai";
  if (apiKeys.ideogramKey) return "ideogram";
  if (apiKeys.recraftKey) return "recraft";
  if (apiKeys.falKey) return "flux";

  console.error("ERROR: No API key found.\n");
  console.error("Set at least one in .env:");
  console.error("  GEMINI_API_KEY        (free at https://aistudio.google.com/apikey)");
  console.error("  OPENROUTER_API_KEY    (https://openrouter.ai/keys)");
  console.error("  IDEOGRAM_API_KEY      (https://developer.ideogram.ai)");
  console.error("  FAL_API_KEY           (https://fal.ai/dashboard/keys)");
  console.error("  RECRAFT_API_KEY       (https://www.recraft.ai)");
  console.error("  OPENAI_API_KEY        (https://platform.openai.com/api-keys)");
  process.exit(1);
}

// ─── Aspect Ratio Mapper ─────────────────────────────────────────────

function getAspect(): string {
  if (aspectArg) return aspectArg;
  if (typeArg && TYPE_PRESETS[typeArg]) return TYPE_PRESETS[typeArg].aspect;
  return "1:1";
}

const ASPECT_SIZES: Record<string, { w: number; h: number }> = {
  "1:1": { w: 1024, h: 1024 },
  "16:9": { w: 1536, h: 1024 },
  "9:16": { w: 1024, h: 1536 },
  "4:3": { w: 1365, h: 1024 },
  "3:2": { w: 1536, h: 1024 },
};

function aspectToIdeogram(a: string): string {
  const map: Record<string, string> = {
    "1:1": "ASPECT_1_1",
    "16:9": "ASPECT_16_9",
    "9:16": "ASPECT_9_16",
    "4:3": "ASPECT_4_3",
    "3:2": "ASPECT_3_2",
  };
  return map[a] || "ASPECT_1_1";
}

function aspectToSize(a: string): string {
  const s = ASPECT_SIZES[a] || ASPECT_SIZES["1:1"];
  return `${s.w}x${s.h}`;
}

// ─── Prompt Enhancer ─────────────────────────────────────────────────

function buildPrompt(): string {
  if (typeArg && TYPE_PRESETS[typeArg] && !providerArg) {
    return TYPE_PRESETS[typeArg].prefix + prompt;
  }
  return prompt!;
}

// ─── Input Image Helper ──────────────────────────────────────────────

function loadInputImage(): { base64: string; mime: string } | null {
  if (!inputImage) return null;
  const imgPath = path.resolve(inputImage);
  if (!fs.existsSync(imgPath)) {
    console.error(`ERROR: Input image not found: ${imgPath}`);
    process.exit(1);
  }
  const imgBuffer = fs.readFileSync(imgPath);
  const ext = path.extname(imgPath).slice(1).toLowerCase();
  const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  return { base64: imgBuffer.toString("base64"), mime };
}

// ─── URL → Buffer download helper ────────────────────────────────────

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

// ─── Provider: Gemini ────────────────────────────────────────────────

async function generateWithGemini(finalPrompt: string, aspect: string): Promise<GenerateResult> {
  const model = modelArg || "gemini-2.5-flash-image";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKeys.geminiKey}`;

  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

  const img = loadInputImage();
  if (img) parts.push({ inlineData: { mimeType: img.mime, data: img.base64 } });

  parts.push({ text: `${finalPrompt}\n\nGenerate the image in ${aspect} format. Return ONLY the image.` });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> } }>;
  };

  let imageBase64: string | null = null;
  let textResponse: string | null = null;

  for (const part of data.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData?.data) imageBase64 = part.inlineData.data;
    else if (part.text) textResponse = part.text;
  }

  return {
    imageBuffer: imageBase64 ? Buffer.from(imageBase64, "base64") : null,
    textResponse,
  };
}

// ─── Provider: OpenRouter ────────────────────────────────────────────

async function generateWithOpenRouter(finalPrompt: string, aspect: string): Promise<GenerateResult> {
  const model = modelArg || "google/gemini-2.5-flash-preview-image-generation";

  const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

  const img = loadInputImage();
  if (img) content.push({ type: "image_url", image_url: { url: `data:${img.mime};base64,${img.base64}` } });

  content.push({ type: "text", text: `${finalPrompt}\n\nGenerate the image with aspect ratio: ${aspect}. Return ONLY the image, no text.` });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKeys.openrouterKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages: [{ role: "user", content }] }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: Array<{ type: string; text?: string; image_url?: { url: string } }> | string } }>;
  };

  let imageBase64: string | null = null;
  let textResponse: string | null = null;

  const message = data.choices?.[0]?.message;
  if (message) {
    if (Array.isArray(message.content)) {
      for (const part of message.content) {
        if (part.type === "image_url" && part.image_url?.url) {
          const match = part.image_url.url.match(/^data:image\/\w+;base64,(.+)/);
          imageBase64 = match ? match[1] : part.image_url.url;
        } else if (part.type === "text" && part.text) {
          textResponse = part.text;
        }
      }
    } else if (typeof message.content === "string") {
      if (message.content.startsWith("data:image")) {
        const match = message.content.match(/^data:image\/\w+;base64,(.+)/);
        imageBase64 = match ? match[1] : null;
      } else {
        textResponse = message.content;
      }
    }
  }

  return {
    imageBuffer: imageBase64 ? Buffer.from(imageBase64, "base64") : null,
    textResponse,
  };
}

// ─── Provider: Ideogram V3 ──────────────────────────────────────────

async function generateWithIdeogram(finalPrompt: string, aspect: string): Promise<GenerateResult> {
  const response = await fetch("https://api.ideogram.ai/v1/ideogram-v3/generate", {
    method: "POST",
    headers: {
      "Api-Key": apiKeys.ideogramKey!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: finalPrompt,
      aspect_ratio: aspectToIdeogram(aspect),
      rendering_speed: qualityArg === "low" ? "TURBO" : qualityArg === "high" ? "QUALITY" : "DEFAULT",
      num_images: 1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ideogram API ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    data?: Array<{ url?: string; prompt?: string }>;
  };

  const imageUrl = data.data?.[0]?.url;
  if (!imageUrl) return { imageBuffer: null, textResponse: "No image URL in response" };

  const imageBuffer = await downloadImage(imageUrl);
  return { imageBuffer, textResponse: null };
}

// ─── Provider: Flux 2 Pro (fal.ai) ──────────────────────────────────

async function generateWithFlux(finalPrompt: string, aspect: string): Promise<GenerateResult> {
  const size = ASPECT_SIZES[aspect] || ASPECT_SIZES["1:1"];

  // fal.ai synchronous endpoint
  const response = await fetch("https://fal.run/fal-ai/flux-2-pro", {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKeys.falKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: finalPrompt,
      image_size: { width: size.w, height: size.h },
      num_images: 1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`fal.ai API ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    images?: Array<{ url?: string }>;
  };

  const imageUrl = data.images?.[0]?.url;
  if (!imageUrl) return { imageBuffer: null, textResponse: "No image URL in response" };

  const imageBuffer = await downloadImage(imageUrl);
  return { imageBuffer, textResponse: null };
}

// ─── Provider: Recraft V4 ───────────────────────────────────────────

async function generateWithRecraft(finalPrompt: string, aspect: string): Promise<GenerateResult> {
  const response = await fetch("https://external.api.recraft.ai/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKeys.recraftKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: finalPrompt,
      model: modelArg || "recraftv4",
      size: aspectToSize(aspect),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Recraft API ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    data?: Array<{ url?: string; b64_json?: string }>;
  };

  const item = data.data?.[0];
  if (!item) return { imageBuffer: null, textResponse: "No image in response" };

  if (item.b64_json) {
    return { imageBuffer: Buffer.from(item.b64_json, "base64"), textResponse: null };
  }
  if (item.url) {
    const imageBuffer = await downloadImage(item.url);
    return { imageBuffer, textResponse: null };
  }

  return { imageBuffer: null, textResponse: "No image data in response" };
}

// ─── Provider: OpenAI GPT Image ─────────────────────────────────────

async function generateWithOpenAI(finalPrompt: string, aspect: string): Promise<GenerateResult> {
  const size = aspectToSize(aspect);
  const qualityMap: Record<string, string> = { low: "low", medium: "medium", high: "high" };

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKeys.openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelArg || "gpt-image-1",
      prompt: finalPrompt,
      n: 1,
      size,
      quality: qualityMap[qualityArg] || "medium",
      output_format: "png",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };

  const item = data.data?.[0];
  if (!item) return { imageBuffer: null, textResponse: "No image in response" };

  if (item.b64_json) {
    return { imageBuffer: Buffer.from(item.b64_json, "base64"), textResponse: null };
  }
  if (item.url) {
    const imageBuffer = await downloadImage(item.url);
    return { imageBuffer, textResponse: null };
  }

  return { imageBuffer: null, textResponse: "No image data in response" };
}

// ─── Provider Dispatch ───────────────────────────────────────────────

const PROVIDER_FNS: Record<ProviderName, (prompt: string, aspect: string) => Promise<GenerateResult>> = {
  gemini: generateWithGemini,
  openrouter: generateWithOpenRouter,
  ideogram: generateWithIdeogram,
  flux: generateWithFlux,
  recraft: generateWithRecraft,
  openai: generateWithOpenAI,
};

const PROVIDER_LABELS: Record<ProviderName, string> = {
  gemini: "Gemini API",
  openrouter: "OpenRouter",
  ideogram: "Ideogram V3",
  flux: "Flux 2 Pro (fal.ai)",
  recraft: "Recraft V4",
  openai: "OpenAI GPT Image",
};

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  const provider = selectProvider();
  const aspect = getAspect();
  const finalPrompt = buildPrompt();

  console.error(`Provider: ${PROVIDER_LABELS[provider]}`);
  if (typeArg) console.error(`Type: ${typeArg}`);
  console.error(`Prompt: ${prompt}`);
  console.error(`Aspect: ${aspect}`);
  console.error(`Quality: ${qualityArg}`);

  const generateFn = PROVIDER_FNS[provider];
  const { imageBuffer, textResponse } = await generateFn(finalPrompt, aspect);

  if (!imageBuffer) {
    console.error("ERROR: No image in response");
    if (textResponse) console.error(`Provider said: ${textResponse}`);
    process.exit(1);
  }

  // Save image
  const timestamp = Date.now();
  const outDir = outputPath ? path.dirname(path.resolve(outputPath)) : path.resolve("generated");
  const outFile = outputPath ? path.resolve(outputPath) : path.join(outDir, `img-${timestamp}.png`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(outFile, imageBuffer);

  // Output results (machine-readable)
  console.log(`IMAGE:${outFile}`);
  if (textResponse) console.log(`TEXT:${textResponse}`);

  console.error(`\nImage saved to: ${outFile}`);
  console.error(`Size: ${(imageBuffer.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("ERROR:", err.message || err);
  process.exit(1);
});
