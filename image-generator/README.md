# Image Generator

Generate and edit images from the command line using **Gemini API** or **OpenRouter**.

## Quick Start

```bash
cd image-generator
npx tsx generate-image.ts --prompt "A futuristic city at sunset"
```

## API Keys

You need **one** of these (set in `.env` at the repo root or as environment variable):

| Provider | Key | Free Tier | Get it at |
|----------|-----|-----------|-----------|
| **Gemini** (preferred) | `GEMINI_API_KEY` | Yes | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **OpenRouter** | `OPENROUTER_API_KEY` | Limited | [openrouter.ai/keys](https://openrouter.ai/keys) |

## Usage

```bash
npx tsx generate-image.ts --prompt "DESCRIPTION" [OPTIONS]
```

| Flag | Required | Description |
|------|----------|-------------|
| `--prompt` | Yes | What to generate or how to edit |
| `--image` | No | Input image path (for editing existing images) |
| `--output` | No | Output path (default: `generated/img-{timestamp}.png`) |
| `--aspect` | No | Aspect ratio: `1:1`, `16:9`, `9:16`, `4:3`, `3:2` (default: `1:1`) |
| `--model` | No | Model ID override |

## Models

| Model | Backend | Best for |
|-------|---------|----------|
| `gemini-2.5-flash-image` | Gemini | Fast, good quality (default) |
| `google/gemini-2.5-flash-preview-image-generation` | OpenRouter | Fast via OpenRouter |
| `google/gemini-2.5-pro-preview-image-generation` | OpenRouter | Higher quality, more detail |

## Examples

```bash
# Text to image
npx tsx generate-image.ts --prompt "A minimalist logo with the letter S in cyan on dark background"

# Edit an existing image
npx tsx generate-image.ts --prompt "Remove the background" --image ./photo.png

# YouTube thumbnail (16:9)
npx tsx generate-image.ts --prompt "Bold text LAUNCH DAY on futuristic UI" --aspect 16:9

# Instagram story (9:16)
npx tsx generate-image.ts --prompt "Gradient with motivational quote" --aspect 9:16

# Pro quality
npx tsx generate-image.ts --prompt "Detailed blueprint" --model google/gemini-2.5-pro-preview-image-generation
```
