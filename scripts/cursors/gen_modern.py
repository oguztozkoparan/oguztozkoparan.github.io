# Modern HiDPI cursor set for oguztozkoparan.com — original vector art.
# SVG data-URI cursors render crisp at any devicePixelRatio; each SVG declares
# width/height 24 so the on-screen size matches a standard system cursor.
# Emits: per-cursor .svg files, uris_modern.txt (name hotspotX hotspotY dataURI)
# and sheet.html (1x + 4x preview grid with hotspot markers).
import base64, os

INK = "#f7f7f8"     # white outline
BODY = "#0b0c0e"    # near-black fill
ACID = "#a78bfa"    # violet accent
S = 24              # canvas / declared size

OUT = os.path.dirname(os.path.abspath(__file__))

def svg(inner, size=S):
    # soft modern drop shadow applied to every cursor; filter region padded
    # so the blur never clips at the 24px canvas edge
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 {size} {size}">'
        '<defs><filter id="ds" x="-40%" y="-40%" width="180%" height="180%">'
        '<feDropShadow dx="0.4" dy="1.1" stdDeviation="0.9" flood-color="#000" flood-opacity="0.55"/>'
        "</filter></defs>"
        f'<g filter="url(#ds)">{inner}</g></svg>'
    )

# double-stroke helper: white halo under a dark line
def duo(d, w=2.0, halo=1.6, color=BODY, cap="round"):
    return (
        f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{w + halo}" '
        f'stroke-linecap="{cap}" stroke-linejoin="round"/>'
        f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" '
        f'stroke-linecap="{cap}" stroke-linejoin="round"/>'
    )

ARROW_D = "M4.5 2.5 L4.5 18.5 L8.6 14.9 L11.2 20.6 L13.9 19.4 L11.3 13.8 L16.9 13.4 Z"

C = {}  # name -> (hotspot, svg)

C["arrow"] = ((3, 2), svg(
    f'<path d="{ARROW_D}" fill="{BODY}" stroke="{INK}" stroke-width="1.5" stroke-linejoin="round"/>'
))

C["alt"] = ((3, 2), svg(
    f'<path d="{ARROW_D}" fill="{ACID}" stroke="{INK}" stroke-width="1.5" stroke-linejoin="round"/>'
))

PT_FINGERS = (
    "M9.8 5 L9.8 12 "         # extended index finger
    "M12.7 10.8 L12.7 13.6 "  # folded middle
    "M15.1 11.4 L15.1 14 "    # folded ring
    "M17.2 12 L17.1 14.4 "    # folded pinky
    "M6.4 14.4 L9 16.6"       # thumb
)
PT_PALM = '<ellipse cx="12.4" cy="15.8" rx="4.7" ry="3.8"'

C["pointer"] = ((10, 3), svg(
    # same construction as the move hand (capsule fingers + palm union),
    # with the index finger extended to point
    f'<path d="{PT_FINGERS}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
    f"{PT_PALM} fill=\"{INK}\" stroke=\"{INK}\" stroke-width=\"2.6\"/>"
    f'<path d="{PT_FINGERS}" fill="none" stroke="{BODY}" stroke-width="2.4" stroke-linecap="round"/>'
    f"{PT_PALM} fill=\"{BODY}\"/>"
))

C["text"] = ((12, 12), svg(
    duo("M9.4 3.6 h5.2 M12 3.6 V20.4 M9.4 20.4 h5.2", w=1.9)
))

C["thintext"] = ((12, 12), svg(
    duo("M10 5 h4 M12 5 V19 M10 19 h4", w=1.4, halo=1.4)
))

C["help"] = ((3, 2), svg(
    f'<path d="{ARROW_D}" fill="{BODY}" stroke="{INK}" stroke-width="1.5" stroke-linejoin="round"/>'
    + duo("M15.4 4.6 a2.9 2.9 0 0 1 5.3 1.6 c0 2 -2.6 2.2 -2.6 4.2", w=1.8, color=ACID)
    + f'<circle cx="18.1" cy="13.4" r="1.25" fill="{ACID}" stroke="{INK}" stroke-width="0.9"/>'
))

