import React, { useState, useEffect } from 'react';
import { FileText, Copy, Check, Download, Eye, EyeOff, Code, Maximize2, Minimize2 } from 'lucide-react';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('markdown_content');
    if (saved) setMarkdown(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('markdown_content', markdown);
  }, [markdown]);

  const convertMarkdown = (text) => {
    // Headers
    text = text.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');
    
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold">$1</strong>');
    text = text.replace(/__(.*?)__/gim, '<strong class="font-bold">$1</strong>');
    
    // Italic
    text = text.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');
    text = text.replace(/_(.*?)_/gim, '<em class="italic">$1</em>');
    
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>');
    
    // Images
    text = text.replace(/!\[([^\]]+)\]\(([^\)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />');
    
    // Code blocks
    text = text.replace(/```([^`]+)```/gim, '<pre class="bg-gray-800 text-white p-4 rounded-lg my-4 overflow-x-auto"><code>$1</code></pre>');
    
    // Inline code
    text = text.replace(/`([^`]+)`/gim, '<code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono">$1</code>');
    
    // Lists
    text = text.replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>');
    text = text.replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>');
    text = text.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>');
    
    // Blockquotes
    text = text.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>');
    
    // Line breaks
    text = text.replace(/\n$/gim, '<br />');
    
    return text;
  };

  const loadSample = () => {
    const sample = `# Markdown Editör

## Başlıklar
# H1 Başlık
## H2 Başlık
### H3 Başlık

## Metin Biçimlendirme
**Kalın metin** veya __kalın metin__
*İtalik metin* veya _italik metin_

## Listeler
- Liste öğesi 1
- Liste öğesi 2
- Liste öğesi 3

1. Numaralı liste 1
2. Numaralı liste 2
3. Numaralı liste 3

## Linkler ve Kod
[Google'a git](https://www.google.com)

\`inline kod\` örneği

\`\`\`
// Kod bloğu
function merhaba() {
  console.log("Merhaba Dünya!");
}
\`\`\`

## Alıntı
> Bu bir alıntıdır.
> İkinci satır alıntı.

## Görsel
![Açıklama](https://via.placeholder.com/400x200)
`;
    setMarkdown(sample);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
  };

  const downloadHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { font-size: 2.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; }
    h2 { font-size: 2rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    h3 { font-size: 1.5rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
    strong { font-weight: bold; }
    em { font-style: italic; }
    code { background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.875rem; }
    pre { background: #1f2937; color: white; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; }
    pre code { background: transparent; padding: 0; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    blockquote { border-left: 4px solid #d1d5db; padding-left: 1rem; font-style: italic; margin: 1rem 0; }
    img { max-width: 100%; border-radius: 8px; margin: 1rem 0; }
    li { margin-left: 1rem; }
  </style>
</head>
<body>
${convertMarkdown(markdown)}
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
  };

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-5xl font-bold text-white flex items-center gap-3">
            <FileText className="w-12 h-12" />
            Markdown Editör
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setFullscreen(!fullscreen)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors"
            >
              {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            {showPreview ? 'Önizlemeyi Gizle' : 'Önizlemeyi Göster'}
          </button>
          <button
            onClick={loadSample}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <Code className="w-5 h-5" />
            Örnek Yükle
          </button>
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 ${
              copied ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Kopyalandı!' : 'Kopyala'}
          </button>
          <button
            onClick={downloadMarkdown}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            MD İndir
          </button>
          <button
            onClick={downloadHTML}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            HTML İndir
          </button>
        </div>

        <div className={`grid ${showPreview ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Markdown</h2>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Markdown içeriğinizi buraya yazın...

# Başlık
## Alt Başlık

**Kalın** ve *italik* metin

- Liste öğesi"
              className="w-full h-96 px-4 py-3 border-2 border-gray-300 rounded-xl resize-none focus:border-blue-500 focus:outline-none font-mono text-sm"
            />
          </div>

          {showPreview && (
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold mb-4">Önizleme</h2>
              <div
                className="prose max-w-none h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: convertMarkdown(markdown) }}
              />
            </div>
          )}
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">📝 Markdown Sözdizimi</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong># Başlık</strong> → H1 Başlık<br />
              <strong>## Alt Başlık</strong> → H2 Başlık<br />
              <strong>**kalın**</strong> → <strong>kalın</strong><br />
              <strong>*italik*</strong> → <em>italik</em>
            </div>
            <div>
              <strong>[link](url)</strong> → Link<br />
              <strong>`kod`</strong> → <code className="bg-white/20 px-2 py-1 rounded">kod</code><br />
              <strong>- liste</strong> → • liste<br />
              <strong>&gt; alıntı</strong> → Alıntı
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
