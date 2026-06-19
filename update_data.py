import csv
import json
import re

csv_path = r"c:\TheromX 2026\yguijdyr - Sheet1.csv"
html_path = r"c:\TheromX 2026\index.html"

# Read CSV
submissions = []
with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        track_id = row.get('Id', '').strip()
        author1 = row.get('Enter the First Author Name', '').strip()
        author2 = row.get('Enter the Second Author Name', '').strip()
        author3 = row.get('Enter the Third Author Name', '').strip()
        title = row.get('Title of the Paper', '').strip()
        status = row.get('status', '').strip()
        
        authors = [a for a in [author1, author2, author3] if a and a.lower() != 'nil' and a != '-']
        authors_str = ', '.join(authors)
        
        if not track_id:
            continue
            
        submissions.append({
            'trackId': track_id,
            'authors': authors_str,
            'title': title,
            'status': status.capitalize()
        })

js_array = "[\n"
for s in submissions:
    js_array += f"""            {{
              trackId: {json.dumps(s['trackId'])},
              authors: {json.dumps(s['authors'])},
              title: {json.dumps(s['title'])},
              status: {json.dumps(s['status'])},
              remarks: '--'
            }},\n"""
js_array += "          ];"

with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Replace the submissionData array using match to avoid escape errors
pattern = re.compile(r"const\s+submissionData\s*=\s*\[.*?\];", re.DOTALL)
match = pattern.search(html_content)
if match:
    new_js = "const submissionData = " + js_array
    html_content = html_content[:match.start()] + new_js + html_content[match.end():]

# Update displaySubmissions HTML
old_display_pattern = re.compile(r'<div class="result-row" style="animation: fadeSlideUp 0\.6s ease-out \$\{index \* 80\}ms forwards;">.*?</div>\s*</div>', re.DOTALL)

new_display = """<div class="result-row" style="animation: fadeSlideUp 0.6s ease-out ${index * 80}ms forwards; grid-template-columns: 0.8fr 1.5fr 2fr 1fr 1.5fr;">
            <div class="result-cell" style="font-weight: 600; color: var(--accent);">${item.trackId}</div>
            <div class="result-cell" style="font-size: 0.85rem; font-weight: 500;">${item.authors}</div>
            <div class="result-cell">${item.title}</div>
            <div class="result-cell" style="color: ${item.status.toLowerCase() === 'accepted' ? '#10b981' : '#ef4444'}; font-weight: 500;">${item.status}</div>
            <div class="result-cell" style="font-size: 0.8rem;">
              ${item.status.toLowerCase() === 'accepted' ? 'Mode :Offline <br> Venue : Dr. M. G. R. Educational and Research Institute' : item.remarks}
            </div>
          </div>"""

match_display = old_display_pattern.search(html_content)
if match_display:
    html_content = html_content[:match_display.start()] + new_display + html_content[match_display.end():]

# Update the header row
old_header_pattern = re.compile(r'<div class="result-row header">\s*<div class="result-cell">Track ID</div>\s*<div class="result-cell">Title</div>\s*<div class="result-cell">Status</div>\s*<div class="result-cell">Remarks</div>\s*<div class="result-cell">Venue</div>\s*</div>', re.DOTALL)

new_header = """<div class="result-row header" style="grid-template-columns: 0.8fr 1.5fr 2fr 1fr 1.5fr;">
            <div class="result-cell">Track ID</div>
            <div class="result-cell">Authors</div>
            <div class="result-cell">Title</div>
            <div class="result-cell">Status</div>
            <div class="result-cell">Details</div>
          </div>"""

match_header = old_header_pattern.search(html_content)
if match_header:
    html_content = html_content[:match_header.start()] + new_header + html_content[match_header.end():]

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("HTML updated successfully.")
