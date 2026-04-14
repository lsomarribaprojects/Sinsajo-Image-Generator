# Diagram Generator

Generate **Excalidraw diagrams** as JSON and render them to **PNG** images. Architecture diagrams, flowcharts, process maps, system diagrams — all from code.

## How It Works

1. Create an Excalidraw-compatible `.excalidraw` JSON file
2. Run the renderer to convert it to a high-resolution PNG

## Quick Start

```bash
cd diagram-generator

# Install dependencies (Python 3.11+)
pip install playwright
playwright install chromium

# Or with uv (faster):
uv sync && uv run playwright install chromium

# Render a diagram
python render_excalidraw.py my-diagram.excalidraw --output diagram.png
```

## Usage

```bash
python render_excalidraw.py <input.excalidraw> [OPTIONS]
```

| Flag | Default | Description |
|------|---------|-------------|
| `--output`, `-o` | Same name as input with `.png` | Output PNG path |
| `--scale`, `-s` | `2` | Device scale factor (2 = retina) |
| `--width`, `-w` | `1920` | Max viewport width in pixels |

## Creating Diagrams

### JSON Structure

Every `.excalidraw` file needs this wrapper:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "sinsajo",
  "elements": [ ... ],
  "appState": {
    "viewBackgroundColor": "#ffffff",
    "gridSize": null
  },
  "files": {}
}
```

### Element Types

| Type | Use For |
|------|---------|
| `rectangle` | Processes, actions, components |
| `ellipse` | Entry/exit points, external systems |
| `diamond` | Decisions, conditionals |
| `arrow` | Connections between shapes |
| `text` | Labels inside shapes |
| `line` | Non-arrow connections |

### Color Palette

| Purpose | Stroke | Fill |
|---------|--------|------|
| Primary | `#1971c2` | `#a5d8ff` |
| Secondary | `#2f9e44` | `#b2f2bb` |
| Warning | `#e8590c` | `#ffc078` |
| Neutral | `#868e96` | `#dee2e6` |

### Layout Tips

- Start at (100, 100)
- 200px horizontal spacing between elements
- 150px vertical spacing between rows
- Standard element: 180x90px rectangles

See `references/json-schema.md` and `references/element-templates.md` for the complete schema and copy-paste templates.
