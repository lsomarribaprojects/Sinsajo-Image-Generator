#!/usr/bin/env npx tsx
/**
 * Sinsajo Image Generator
 * Generate and edit images using Gemini API (direct) or OpenRouter.
 *
 * Usage: npx tsx generate-image.ts --prompt "description" [--image input.png] [--output output.png] [--aspect 16:9] [--model model-id]
 *
 * Supports two backends:
 * 1. Gemini API (preferred) — set GEMINI_API_KEY
 * 2. OpenRouter (fallback) — set OPENROUTER_API_KEY
 */

import fs from "fs";
import path from "path";

// Parse CLI args
const args = process.argv.slice(2);
function getArg(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
}

const prompt = getArg("prompt");
const inputImage = getArg("image");
const outputPath = getArg("output");
const aspect = getArg("aspect") || "1:1";
const modelArg = getArg("model");

if (!prompt) {
  console.error("Sinsajo Image Generator");
  console.error("=======================\n");
  console.error("Usage: npx tsx generate-image.ts --prompt 'description'\n");
  console.error("Options:");
  console.error("  --prompt    Text description (REQUIRED)");
  console.error("  --image     Input image path (for editing)");
  console.error("  --output    Output path (default: generated/img-{ts}.png)");
  console.error("  --aspect    Aspect ratio: 1:1, 16:9, 9:16, 4:3, 3:2 (default: 1:1)");
  console.error("  --model     Model ID override\n");
  console.error("Examples:");
  console.error('  npx tsx generate-image.ts --prompt "A futuristic city at sunset"');
  console.error('  npx tsx generate-image.ts --prompt "Remove background" --image photo.png');
  console.error('  npx tsx generate-image.ts --prompt "YouTube thumbnail" --aspect 16:9');
  process.exit(1);
}

// Load API keys from .env or environment variables
function loadEnvKeys(): { geminiKey?: string; openrouterKey?: string } {
  const envPaths = [".env.local", ".env"];
  let geminiKey: string | undefined;
  let openrouterKey: string | undefined;

  for (const envPath of envPaths) {
    const fullPath = path.resolve(process.cwd(), envPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const geminiMatch = content.match(/GEMINI_API_KEY=(.+)/);
      if (geminiMatch && !geminiKey) geminiKey = geminiMatch[1].trim();
      const openrouterMatch = content.match(/OPENROUTER_API_KEY=(.+)/);
      if (openrouterMatch && !openrouterKey) openrouterKey = openrouterMatch[1].trim();
    }
  }

  // Also check environment variables
  if (!geminiKey && process.env.GEMINI_API_KEY) geminiKey = process.env.GEMINI_API_KEY;
  if (!openrouterKey && process.env.OPENROUTER_API_KEY)
    openrouterKey = process.env.OPENROUTER_API_KEY;

  return { geminiKey, openrouterKey };
}

const { geminiKey, openrouterKey } = loadEnvKeys();

if (!geminiKey && !openrouterKey) {
  console.error("ERROR: No API key found.\n");
  console.error("Set one of these in .env or as environment variable:");
  console.error("  GEMINI_API_KEY=your_key      (preferred, free at https://aistudio.google.com/apikey)");
  console.error("  OPENROUTER_API_KEY=your_key   (alternative)");
  process.exit(1);
}

const backend = geminiKey ? "gemini" : "openrouter";
console.error(`Backend: ${backend === "gemini" ? "Gemini API (direct)" : "OpenRouter"}`);

// ─── Gemini API Direct ───────────────────────────────────────────────

async function generateWithGemini() {
  const model = modelArg || "gemini-2.5-flash-image";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

  // Build request parts
  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

  // Add input image if provided
  if (inputImage) {
    const imgPath = path.resolve(inputImage);
    if (!fs.existsSync(imgPath)) {
      console.error(`ERROR: Input image not found: ${imgPath}`);
      process.exit(1);
    }
    const imgBuffer = fs.readFileSync(imgPath);
    const base64 = imgBuffer.toString("base64");
    const ext = path.extname(imgPath).slice(1).toLowerCase();
    const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
    parts.push({ inlineData: { mimeType: mime, data: base64 } });
  }

  // Add text prompt with aspect ratio hint
  const fullPrompt = `${prompt}\n\nGenerate the image in ${aspect} format. Return ONLY the image.`;
  parts.push({ text: fullPrompt });

  console.error(`Model: ${model}`);
  console.error(`Prompt: ${prompt}`);
  console.error(`Aspect: ${aspect}`);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ERROR: Gemini API returned ${response.status}`);
    console.error(errorText);
    process.exit(1);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
          inlineData?: { mimeType: string; data: string };
        }>;
      };
    }>;
  };

  // Extract image from response
  let imageBase64: string | null = null;
  let textResponse: string | null = null;

  const candidate = data.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData?.data) {
        imageBase64 = part.inlineData.data;
      } else if (part.text) {
        textResponse = part.text;
      }
    }
  }

  return { imageBase64, textResponse, data };
}

// ─── OpenRouter API ──────────────────────────────────────────────────

async function generateWithOpenRouter() {
  const model = modelArg || "google/gemini-2.5-flash-preview-image-generation";

  const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

  // Add input image if provided
  if (inputImage) {
    const imgPath = path.resolve(inputImage);
    if (!fs.existsSync(imgPath)) {
      console.error(`ERROR: Input image not found: ${imgPath}`);
      process.exit(1);
    }
    const imgBuffer = fs.readFileSync(imgPath);
    const base64 = imgBuffer.toString("base64");
    const ext = path.extname(imgPath).slice(1).toLowerCase();
    const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
    content.push({
      type: "image_url",
      image_url: { url: `data:${mime};base64,${base64}` },
    });
  }

  // Add text prompt
  const fullPrompt = `${prompt}\n\nGenerate the image with aspect ratio: ${aspect}. Return ONLY the image, no text.`;
  content.push({ type: "text", text: fullPrompt });

  console.error(`Model: ${model}`);
  console.error(`Prompt: ${prompt}`);
  console.error(`Aspect: ${aspect}`);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openrouterKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ERROR: OpenRouter API returned ${response.status}`);
    console.error(errorText);
    process.exit(1);
  }

  const data = (await response.json()) as {
    choices: Array<{
      message: {
        content:
          | Array<{ type: string; text?: string; image_url?: { url: string } }>
          | string;
      };
    }>;
  };

  // Extract image from response
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

  return { imageBase64, textResponse, data };
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  const { imageBase64, textResponse, data } =
    backend === "gemini" ? await generateWithGemini() : await generateWithOpenRouter();

  if (!imageBase64) {
    console.error("ERROR: No image in response");
    if (textResponse) console.error(`Model said: ${textResponse}`);
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  // Save image
  const timestamp = Date.now();
  const outDir = outputPath ? path.dirname(path.resolve(outputPath)) : path.resolve("generated");
  const outFile = outputPath ? path.resolve(outputPath) : path.join(outDir, `img-${timestamp}.png`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const buffer = Buffer.from(imageBase64, "base64");
  fs.writeFileSync(outFile, buffer);

  // Output results (machine-readable)
  console.log(`IMAGE:${outFile}`);
  if (textResponse) console.log(`TEXT:${textResponse}`);

  console.error(`\nImage saved to: ${outFile}`);
  console.error(`Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("ERROR:", err.message || err);
  process.exit(1);
});
