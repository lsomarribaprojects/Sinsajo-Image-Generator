<p align="center">
  <strong>Sinsajo Image Generator</strong><br>
  <em>by <a href="https://www.sinsajocreators.com">Sinsajo Creators</a></em>
</p>

<p align="center">
  <a href="https://www.sinsajocreators.com">Website</a> &middot;
  <a href="https://instagram.com/sinsajocreators">Instagram</a> &middot;
  <a href="https://facebook.com/sinsajocreators">Facebook</a> &middot;
  <a href="https://linkedin.com/company/sinsajocreators">LinkedIn</a>
</p>

---

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

## About Sinsajo Creators

**[Sinsajo Creators](https://www.sinsajocreators.com)** is an AI-powered digital marketing agency that transforms content creators into profitable brands through strategic communication, AI automation, and innovative digital solutions.

**#WeMakeYourBrandFly**

### What We Do

- **AI Marketing Automation** — Chatbots, AI agents, and intelligent workflows
- **Content Creation** — Editorial design, branding, and visual assets
- **Web Development** — Custom apps, SaaS platforms, and landing pages
- **Social Media Management** — Strategy, content, and community growth
- **CRM & WhatsApp Automation** — Omnichannel engagement at scale

### Where We Are

USA (Des Moines, IA & Clearwater, FL) serving clients across the US, Mexico, Colombia, and Latin America. Fully bilingual (English & Spanish).

### Get in Touch

| Channel | Contact |
|---------|---------|
| Web | [www.sinsajocreators.com](https://www.sinsajocreators.com) |
| Email | [sales@sinsajocreators.com](mailto:sales@sinsajocreators.com) |
| WhatsApp | [+1 (609) 288-5466](https://wa.me/16092885466) |
| Instagram | [@sinsajocreators](https://instagram.com/sinsajocreators) |
| Facebook | [@sinsajocreators](https://facebook.com/sinsajocreators) |
| LinkedIn | [@sinsajocreators](https://linkedin.com/company/sinsajocreators) |

---

## License

MIT - Built with AI by [Sinsajo Creators](https://www.sinsajocreators.com)
