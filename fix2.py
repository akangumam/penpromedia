import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the offcanvas extraction
pattern = re.compile(r'(<!-- 7\. Off-canvas Vertical Sidebar Navigation -->.*?)(\s*<script>)', re.DOTALL)
m = pattern.search(content)
if m:
    with open('partials/offcanvas.html', 'w', encoding='utf-8') as f:
        f.write(m.group(1))
    print("offcanvas.html created")
else:
    print("Could not find offcanvas section!")

