<p align="center">
  <strong>Sinsajo Image Generator</strong><br>
  <em>AI Visual Toolkit by <a href="https://www.sinsajocreators.com">Sinsajo Creators</a></em>
</p>

<p align="center">
  <a href="https://www.sinsajocreators.com">Website</a> &middot;
  <a href="https://instagram.com/sinsajocreators">Instagram</a> &middot;
  <a href="https://facebook.com/sinsajocreators">Facebook</a> &middot;
  <a href="https://linkedin.com/company/sinsajocreators">LinkedIn</a>
</p>

---

Three AI-powered visual tools in one repo. Pick the one you need.

## Tools

### 1. [Image Generator](image-generator/) — Text to Image & Image Editing

Generate images from text prompts or edit existing images using Gemini API or OpenRouter.

```bash
cd image-generator
npx tsx generate-image.ts --prompt "A futuristic city at sunset"
```

**Use for:** Logos, thumbnails, banners, social media assets, product mockups, photo editing.

| Feature | Details |
|---------|---------|
| Backends | Gemini API (free tier) or OpenRouter |
| Input | Text prompt, optional source image |
| Output | PNG image |
| Aspect ratios | 1:1, 16:9, 9:16, 4:3, 3:2 |

[Read full docs →](image-generator/README.md)

---

### 2. [Diagram Generator](diagram-generator/) — Excalidraw to PNG

Create architecture diagrams, flowcharts, and process maps as Excalidraw JSON, then render to high-resolution PNG.

```bash
cd diagram-generator
python render_excalidraw.py my-diagram.excalidraw --output diagram.png
```

**Use for:** Architecture diagrams, flowcharts, system diagrams, process maps, technical documentation.

| Feature | Details |
|---------|---------|
| Input | `.excalidraw` JSON file |
| Output | PNG (retina 2x by default) |
| Engine | Playwright + Chromium (headless) |
| Templates | Copy-paste element templates included |

[Read full docs →](diagram-generator/README.md)

---

### 3. [Video Visuals](video-visuals/) — Narrative Visual Packages

Generate complete sets of themed visuals for videos, presentations, or educational content. Six distinct visual styles to match any brand or topic.

```bash
cd image-generator
npx tsx generate-image.ts \
  --prompt "Fondo crema (#F5F0E8). Sketchnote hand-drawn: 5 steps to build a SaaS..." \
  --aspect 16:9
```

**Use for:** YouTube video visuals, course materials, presentations, infographics, social media carousels.

| Theme | Style | Best For |
|-------|-------|----------|
| Sketchnote | Hand-drawn doodles on cream/colored backgrounds | Education, tutorials |
| Neon | Glowing elements on dark purple | Tech, AI, innovation |
| Ocean | Glass morphism on deep blue | Products, executive |
| Clean | Flat design on white | Business, LinkedIn |
| Pizarra | Chalk on green chalkboard | Courses, step-by-step |
| Infografia | Data-driven on white/gray | Reports, metrics |

[Read full docs →](video-visuals/README.md)

---

## Quick Setup

```bash
# Clone the repo
git clone https://github.com/lsomarribaprojects/Sinsajo-Image-Generator.git
cd Sinsajo-Image-Generator

# Install Node dependencies (for Image Generator & Video Visuals)
npm install

# Set your API key
cp .env.example .env
# Edit .env → add GEMINI_API_KEY or OPENROUTER_API_KEY

# For Diagram Generator (Python 3.11+):
cd diagram-generator
pip install playwright && playwright install chromium
```

## API Keys

You need **one** of these for the Image Generator and Video Visuals:

| Provider | Free Tier | Get it at |
|----------|-----------|-----------|
| **Gemini** (recommended) | Yes | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **OpenRouter** | Limited | [openrouter.ai/keys](https://openrouter.ai/keys) |

The Diagram Generator uses no API — it renders locally with Playwright.

---

## Use as Claude Code Skills

Drop any tool into a project's `.claude/skills/` directory:

```bash
# Image Generator
mkdir -p .claude/skills/image-generation/scripts
cp image-generator/generate-image.ts .claude/skills/image-generation/scripts/

# Diagram Generator
mkdir -p .claude/skills/excalidraw-diagram/references
cp diagram-generator/render_excalidraw.py .claude/skills/excalidraw-diagram/references/
cp diagram-generator/references/* .claude/skills/excalidraw-diagram/references/

# Video Visuals (prompt templates — works with Image Generator)
mkdir -p .claude/skills/video-visuals/assets
cp video-visuals/README.md .claude/skills/video-visuals/SKILL.md
cp video-visuals/assets/* .claude/skills/video-visuals/assets/
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
