# Rewrites the cursor block in app/globals.css with the modern HiDPI set:
# SVG data-URI first (crisp at any DPR, declared 24px), 24px PNG fallback,
# then the CSS keyword. Run gen_modern.py first (and the raster step for PNGs).
import re, os

HERE = os.path.dirname(os.path.abspath(__file__))
CSS = os.path.abspath(os.path.join(HERE, "..", "..", "app", "globals.css"))

svgs, pngs = {}, {}
for line in open(f"{HERE}/uris_modern.txt"):
    name, hx, hy, uri = line.strip().split(" ", 3)
    svgs[name] = (hx, hy, uri)
for line in open(f"{HERE}/pngs_modern.txt"):
    name, uri = line.strip().split(" ", 1)
    pngs[name] = uri

RULES = [
    (".no-cursor,\n.no-cursor *", "arrow", "default"),
    (".no-cursor a,\n.no-cursor a *,\n.no-cursor button:not([disabled]),\n.no-cursor button:not([disabled]) *,\n.no-cursor [data-cursor],\n.no-cursor [data-cursor] *", "pointer", "pointer"),
    (".no-cursor input,\n.no-cursor textarea,\n.no-cursor [contenteditable=\"true\"]", "text", "text"),
    (".no-cursor .prose p,\n.no-cursor .prose li,\n.no-cursor .prose h2,\n.no-cursor .prose h3", "thintext", "text"),
    (".no-cursor [title]", "help", "help"),
    (".no-cursor [disabled],\n.no-cursor [disabled] *,\n.no-cursor [aria-disabled=\"true\"]", "unavailable", "not-allowed"),
    (".no-cursor a[href^=\"mailto\"],\n.no-cursor a[href^=\"mailto\"] *", "pen", "pointer"),
    (".no-cursor [data-cursor-move],\n.no-cursor [data-cursor-move] *", "move", "move"),
    (".no-cursor [data-cursor-precision],\n.no-cursor [data-cursor-precision] *", "precision", "crosshair"),
    (".no-cursor [data-cursor-alt],\n.no-cursor [data-cursor-alt] *", "alt", "pointer"),
    (".no-cursor [data-cursor-aseprite]", "picker", "default"),
    (".no-cursor .cursor-ew", "ew", "ew-resize"),
    (".no-cursor .cursor-ns", "ns", "ns-resize"),
    (".no-cursor .cursor-nwse", "nwse", "nwse-resize"),
    (".no-cursor .cursor-nesw", "nesw", "nesw-resize"),
    (".no-cursor.is-loading,\n.no-cursor.is-loading *", "busy", "progress"),
]

header = (
    "/* modern cursor set — original HiDPI vector art drawn in-house\n"
    "   (SVG renders at device DPR; 24px = standard system cursor size;\n"
    "   PNG fallback, then keyword — no third-party assets) */"
)
parts = [header]
for sel, name, fb in RULES:
    hx, hy, svg = svgs[name]
    png = pngs[name]
    parts.append(
        f"{sel} {{\n"
        f'  cursor: url("{svg}") {hx} {hy}, url("{png}") {hx} {hy}, {fb} !important;\n'
        f"}}"
    )
block = "\n\n".join(parts) + "\n"

css = open(CSS).read()
start = css.index("/* retro cursor set") if "/* retro cursor set" in css else css.index("/* modern cursor set")
end = css.index("/* film grain overlay */")
css = css[:start] + block + "\n" + css[end:]
open(CSS, "w").write(css)

blobs = set(re.findall(r"data:image/(?:png|svg\+xml);base64,[A-Za-z0-9+/=]+", css))
mine = {u for _, _, u in svgs.values()} | set(pngs.values())
d = 0
for l in css.split("\n"):
    d += l.count("{") - l.count("}")
print("uris:", len(blobs), "| all ours:", blobs <= mine, "| brace balance:", d)
