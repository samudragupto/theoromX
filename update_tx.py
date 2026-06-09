import sys
import re

file_path = r'c:\TheromX 2026\theoremx_mobile.html'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('placeholder="Enter your Track ID"', 'placeholder="search ur submission ex"')
    content = content.replace('TX-00', 'THX-00')

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print('Updated theoremx_mobile.html successfully')
except Exception as e:
    print('Error:', e)
