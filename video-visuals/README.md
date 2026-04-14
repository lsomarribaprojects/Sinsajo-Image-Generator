# Video Visuals

Generate **complete visual narrative packages** in 6 different styles for videos, presentations, or educational content. Each style produces a set of thematic images that tell a visual story.

## Visual Themes

| Theme | Background | Style | Best For |
|-------|-----------|-------|----------|
| **sketchnote** | Cream `#F5F0E8` | Hand-drawn doodles, marker strokes | Educational, tutorials, explainers |
| **neon** | Dark purple `#1A0A2E` | Glowing neon borders, circuit lines | Tech, AI, SaaS, innovation |
| **ocean** | Deep blue `#0A1628` | Glass morphism, frosted cards | Products, dashboards, executive |
| **clean** | White `#FFFFFF` | Flat design, rounded cards | Business, LinkedIn, pitch decks |
| **pizarra** | Chalkboard green `#2D4A3E` | Chalk texture, hand-drawn | Courses, tutorials, step-by-step |
| **infografia** | Light gray `#F8F9FA` | Data-driven, structured columns | Reports, statistics, metrics |

## Sketchnote Color Variants

The default **sketchnote** theme supports 5 background variants:

| Variant | Background | Hex | When to use |
|---------|-----------|-----|-------------|
| **crema** (default) | Warm cream | `#F5F0E8` | General educational |
| **sinsajo** | Lavender purple | `#E8D5F5` | Sinsajo Creators branded |
| **blanco** | Pure white | `#FFFFFF` | Clean, printable |
| **azul** | Pastel blue | `#D6E6F2` | Professional, trust |
| **celeste** | Light cyan | `#B8D4E3` | Fresh, modern, tech |

## How to Use

This tool works with the **Image Generator** (located in `../image-generator/`). Each theme has a prompt template you fill in with your content.

### Step 1: Choose your theme

Pick a visual theme from the table above.

### Step 2: Build your prompt using the theme template

**Sketchnote example:**
```
Fondo color crema calido (#F5F0E8). Infografia estilo sketchnote dibujada a mano con marcador grueso. [YOUR DESCRIPTION HERE]. Trazos negros gruesos estilo marcador para contornos. CONTORNOS de colores fuertes: morado (#8B5CF6), naranja (#f69f02). RELLENOS suaves estilo lapiz de color. Muchas etiquetas manuscritas. Hand-lettering grande para titulo. Formato 16:9.
```

**Neon example:**
```
Fondo purpura oscuro profundo (#1A0A2E). Infografia estilo neon futurista. [YOUR DESCRIPTION HERE]. Bloques flotantes con bordes neon brillantes. Colores neon: cyan (#00F5FF), magenta (#FF00FF), amarillo (#FFE500). Efecto glow en todos los elementos. Formato 16:9.
```

**Ocean example:**
```
Fondo azul profundo con gradiente sutil (#0A1628 a #162447). Infografia estilo moderno con glass morphism. [YOUR DESCRIPTION HERE]. Tarjetas flotantes con efecto vidrio esmerilado. Colores: cyan, celeste, blanco. Formato 16:9.
```

**Clean example:**
```
Fondo blanco limpio (#FFFFFF). Infografia estilo flat design moderno. [YOUR DESCRIPTION HERE]. Tarjetas con esquinas redondeadas, sombra suave. Iconos flat. Colores: morado (#8C27F1), azul (#3498DB), naranja (#f69f02). Formato 16:9.
```

**Pizarra example:**
```
Fondo verde oscuro de pizarra (#2D4A3E) con textura de pizarron. Infografia estilo tiza dibujada a mano. [YOUR DESCRIPTION HERE]. Tiza blanca, amarilla, azul claro, rosa. Flechas de tiza. Residuos de tiza borrada. Formato 16:9.
```

**Infografia example:**
```
Fondo blanco con degradado a gris claro (#F8F9FA). Infografia profesional estilo revista de negocios. [YOUR DESCRIPTION HERE]. Layout estructurado con columnas. Iconos circulares con colores solidos. Numeros grandes y bold. Formato 16:9.
```

### Step 3: Generate with Image Generator

```bash
cd ../image-generator
npx tsx generate-image.ts \
  --prompt "YOUR THEMED PROMPT HERE" \
  --output ../output/01-intro.png \
  --aspect 16:9
```

### Step 4: Repeat for each visual in your narrative

A typical video package has 6-12 visuals covering the key moments of the story.

## Image Types That Work Well

| Type | Description |
|------|-------------|
| **Steps/Flow** | 3-5 steps connected with arrows |
| **Before/After** | Side-by-side comparison |
| **List** | 3-6 items with icons |
| **Central diagram** | Core concept surrounded by elements |
| **Comparison** | Two options side by side |
| **Timeline** | Progress or evolution |
| **Data/Metrics** | Highlighted numbers with charts (ideal for `infografia`) |

## Mascot: Levy (AI Agent)

When images need a character, use **Levy** — the Sinsajo AI mascot.

- Asset: `assets/levy.png`
- Pass as `--image` reference to the Image Generator
- Describe as: "robot character with metallic blue-purple head, glowing eyes"

```bash
npx tsx ../image-generator/generate-image.ts \
  --prompt "Sketchnote with Levy robot explaining AI concepts" \
  --image assets/levy.png \
  --output ../output/with-levy.png \
  --aspect 16:9
```
