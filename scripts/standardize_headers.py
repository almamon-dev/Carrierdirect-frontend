#!/usr/bin/env python3
"""
Comprehensive script to standardize all page headers and descriptions across Supplier and Customer modules.
Standard:
  - h1: className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1"
  - p:  className="text-xs text-slate-500 dark:text-slate-400 font-medium"
  - Header containers: Clean layout without border-b dividers or leading icon boxes.
"""

import os
import re

MODULE_DIRS = [
    '/home/mamon/React/Carrierdirect-frontend/src/modules/Supplier',
    '/home/mamon/React/Carrierdirect-frontend/src/modules/Customer',
]

EXCLUDE_FILES = [
    'Customer/Finance/Invoices/View.tsx',  # Printable invoice template
]

def standardize_file(file_path):
    rel_path = file_path.replace('/home/mamon/React/Carrierdirect-frontend/src/modules/', '')
    if any(ex in rel_path for ex in EXCLUDE_FILES):
        print(f"Skipping excluded file: {rel_path}")
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Update H1 and immediate Subtitle P
    # Match <h1 ...>...</h1> followed by optional whitespace and <p ...>...</p>
    def replace_h1_and_p(match):
        h1_tag_start = match.group(1)
        h1_inner = match.group(2)
        has_p = match.group(3)
        
        # Determine H1 class
        if 'flex items-center' in h1_tag_start or '<span' in h1_inner:
            # Check if there's an actual flex requirement (e.g. badge inside h1)
            if 'unreadCount' in h1_inner or '<span className=' in h1_inner:
                h1_cls = 'text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1 flex items-center gap-2'
            else:
                h1_cls = 'text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1'
        else:
            h1_cls = 'text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1'

        new_h1 = f'<h1 className="{h1_cls}">\n                        {h1_inner.strip()}\n                    </h1>' if '\n' in h1_inner else f'<h1 className="{h1_cls}">{h1_inner}</h1>'

        if has_p:
            p_inner = match.group(4)
            new_p_cls = 'text-xs text-slate-500 dark:text-slate-400 font-medium'
            new_p = f'\n                    <p className="{new_p_cls}">\n                        {p_inner.strip()}\n                    </p>'
            return f'{new_h1}{new_p}'
        else:
            return new_h1

    # Replace <h1 ...>...</h1>\s*(<p ...>...</p>)?
    content = re.sub(
        r'<h1([^>]*)>([\s\S]*?)<\/h1>(?:\s*<p([^>]*)>([\s\S]*?)<\/p>)?',
        replace_h1_and_p,
        content
    )

    # 2. Also check any standalone <p className="..."> that is the first child after </h1> if not caught
    def standardize_p_after_h1(match):
        pre = match.group(1)
        p_attrs = match.group(2)
        p_body = match.group(3)
        return f'{pre}<p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{p_body}</p>'

    content = re.sub(
        r'(<\/h1>\s*)<p([^>]*)>([\s\S]*?)<\/p>',
        standardize_p_after_h1,
        content
    )

    # 3. Clean outer header containers from border-b / pb-3 / pb-4
    def clean_header_container(match):
        div_start = match.group(1)
        cls_content = match.group(2)
        div_end = match.group(3)

        cleaned_cls = cls_content
        # Remove border-b variations
        cleaned_cls = re.sub(r'\bborder-b\s+border-slate-200(?:\/80|\/90)?(?:\s+dark:border-slate-800(?:\/60)?)?\b', '', cleaned_cls)
        cleaned_cls = re.sub(r'\bborder-b\s+border-slate-200(?:\/80|\/90)?\b', '', cleaned_cls)
        cleaned_cls = re.sub(r'\bborder-b\s+dark:border-slate-800\b', '', cleaned_cls)
        cleaned_cls = re.sub(r'\bborder-b\b', '', cleaned_cls)
        cleaned_cls = re.sub(r'\bpb-[34]\b', '', cleaned_cls)
        cleaned_cls = ' '.join(cleaned_cls.split())

        return f'{div_start}className="{cleaned_cls}"{div_end}'

    # Look for header wrappers before h1
    content = re.sub(
        r'(<div[^>]*?)(className="[^"]*?border-b[^"]*?")([^>]*?>\s*(?:<div[^>]*?>\s*)?<h1)',
        clean_header_container,
        content
    )

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {rel_path}")
        return True
    return False

def main():
    updated_count = 0
    total_files = 0
    for module_dir in MODULE_DIRS:
        for root, dirs, files in os.walk(module_dir):
            for f in files:
                if f.endswith('.tsx'):
                    path = os.path.join(root, f)
                    total_files += 1
                    if standardize_file(path):
                        updated_count += 1

    print(f"\nCompleted! Standardized {updated_count} files out of {total_files} scanned.")

if __name__ == '__main__':
    main()
