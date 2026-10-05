# Skinnie campaign art report

Generated with the built-in image generation tool on 2026-10-05. Eight PNGs saved and read back; copied bytes match generated sources. No application code or other repository files edited.

| File | Pixel size | Transparent background |
|---|---|---|
| `public/skinnie/skinnie-wave.png` | 1122 × 1402 | Yes — RGBA, alpha 0–255 |
| `public/skinnie/skinnie-puzzled.png` | 1122 × 1402 | Yes — RGBA, alpha 0–255 |
| `public/skinnie/skinnie-cheer.png` | 1122 × 1402 | Yes — RGBA, alpha 0–255 |
| `public/skinnie/skinnie-flower.png` | 1122 × 1402 | Yes — RGBA, alpha 0–255 |
| `public/skinnie/skinnie-halloween.png` | 1122 × 1402 | Yes — RGBA, alpha 0–255 |
| `public/skinnie/skinnie-point.png` | 1122 × 1402 | Yes — RGBA, alpha 0–255 |
| `public/images/scene-phone-window.png` | 1448 × 1086 | No — opaque RGB |
| `public/images/scene-notebook-calendar.png` | 1448 × 1086 | No — opaque RGB |

Visual checks: all six mascots retain the teal chest flame, white glossy floating body, teal hair, silver trim and teal eyes. Wave, puzzled and cheer were regenerated after the chest-mark correction. Puzzled was reframed to include the hair tip. Point gestures toward viewer’s left. Calendar has 2 rows × 7 cells, with four teal ticks. No visible text or brand logos; scene photos have no people or faces.

Limitations: the generator did not honor exact pixel dimensions. Mascots are 1122 × 1402, close to the requested portrait size. Both scenes are 1448 × 1086 (4:3), **not the requested 1600 × 1200**. Original generated pixels and mascot alpha were preserved. Character identity was visually checked; poses are generated variants, not an identical reusable 3D model. Phone scene includes additional desk accessories.

Prompt set: each mascot used `design/skinnie-reference.png` as identity reference, full-body glossy 3D rendering, transparent PNG, mandatory teal chest flame, no text/letters/brand logos; respective poses were wave with magnifier, puzzled scratching head and looking at magnifier, cheer with raised arms and blank card, single pink flower, dark witch hat with magnifier, and floating left-point with magnifier. Scene prompts specified realistic soft photography, cream #F6F6F0 / deep teal #205860 / yellow #FFE45C, no people/faces/text, phone on stand beside morning window and notebook, and top-down notebook with 14-cell grid and yellow highlighter.

Unresolved: exact 1600 × 1200 scene dimensions remain unmet.
