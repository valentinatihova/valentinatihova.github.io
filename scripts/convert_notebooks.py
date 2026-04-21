import json
import urllib.request
import base64
import os
import re
import time
import html
from deep_translator import GoogleTranslator

NOTEBOOKS = [
    {
        "id": "bank-churn-prediction",
        "url": "https://raw.githubusercontent.com/valentinatihova/DS_projects/main/bank_churn_prediction/bank_churn_prediction.ipynb",
        "title": "Bank Churn Prediction & Retention Strategy",
        "tags": ["Machine Learning", "Python", "Scikit-learn", "Data Science"]
    },
    {
        "id": "ml-model-for-zyfra",
        "url": "https://raw.githubusercontent.com/valentinatihova/DS_projects/main/ml_model_for_Zyfra/grand_project_2.ipynb",
        "title": "Predicting Gold Recovery (Zyfra ML Model)",
        "tags": ["Machine Learning", "Python", "Regression", "Data Science"]
    },
    {
        "id": "final-project-da",
        "url": "https://raw.githubusercontent.com/valentinatihova/DA_projects/master/final_project/grand_mobile_app_users.ipynb",
        "title": "Mobile App User Behavior & A/B Testing",
        "tags": ["Data Analytics", "A/B Testing", "Python", "SQL"]
    }
]

translator = GoogleTranslator(source='ru', target='en')

def translate_text(text):
    try:
        if len(text) < 4000:
            return translator.translate(text)
        else:
            chunks = text.split('\n\n')
            translated = []
            for chunk in chunks:
                if chunk.strip():
                    translated.append(translator.translate(chunk))
                    time.sleep(0.1)
            return '\n\n'.join(translated)
    except Exception as e:
        print(f"Translation failed: {e}")
        return text

def process_notebook(nb_info):
    print(f"Processing {nb_info['id']}...")
    try:
        req = urllib.request.Request(nb_info['url'])
        with urllib.request.urlopen(req) as response:
            nb_content = response.read()
        nb = json.loads(nb_content)
    except Exception as e:
        print(f"Failed to download or parse {nb_info['url']}: {e}")
        return

    img_dir = f"public/images/projects/{nb_info['id']}"
    os.makedirs(img_dir, exist_ok=True)
    
    mdx_lines = []
    
    # Add title
    mdx_lines.append(f"# {nb_info['title']}")
    mdx_lines.append("")
    
    img_counter = 1
    
    for cell in nb.get('cells', []):
        if cell['cell_type'] == 'markdown':
            source = "".join(cell.get('source', []))
            
            # Check if text contains Russian characters
            if any(char in source for char in 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'):
                source = translate_text(source)
                source = html.unescape(source)
            
            # Fix markdown headers missing a space (e.g. #Header -> # Header)
            source = re.sub(r'^(#+)([^#\s])', r'\1 \2', source, flags=re.MULTILINE)
            
            # Remove TOC links and elements that might break MDX
            source = re.sub(r'<div class="toc">.*?</div>', '', source, flags=re.DOTALL)
            source = re.sub(r'<a href="#.*?">(.*?)</a>', r'\1', source)
            source = re.sub(r'<a id=".*?"></a>', '', source)
            source = re.sub(r'<h1>Contents<span class="tocSkip"></span></h1>', '', source)
            
            # Fix class -> className for any remaining HTML in markdown
            source = source.replace('class=', 'className=')
            
            # Escape { and } for MDX to avoid acorn parsing errors
            source = source.replace('{', '&#123;').replace('}', '&#125;')
            
            # Escape HTML comments that might break MDX
            source = source.replace('<!--', '&lt;!--').replace('-->', '--&gt;')
            
            # Escape $ which might trigger math or other MDX parsing issues
            source = source.replace('$', '&#36;')
            
            mdx_lines.append(source)
            mdx_lines.append("")
            
        elif cell['cell_type'] == 'code':
            source = "".join(cell.get('source', []))
            if source.strip():
                # Do NOT escape { } inside code blocks, but wrap them properly
                mdx_lines.append("```python")
                mdx_lines.append(source.rstrip())
                mdx_lines.append("```")
                mdx_lines.append("")
            
            # Process outputs
            has_output = False
            for output in cell.get('outputs', []):
                if output.get('output_type') in ['display_data', 'execute_result']:
                    data = output.get('data', {})
                    if 'image/png' in data:
                        img_data = data['image/png']
                        img_path = f"{img_dir}/plot_{img_counter}.png"
                        with open(img_path, "wb") as fh:
                            fh.write(base64.b64decode(img_data))
                        mdx_lines.append(f"![Plot](/images/projects/{nb_info['id']}/plot_{img_counter}.png)")
                        mdx_lines.append("")
                        img_counter += 1
                        has_output = True
                    elif 'text/html' in data:
                        html_content = "".join(data['text/html'])
                        # Fix React JSX issues with raw HTML from Pandas
                        html_content = html_content.replace('{', '&#123;').replace('}', '&#125;')
                        html_content = html_content.replace('class=', 'className=')
                        html_content = re.sub(r'style="[^"]*"', '', html_content)
                        html_content = re.sub(r'border="[^"]*"', '', html_content)
                        html_content = re.sub(r'valign="[^"]*"', '', html_content)
                        html_content = re.sub(r'halign="[^"]*"', '', html_content)
                        html_content = re.sub(r'align="[^"]*"', '', html_content)
                        html_content = html_content.replace('colspan=', 'colSpan=')
                        html_content = html_content.replace('rowspan=', 'rowSpan=')
                        
                        # Wrap HTML tables in a scrollable div
                        mdx_lines.append('<div className="overflow-x-auto my-6 border border-zinc-800 rounded-xl bg-zinc-900/50 p-4 text-sm text-zinc-300">')
                        mdx_lines.append(html_content)
                        mdx_lines.append('</div>')
                        mdx_lines.append("")
                        has_output = True
                    elif 'text/plain' in data:
                        text_content = "".join(data['text/plain'])
                        mdx_lines.append("```output")
                        mdx_lines.append(text_content.rstrip())
                        mdx_lines.append("```")
                        mdx_lines.append("")
                        has_output = True
                elif output.get('output_type') == 'stream':
                    text_content = "".join(output.get('text', []))
                    mdx_lines.append("```output")
                    mdx_lines.append(text_content.rstrip())
                    mdx_lines.append("```")
                    mdx_lines.append("")
                    has_output = True
                elif output.get('output_type') == 'error':
                    text_content = "".join(output.get('traceback', []))
                    # Strip ANSI escape codes
                    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
                    text_content = ansi_escape.sub('', text_content)
                    mdx_lines.append("```error")
                    mdx_lines.append(text_content.rstrip())
                    mdx_lines.append("```")
                    mdx_lines.append("")
                    has_output = True
                        
    mdx_content = "\n".join(mdx_lines)
    
    out_path = f"src/content/articles/{nb_info['id']}.mdx"
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(mdx_content)
    print(f"Saved {out_path}")

for nb in NOTEBOOKS:
    process_notebook(nb)
