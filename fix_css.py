import re

def fix_css(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if '.result-cell:nth-child(2)::before' in content:
        content = re.sub(r'(\.result-cell:nth-child\(2\)::before\s*\{\s*content:\s*")[^"]+(")(\s*!important)?(\s*;\s*\})', r'\g<1>Authors\g<2>\g<3>\g<4>', content)
        content = re.sub(r'(\.result-cell:nth-child\(3\)::before\s*\{\s*content:\s*")[^"]+(")(\s*!important)?(\s*;\s*\})', r'\g<1>Title\g<2>\g<3>\g<4>', content)
        content = re.sub(r'(\.result-cell:nth-child\(4\)::before\s*\{\s*content:\s*")[^"]+(")(\s*!important)?(\s*;\s*\})', r'\g<1>Status\g<2>\g<3>\g<4>', content)
        content = re.sub(r'(\.result-cell:nth-child\(5\)::before\s*\{\s*content:\s*")[^"]+(")(\s*!important)?(\s*;\s*\})', r'\g<1>Details\g<2>\g<3>\g<4>', content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed CSS in {file_path}')
    else:
        print(f'nth-child CSS not found in {file_path}')

fix_css(r'c:\TheromX 2026\index.html')
fix_css(r'c:\TheromX 2026\theoremx_mobile.html')
