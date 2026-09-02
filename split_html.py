import os

def slice_file(filename, start, end, out_name):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    sliced = lines[start-1:end]
    
    os.makedirs('partials', exist_ok=True)
    with open(os.path.join('partials', out_name), 'w', encoding='utf-8') as f:
        f.writelines(sliced)

slice_file('index.html', 43, 172, 'header.html')
slice_file('index.html', 174, 257, 'hero.html')
slice_file('index.html', 262, 311, 'about.html')
slice_file('index.html', 313, 487, 'services.html')
slice_file('index.html', 489, 537, 'portfolio.html')
slice_file('index.html', 539, 556, 'marquee.html')
slice_file('index.html', 558, 745, 'footer.html')
slice_file('index.html', 748, 805, 'sidebar.html')

print("Extraction complete!")
