# Image Generator

Generate and edit images from the command line using **6 AI providers** with smart routing for sales and marketing image types.

## Quick Start

```bash
cd image-generator

# Basic generation (uses Gemini by default)
npx tsx generate-image.ts --prompt "A futuristic city at sunset"

# Smart routing: auto-picks the best provider for the job
npx tsx generate-image.ts --type ad-creative --prompt "50% OFF Summer Sale"

# Force a specific provider
npx tsx generate-image.ts --provider ideogram --prompt "Bold headline text on banner"
```

## API Keys

You need **at least one** key (set in `.env` at the repo root or as environment variable).
Add more keys to unlock smart routing and fallback chains.

| Provider | Key | Free Tier | Best For | Get it at |
|----------|-----|-----------|----------|-----------|
| **Gemini** | `GEMINI_API_KEY` | Yes | General purpose, editing | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **OpenRouter** | `OPENROUTER_API_KEY` | Limited | Multi-model gateway | [openrouter.ai/keys](https://openrouter.ai/keys) |
| **Ideogram** | `IDEOGRAM_API_KEY` | No | Text in images, ads, banners | [ideogram.ai/manage-api](https://ideogram.ai/manage-api) |
| **fal.ai / Flux** | `FAL_API_KEY` | No | Photorealism, lifestyle | [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys) |
| **Recraft** | `RECRAFT_API_KEY` | No | Design, logos, mockups | [recraft.ai/docs](https://www.recraft.ai/docs) |
| **OpenAI** | `OPENAI_API_KEY` | No | All-rounder, infographics | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

## CLI Flags

```bash
npx tsx generate-image.ts --prompt "DESCRIPTION" [OPTIONS]
```

| Flag | Required | Description |
|------|----------|-------------|
| `--prompt` | Yes | What to generate or how to edit |
| `--type` | No | Sales image type — auto-routes to best provider (see table below) |
| `--provider` | No | Force a specific provider: `gemini`, `openrouter`, `ideogram`, `flux`, `recraft`, `openai` |
| `--image` | No | Input image path (for editing existing images — Gemini/OpenRouter only) |
| `--output` | No | Output path (default: `generated/img-{timestamp}.png`) |
| `--aspect` | No | Aspect ratio: `1:1`, `16:9`, `9:16`, `4:3`, `3:2` (default: `1:1`) |
| `--model` | No | Model ID override (provider-specific) |
| `--quality` | No | Quality level: `low`, `medium`, `high` (OpenAI/Ideogram) |

## Smart Routing: `--type`

When you use `--type`, the tool automatically picks the best provider for that image type and prepends an optimized prompt prefix.

| Type | Best Provider | Fallbacks | Default Aspect | Use Case |
|------|--------------|-----------|----------------|----------|
| `ad-creative` | Ideogram | OpenAI → Gemini | 16:9 | Banner ads, marketing creatives with text |
| `product-mockup` | Recraft | Flux → OpenAI | 1:1 | Product on clean background |
| `social-post` | OpenAI | Gemini → OpenRouter | 1:1 | Instagram, Facebook, LinkedIn posts |
| `thumbnail` | Ideogram | OpenAI → Gemini | 16:9 | YouTube thumbnails with bold text |
| `logo` | Recraft | Ideogram → Gemini | 1:1 | Brand logos, minimal icons |
| `lifestyle` | Flux | OpenAI → Gemini | 16:9 | Photorealistic product photography |
| `infographic` | OpenAI | Ideogram → Gemini | 16:9 | Data visualization, reports |
| `email-header` | Gemini | OpenAI → OpenRouter | 3:2 | Email banner headers |
| `story-cover` | Ideogram | OpenAI → Gemini | 9:16 | Vertical stories, reels covers |
| `testimonial` | Ideogram | OpenAI → Recraft | 1:1 | Quote cards, review graphics |

**Fallback logic:** If the primary provider's API key isn't configured, it automatically tries the next available provider in the chain.

## Provider Selection Priority

```
1. --provider flag  → Use that provider (error if no API key)
2. --type flag      → Smart route: primary → fallback1 → fallback2
3. Neither          → Gemini → OpenRouter (backward compatible)
```

## Examples

```bash
# ─── Basic Generation ───────────────────────────────────────────

# Simple text-to-image
npx tsx generate-image.ts --prompt "Minimalist logo with letter S in cyan"

# Edit an existing image
npx tsx generate-image.ts --prompt "Remove the background" --image ./photo.png

# ─── Sales & Marketing (Smart Routing) ──────────────────────────

# Ad creative with bold text (→ Ideogram)
npx tsx generate-image.ts --type ad-creative --prompt "50% OFF Summer Sale — Limited Time"

# Product mockup (→ Recraft)
npx tsx generate-image.ts --type product-mockup --prompt "White sneakers floating on gradient"

# YouTube thumbnail (→ Ideogram)
npx tsx generate-image.ts --type thumbnail --prompt "5 AI Tools That Changed My Business"

# Social media post (→ OpenAI)
npx tsx generate-image.ts --type social-post --prompt "Monday motivation, clean aesthetic"

# Logo design (→ Recraft)
npx tsx generate-image.ts --type logo --prompt "Tech startup called NexaFlow"

# Lifestyle photo (→ Flux)
npx tsx generate-image.ts --type lifestyle --prompt "Coffee shop morning, laptop, warm light"

# Infographic (→ OpenAI)
npx tsx generate-image.ts --type infographic --prompt "5 steps to launch a SaaS product"

# Instagram story (→ Ideogram)
npx tsx generate-image.ts --type story-cover --prompt "New Episode — The AI Revolution"

# ─── Force a Provider ───────────────────────────────────────────

# Use OpenAI specifically
npx tsx generate-image.ts --provider openai --prompt "Abstract art" --quality high

# Use Flux for photorealism
npx tsx generate-image.ts --provider flux --prompt "Aerial view of tropical beach"

# Use Recraft for design
npx tsx generate-image.ts --provider recraft --prompt "Business card mockup"
```

## Models by Provider

| Provider | Default Model | Notes |
|----------|--------------|-------|
| Gemini | `gemini-2.5-flash-image` | Supports image editing with `--image` |
| OpenRouter | `google/gemini-2.5-flash-preview-image-generation` | Multi-model gateway |
| Ideogram | Ideogram V3 | Best text rendering |
| Flux | Flux 2 Pro | Via fal.ai, extreme photorealism |
| Recraft | Recraft V4 | OpenAI-compatible API |
| OpenAI | `gpt-image-1` | Quality flag supported |

## Pricing (approximate per image)

| Provider | Cost | Free Tier |
|----------|------|-----------|
| Gemini | ~$0.02 | Yes (generous) |
| OpenRouter | Varies by model | Limited credits |
| Ideogram | ~$0.02-$0.08 | No |
| Flux / fal.ai | ~$0.03-$0.05 | No |
| Recraft | ~$0.04 | No |
| OpenAI | $0.005-$0.19 | No |
