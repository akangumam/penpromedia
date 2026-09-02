import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract offcanvas section from the broken content
offcanvas_pattern = re.compile(r'(<!-- 7\. Off-canvas Vertical Sidebar Navigation -->.*?)(<script>\s*// Header Scroll)', re.DOTALL)
m = offcanvas_pattern.search(content)
if m:
    with open('partials/offcanvas.html', 'w', encoding='utf-8') as f:
        f.write(m.group(1))

# Extract the ACTUAL tail script
script_pattern = re.compile(r'(<script>\s*// Header Scroll.*)', re.DOTALL)
m_script = script_pattern.search(content)
if m_script:
    tail_script = m_script.group(1)
else:
    # If // Header Scroll not found, search for the DOMContentLoaded one
    script_pattern = re.compile(r'(<script>\s*document\.addEventListener\(\'DOMContentLoaded\'.*)', re.DOTALL)
    m_script = script_pattern.search(content)
    tail_script = m_script.group(1) if m_script else ""

# Extract the pure head
head_pattern = re.compile(r'(.*?<body[^>]*>)', re.DOTALL)
m_head = head_pattern.search(content)
pure_head = m_head.group(1) if m_head else ""

# Build the new index.html
new_index = pure_head + """
    {{> sidebar }}

    {{> header }}

    {{> hero }}

    <!-- Main Content Wrapper (offset for sidebar) -->
    <div class="md:ml-12">
        {{> about }}
        {{> portfolio }}
        {{> services }}
        {{> marquee }}
        {{> footer }}
    </div>

    {{> offcanvas }}

""" + tail_script

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_index)

print("Fix applied")
