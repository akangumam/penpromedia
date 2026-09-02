import os
import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define section boundaries
sections = {
    'sidebar': (r'<!-- Left Vertical Social Bar -->', r'<!-- 1\. Header / Navbar'),
    'header': (r'<!-- 1\. Header / Navbar', r'<!-- 2\. Hero Section / Slider'),
    'hero': (r'<!-- 2\. Hero Section / Slider', r'<!-- Main Content Wrapper'),
    'about': (r'<!-- 3\. About Section -->', r'<!-- 4\. Latest Works / Portfolio'),
    'portfolio': (r'<!-- 4\. Latest Works / Portfolio -->', r'<!-- 5\. Services / Pricing Cards -->'),
    'services': (r'<!-- 5\. Services / Pricing Cards -->', r'<!-- Image Marquee / Divider -->'),
    'marquee': (r'<!-- Image Marquee / Divider -->', r'<!-- 6\. Footer -->'),
    'footer': (r'<!-- 6\. Footer -->', r'</div>\s*<!-- 7\. Off-canvas Vertical Sidebar Navigation -->'),
    'offcanvas': (r'<!-- 7\. Off-canvas Vertical Sidebar Navigation -->', r'<script>')
}

os.makedirs('partials', exist_ok=True)

for name, (start_comment, end_comment) in sections.items():
    pattern = re.compile(f'({start_comment}.*?)({end_comment})', re.DOTALL)
    match = pattern.search(content)
    if match:
        partial_content = match.group(1)
        with open(os.path.join('partials', f'{name}.html'), 'w', encoding='utf-8') as f:
            f.write(partial_content)
            
# Reconstruct index.html
head_pattern = re.compile(r'(.*?<body[^>]*>)', re.DOTALL)
tail_pattern = re.compile(r'(<script>.*)', re.DOTALL)

head_match = head_pattern.search(content)
tail_match = tail_pattern.search(content)

new_content = head_match.group(1) + """
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

""" + tail_match.group(1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Extraction and replacement successful!")