C["unavailable"] = ((12, 12), svg(
    f'<circle cx="12" cy="12" r="8" fill="none" stroke="{INK}" stroke-width="5"/>'
    f'<circle cx="12" cy="12" r="8" fill="none" stroke="{BODY}" stroke-width="2.6"/>'
    f'<path d="M6.6 17.4 L17.4 6.6" stroke="{INK}" stroke-width="4.4" stroke-linecap="round"/>'
    f'<path d="M6.6 17.4 L17.4 6.6" stroke="{BODY}" stroke-width="2.2" stroke-linecap="round"/>'
))

C["pen"] = ((3, 21), svg(
    '<path d="M16.2 3.4 a2.3 2.3 0 0 1 3.6 0 l0.8 0.8 a2.3 2.3 0 0 1 0 3.6 L9.4 19 L4 20 L5 14.6 Z" '
    f'fill="{BODY}" stroke="{INK}" stroke-width="1.4" stroke-linejoin="round"/>'
    f'<path d="M5 14.6 L9.4 19 L4 20 Z" fill="{ACID}" stroke="{INK}" stroke-width="1.1" stroke-linejoin="round"/>'
))

C["picker"] = ((3, 21), svg(
    f'<circle cx="17.5" cy="6.5" r="3.6" fill="{BODY}" stroke="{INK}" stroke-width="1.4"/>'
    '<path d="M14.9 9.1 L6 18 c-0.9 0.9 -1.4 1.3 -2 2 L4 20 l0 0 c0.7 -0.6 1.1 -1.1 2 -2" '
    f'fill="none" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
    f'<path d="M14.9 9.1 L5 19" fill="none" stroke="{BODY}" stroke-width="2" stroke-linecap="round"/>'
    f'<circle cx="4.6" cy="19.4" r="1.6" fill="{ACID}" stroke="{INK}" stroke-width="1"/>'
))

def _head(angle):
    # arrowhead triangle pointing right at (21,12), rotated around center
    return (
        f'<g transform="rotate({angle} 12 12)">'
        f'<path d="M17 8.6 L21.4 12 L17 15.4 Z" fill="{BODY}" stroke="{INK}" stroke-width="1.3" stroke-linejoin="round"/>'
        "</g>"
    )

def _stem(angle, l1=6.4, l2=17.6):
    return (
        f'<g transform="rotate({angle} 12 12)">'
        f'<path d="M{l1} 12 H{l2}" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
        f'<path d="M{l1} 12 H{l2}" stroke="{BODY}" stroke-width="2" stroke-linecap="round"/>'
        "</g>"
    )

C["ew"] = ((12, 12), svg(_stem(0) + _head(0) + _head(180)))
C["ns"] = ((12, 12), svg(_stem(90) + _head(90) + _head(270)))
C["nwse"] = ((12, 12), svg(_stem(45) + _head(45) + _head(225)))
C["nesw"] = ((12, 12), svg(_stem(135) + _head(135) + _head(315)))

FINGERS = "M16.6 8.2 L15.9 12.4 M14.7 6 L14.2 12 M12 5.2 L12 11.8 M9.4 6 L9.8 12 M5.2 13.2 L8.4 15.2"
PALM = '<ellipse cx="11.6" cy="13.8" rx="4.5" ry="3.9"'

C["move"] = ((11, 11), svg(
    # open drag hand: spread fingers + thumb + palm, unioned via a white
    # halo pass under a body pass (internal strokes get painted over)
    f'<path d="{FINGERS}" fill="none" stroke="{INK}" stroke-width="5" stroke-linecap="round"/>'
    f"{PALM} fill=\"{INK}\" stroke=\"{INK}\" stroke-width=\"2.6\"/>"
    f'<path d="{FINGERS}" fill="none" stroke="{BODY}" stroke-width="2.4" stroke-linecap="round"/>'
    f"{PALM} fill=\"{BODY}\"/>"
    # mini move-cross badge, bottom-right
    '<g transform="translate(17.8 17.8)">'
    f'<path d="M-3.6 0 H3.6 M0 -3.6 V3.6" stroke="{INK}" stroke-width="2.6" stroke-linecap="round"/>'
    f'<path d="M-3.6 0 H3.6 M0 -3.6 V3.6" stroke="{BODY}" stroke-width="1.2" stroke-linecap="round"/>'
    f'<path d="M2.5 -1.4 L4.7 0 L2.5 1.4 Z M-2.5 -1.4 L-4.7 0 L-2.5 1.4 Z '
    f'M-1.4 -2.5 L0 -4.7 L1.4 -2.5 Z M-1.4 2.5 L0 4.7 L1.4 2.5 Z" '
    f'fill="{ACID}" stroke="{INK}" stroke-width="0.8" stroke-linejoin="round"/>'
    "</g>"
))

