import re
html = open('scratch_reference.html', encoding='utf-8').read()
urls = set(re.findall(r'https://inv\.akaddigitech\.id/[^\s"'\>\<\)]+\.(?:png|jpe?g|webp|avif|gif)', html))
for u in sorted(urls): print(u)
