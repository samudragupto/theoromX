"""
sync_mobile_search.py
Syncs the submissions search section (data + JS + header) from index.html → theoremx_mobile.html
"""

import re

INDEX_PATH  = r"c:\TheromX 2026\index.html"
MOBILE_PATH = r"c:\TheromX 2026\theoremx_mobile.html"

# ─── 1. Read both files ──────────────────────────────────────────────────────
with open(INDEX_PATH,  "r", encoding="utf-8") as f:
    index_html = f.read()

with open(MOBILE_PATH, "r", encoding="utf-8") as f:
    mobile_html = f.read()

print(f"index.html  : {len(index_html):,} bytes")
print(f"mobile.html : {len(mobile_html):,} bytes")

# ─── 2. Extract the full search <script> block from index.html ───────────────
marker = "<!-- Search Submissions Script -->"
marker_pos = index_html.find(marker)
if marker_pos < 0:
    raise RuntimeError("Could not find '<!-- Search Submissions Script -->' in index.html")

script_start = index_html.index("<script>", marker_pos)
script_end   = index_html.index("</script>", script_start) + len("</script>")
search_script_block = index_html[script_start:script_end]
print(f"\nExtracted search script block: {len(search_script_block):,} chars")

# Quick sanity check
assert "submissionData" in search_script_block, "submissionData not found in extracted block"
assert "displaySubmissions" in search_script_block, "displaySubmissions not found"
assert "searchBtn" in search_script_block, "searchBtn not found"
print("Sanity checks passed ✓")

# ─── 3. Fix the header row in mobile.html ─────────────────────────────────────
# Old:  Track ID | Title | Status | Remarks | Venue   (no Authors)
# New:  Track ID | Authors | Title | Status | Details
old_header_pattern = re.compile(
    r'<div class="result-row header">\s*'
    r'<div class="result-cell">Track ID</div>\s*'
    r'<div class="result-cell">Title</div>\s*'
    r'<div class="result-cell">Status</div>\s*'
    r'<div class="result-cell">Remarks</div>\s*'
    r'<div class="result-cell">Venue</div>\s*'
    r'</div>',
    re.DOTALL
)

new_header = (
    '<div class="result-row header" style="grid-template-columns: 0.8fr 1.5fr 2fr 1fr 1.5fr;">\n'
    '                <div class="result-cell">Track ID</div>\n'
    '                <div class="result-cell">Authors</div>\n'
    '                <div class="result-cell">Title</div>\n'
    '                <div class="result-cell">Status</div>\n'
    '                <div class="result-cell">Details</div>\n'
    '              </div>'
)

header_match = old_header_pattern.search(mobile_html)
if not header_match:
    raise RuntimeError(
        "Could not find old header row in theoremx_mobile.html. "
        "Snippet around 'result-row header':\n" +
        mobile_html[mobile_html.find('result-row header') - 20 : mobile_html.find('result-row header') + 300]
    )

mobile_html = mobile_html[:header_match.start()] + new_header + mobile_html[header_match.end():]
print("Fixed header row ✓")

# ─── 4. Fix the CSS .result-row grid-template-columns ─────────────────────────
old_grid_pattern = re.compile(
    r'(\.result-row\s*\{[^}]*?grid-template-columns:\s*)([^;]+)(;)',
    re.DOTALL
)
grid_match = old_grid_pattern.search(mobile_html)
if grid_match:
    mobile_html = (
        mobile_html[:grid_match.start(2)]
        + "0.8fr 1.5fr 2fr 1fr 1.5fr"
        + mobile_html[grid_match.start(3):]
    )
    print("Fixed .result-row grid-template-columns ✓")
else:
    print("WARNING: .result-row grid CSS not found in mobile file, skipping.")

# ─── 5. Add mobile-responsive card view CSS ───────────────────────────────────
mobile_card_css = """
    /* ── Mobile: stacked card view for submissions on small screens ── */
    @media (max-width: 600px) {
      .result-table {
        gap: 0.5rem;
        display: flex;
        flex-direction: column;
      }
      .result-row.header { display: none; }
      .result-row:not(.header) {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 1rem 1.2rem;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-sm);
        border-bottom: 1px solid var(--border) !important;
      }
      .result-cell { font-size: 0.82rem; }
      .result-cell:first-child {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--accent);
        border-bottom: 1px solid var(--border);
        padding-bottom: 0.35rem;
        margin-bottom: 0.2rem;
      }
    }
"""

# Inject after .result-row:last-child { ... }
inject_marker = ".result-row:last-child {"
inject_pos = mobile_html.rfind(inject_marker)
if inject_pos > 0:
    end_brace = mobile_html.index("}", inject_pos) + 1
    mobile_html = mobile_html[:end_brace] + mobile_card_css + mobile_html[end_brace:]
    print("Injected mobile-responsive CSS ✓")
else:
    print("WARNING: Could not find .result-row:last-child injection point.")

# ─── 6. Check if search script already exists in mobile file ─────────────────
if "submissionData" in mobile_html:
    print("\nWARNING: submissionData already exists in mobile file. Removing old instance...")
    # Remove old search script block if present
    old_block_pattern = re.compile(
        r'<script>\s*document\.addEventListener\(\'DOMContentLoaded\'.*?submissionData.*?</script>',
        re.DOTALL
    )
    mobile_html = old_block_pattern.sub('', mobile_html, count=1)
    print("Removed old search script block.")

# ─── 7. Insert the search <script> before </body> ─────────────────────────────
body_close_pos = mobile_html.rfind("</body>")
if body_close_pos < 0:
    raise RuntimeError("Could not find </body> in theoremx_mobile.html")

mobile_html = (
    mobile_html[:body_close_pos]
    + "\n      <!-- Search Submissions Script -->\n      "
    + search_script_block
    + "\n\n"
    + mobile_html[body_close_pos:]
)
print("Inserted search <script> block before </body> ✓")

# ─── 8. Write updated mobile file ────────────────────────────────────────────
with open(MOBILE_PATH, "w", encoding="utf-8") as f:
    f.write(mobile_html)

print(f"\n✅ Done! Wrote {len(mobile_html):,} bytes → {MOBILE_PATH}")
print("\nChanges made:")
print("  1. Header row: Track ID | Authors | Title | Status | Details")
print("  2. .result-row CSS: grid-template-columns: 0.8fr 1.5fr 2fr 1fr 1.5fr")
print("  3. @media (max-width:600px) stacked card view CSS")
print("  4. Full search JS (submissionData array + displaySubmissions + handlers)")
