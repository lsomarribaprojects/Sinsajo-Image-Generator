# Sinsajo Image Generator

Generate and edit images from the command line using **Gemini API** or **OpenRouter**.

Text-to-image, image editing, aspect ratio control — one script, zero dependencies beyond `tsx`.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/lsomarribaprojects/Sinsajo-Image-Generator.git
cd Sinsajo-Image-Generator

# 2. Install
npm install

# 3. Set your API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY or OPENROUTER_API_KEY

# 4. Generate
npx tsx generate-image.ts --prompt "A futuristic city at sunset"
```

## API Keys

You need **one** of these:

| Provider | Key | Free Tier | Get it at |
|----------|-----|-----------|-----------|
| **Gemini** (preferred) | `GEMINI_API_KEY` | Yes | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **OpenRouter** | `OPENROUTER_API_KEY` | Limited | [openrouter.ai/keys](https://openrouter.ai/keys) |

Set the key in `.env` or as an environment variable:

```bash
export GEMINI_API_KEY=your_key_here
```

---

## Usage

```bash
npx tsx generate-image.ts --prompt "DESCRIPTION" [OPTIONS]
```

### Options

| Flag | Required | Description |
|------|----------|-------------|
| `--prompt` | Yes | What to generate or how to edit |
| `--image` | No | Input image path (for editing existing images) |
| `--output` | No | Output path (default: `generated/img-{timestamp}.png`) |
| `--aspect` | No | Aspect ratio: `1:1`, `16:9`, `9:16`, `4:3`, `3:2` (default: `1:1`) |
| `--model` | No | Model ID override |

### Models

| Model | Backend | Best for |
|-------|---------|----------|
| `gemini-2.5-flash-image` | Gemini | Fast, good quality (default) |
| `google/gemini-2.5-flash-preview-image-generation` | OpenRouter | Fast via OpenRouter |
| `google/gemini-2.5-pro-preview-image-generation` | OpenRouter | Higher quality, more detail |

---

## Examples

### Text to Image

```bash
npx tsx generate-image.ts --prompt "A minimalist logo with the letter S in cyan on dark background"
```

### Edit an Existing Image

```bash
npx tsx generate-image.ts \
  --prompt "Remove the background and make it transparent" \
  --image ./photo.png
```

### YouTube Thumbnail (16:9)

```bash
npx tsx generate-image.ts \
  --prompt "Futuristic dashboard UI with charts and graphs, bold text 'LAUNCH DAY'" \
  --aspect 16:9 \
  --output ./thumbnail.png
```

### Instagram Story (9:16)

```bash
npx tsx generate-image.ts \
  --prompt "Gradient background with motivational quote in white serif font" \
  --aspect 9:16
```

### Pro Quality

```bash
npx tsx generate-image.ts \
  --prompt "Detailed architectural blueprint of a modern building" \
  --model google/gemini-2.5-pro-preview-image-generation
```

---

## Output

Images are saved to `generated/` by default. The script outputs machine-readable lines:

```
IMAGE:/absolute/path/to/generated/img-1234567890.png
TEXT:Optional text response from the model
```

---

## Use as Claude Code Skill

Drop this into any project's `.claude/skills/` directory to use it as a Claude Code skill:

```bash
mkdir -p .claude/skills/image-generation/scripts
cp generate-image.ts .claude/skills/image-generation/scripts/
```

---

## License

MIT - Built by [Sinsajo Creators](https://github.com/lsomarribaprojects)
