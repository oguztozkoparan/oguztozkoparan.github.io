import re, os

HERE = os.path.dirname(os.path.abspath(__file__))
CSS = os.path.abspath(os.path.join(HERE, "..", "..", "app", "globals.css"))

uris = {}
for line in open(f"{HERE}/uris.txt"):
    name, hx, hy, uri = line.strip().split(" ", 3)
    uris[name] = (hx, hy, uri)

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
    "/* retro cursor set — original pixel art drawn in-house for this site\n"
    "   (no third-party assets; black body, white outline, violet accents) */"
)
parts = [header]
for sel, name, fb in RULES:
    hx, hy, uri = uris[name]
    parts.append(f'{sel} {{\n  cursor: url("{uri}") {hx} {hy}, {fb} !important;\n}}')
block = "\n\n".join(parts) + "\n"

css = open(CSS).read()
start = css.index("/* retro cursor set")
end = css.index("/* film grain overlay */")
new = css[:start] + block + "\n" + css[start:end][-0:] + css[end:]
open(CSS, "w").write(new)

# sanity: every data URI in the file is one of ours now
blobs = set(re.findall(r"data:image/png;base64,[A-Za-z0-9+/=]+", open(CSS).read()))
mine = {u for _, _, u in uris.values()}
print("uris in css:", len(blobs), "| all ours:", blobs <= mine, "| used:", len(blobs & mine))
