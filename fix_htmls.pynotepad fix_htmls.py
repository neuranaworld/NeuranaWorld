import os

for root, dirs, files in os.walk('Oyunlar'):
    for file in files:
        if file.startswith('index_') and file.endswith('.html'):
            filepath = os.path.join(root, file)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            content = content.replace('<script src=', '<script type="module" src=')
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f'Düzeltildi: {filepath}')

print('\nTamamlandı!')