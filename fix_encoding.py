import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace common encoding corruption patterns
content = content.replace('â€"', '-')
content = content.replace('â"€', '-')
content = content.replace('Ã¢â‚¬â€', '-')
content = content.replace('Ã‚Â·', '·')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Encoding issues fixed!')
