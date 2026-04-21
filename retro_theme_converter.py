import glob
import re

def replace_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Move from cold zinc to warm stone, and step down darkness for a retro feel
    # zinc-950 -> stone-900 (not black, warm dark grey)
    # zinc-900 -> stone-800
    # zinc-800 -> stone-700
    # zinc-700 -> stone-600
    # zinc-600 -> stone-500
    # zinc-500 -> stone-400
    # zinc-400 -> stone-300
    # zinc-300 -> stone-200
    # zinc-200 -> stone-100
    # zinc-100 -> stone-50
    # zinc-50  -> stone-50
    
    # Also change blue to sky for a more retro/muted blue
    
    replacements = {
        'zinc-950': 'stone-900',
        'zinc-900': 'stone-800',
        'zinc-800': 'stone-700',
        'zinc-700': 'stone-600',
        'zinc-600': 'stone-500',
        'zinc-500': 'stone-400',
        'zinc-400': 'stone-300',
        'zinc-300': 'stone-200',
        'zinc-200': 'stone-100',
        'zinc-100': 'stone-50',
        'zinc-50': 'stone-50',
        'blue-': 'sky-',
        '#09090b': '#1c1917', # zinc-950 -> stone-900 hex
        '#18181b': '#292524', # zinc-900 -> stone-800 hex
        '#27272a': '#44403c', # zinc-800 -> stone-700 hex
        '#1e1e1e': '#292524', # VS Code dark -> stone-800
    }

    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for filepath in glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.css', recursive=True) + ['index.html']:
    replace_in_file(filepath)
