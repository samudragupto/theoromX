import sys
import re

files = [r'c:\TheromX 2026\index.html', r'c:\TheromX 2026\theoremx_mobile.html']

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update table header
        header_target = '<div class="result-cell">Remarks</div>'
        header_replacement = '<div class="result-cell">Remarks</div>\n                <div class="result-cell">Venue</div>'
        content = content.replace(header_target, header_replacement)

        # Update JS generation
        js_target = '<div class="result-cell" style="font-size: 0.8rem;">${item.remarks}</div>'
        js_replacement = '<div class="result-cell" style="font-size: 0.8rem;">${item.remarks}</div>\n            <div class="result-cell" style="font-size: 0.8rem;">Mode :- Offline <br> Venue :- Dr. M. G. R. Educational and Research Institute</div>'
        content = content.replace(js_target, js_replacement)

        # Update grid-template-columns
        content = content.replace('grid-template-columns: 0.8fr 1.2fr 2fr 1.5fr 1.5fr;', 'grid-template-columns: 0.8fr 1.2fr 2fr 1.5fr 1.5fr 1.5fr;')
        content = content.replace('grid-template-columns: 1fr 2fr 1.5fr 1.5fr;', 'grid-template-columns: 1fr 2fr 1.5fr 1.5fr 1.5fr;')
        content = content.replace('grid-template-columns: 0.8fr 1.5fr 1fr 1fr;', 'grid-template-columns: 0.8fr 1.5fr 1fr 1fr 1.5fr;')

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_path} successfully')
    except Exception as e:
        print(f'Error processing {file_path}:', e)