C["precision"] = ((12, 12), svg(
    duo("M12 2.6 V8.4 M12 15.6 V21.4 M2.6 12 H8.4 M15.6 12 H21.4", w=1.8)
    + f'<circle cx="12" cy="12" r="1.4" fill="{ACID}" stroke="{INK}" stroke-width="0.9"/>'
))

C["busy"] = ((12, 12), svg(
    # hourglass: frame bars, waisted glass, violet sand mid-fall
    f'<path d="M6.5 3.6 H17.5" stroke="{INK}" stroke-width="4.6" stroke-linecap="round"/>'
    f'<path d="M6.5 3.6 H17.5" stroke="{BODY}" stroke-width="2.4" stroke-linecap="round"/>'
    f'<path d="M6.5 20.4 H17.5" stroke="{INK}" stroke-width="4.6" stroke-linecap="round"/>'
    f'<path d="M6.5 20.4 H17.5" stroke="{BODY}" stroke-width="2.4" stroke-linecap="round"/>'
    '<path d="M8 5.4 H16 C16 8.8 13 10.4 12.9 12 C13 13.6 16 15.2 16 18.6 H8 '
    'C8 15.2 11 13.6 11.1 12 C11 10.4 8 8.8 8 5.4 Z" '
    f'fill="{BODY}" stroke="{INK}" stroke-width="1.3" stroke-linejoin="round"/>'
    f'<path d="M9.5 18 L14.5 18 L12 15.4 Z" fill="{ACID}"/>'
    f'<path d="M12 12.4 V15" stroke="{ACID}" stroke-width="1" stroke-linecap="round"/>'
    f'<path d="M10.8 6.8 H13.2 L12 8.4 Z" fill="{ACID}"/>'
))

ORDER = ["arrow", "pointer", "text", "thintext", "help", "unavailable", "pen",
         "move", "precision", "alt", "picker", "ew", "ns", "nwse", "nesw", "busy"]


def main():
    cells = []
    with open(f"{OUT}/uris_modern.txt", "w") as f:
        for name in ORDER:
            (hx, hy), body = C[name]
            open(f"{OUT}/{name}.svg", "w").write(body)
            uri = "data:image/svg+xml;base64," + base64.b64encode(body.encode()).decode()
            f.write(f"{name} {hx} {hy} {uri}\n")
            cells.append(
                f'<div class="cell"><div class="zoom" style="position:relative">{body.replace("width=\"24\" height=\"24\"", "width=\"96\" height=\"96\"")}'
                f'<i style="left:{hx*4-3}px;top:{hy*4-3}px"></i></div>'
                f'<div class="one">{body}</div><p>{name} ({hx},{hy})</p></div>'
            )
    html = (
        "<!doctype html><meta charset='utf-8'><style>"
        "body{background:#0e0f11;color:#9aa1a9;font:12px monospace;margin:24px}"
        ".grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}"
        ".cell{display:flex;flex-direction:column;gap:6px;align-items:flex-start}"
        ".zoom{image-rendering:auto}"
        "i{position:absolute;width:6px;height:6px;border:2px solid #f0655e;display:block}"
        "p{margin:0}"
        "</style><div class='grid'>" + "".join(cells) + "</div>"
    )
    open(f"{OUT}/sheet_modern.html", "w").write(html)
    print("done:", ", ".join(ORDER))


main()
