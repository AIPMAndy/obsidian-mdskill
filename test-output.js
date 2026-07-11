const fs = require('fs');

// Read styles.md to get minimal style CSS
const stylesMd = fs.readFileSync('/Users/andy/.agents/skills/dbs-wechat-html/templates/styles.md', 'utf8');
const minimalMatch = stylesMd.match(/## 01 minimal：极简黑白.*?```css\n(.+?)\n```/s);
const minimalCSS = minimalMatch ? minimalMatch[1].trim() : '';

// Test markdown
const testMarkdown = `# Obsidian-MDskill 功能测试

欢迎使用 **Obsidian-MDskill** 插件！

## 核心功能

本插件提供以下功能：

- 15 种精美样式
- 一键复制到微信公众号
- 实时预览效果
- 支持 \`代码块\` 和 **粗体文本**

### 使用方法

1. 打开 Markdown 文件
2. 点击右侧手机图标
3. 选择样式并预览
4. 点击"复制到公众号"

> 提示：所有样式都经过微信公众号编辑器测试

---

**开始体验吧！**`;

// Convert markdown (simplified version)
function convertToHTML(md) {
    let html = '';
    const lines = md.split('\n');
    let inList = false;
    let listItems = [];
    
    const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const processInline = (text) => {
        text = escape(text);
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/`(.+?)`/g, '<code>$1</code>');
        return text;
    };
    
    const flushList = () => {
        if (listItems.length > 0) {
            html += '<ul>' + listItems.join('') + '</ul>';
            listItems = [];
        }
        inList = false;
    };
    
    for (let line of lines) {
        line = line.trim();
        if (!line) { flushList(); continue; }
        
        if (line.startsWith('# ')) {
            flushList();
            html += `<h1>${escape(line.substring(2))}</h1>`;
        } else if (line.startsWith('## ')) {
            flushList();
            html += `<h2>${escape(line.substring(3))}</h2>`;
        } else if (line.startsWith('### ')) {
            flushList();
            html += `<h3>${escape(line.substring(4))}</h3>`;
        } else if (line.startsWith('> ')) {
            flushList();
            html += `<blockquote>${escape(line.substring(2))}</blockquote>`;
        } else if (line === '---' || line === '***') {
            flushList();
            html += '<hr>';
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            listItems.push(`<li>${processInline(line.substring(2))}</li>`);
            inList = true;
        } else if (/^\d+\./.test(line)) {
            listItems.push(`<li>${processInline(line.replace(/^\d+\.\s*/, ''))}</li>`);
            inList = true;
        } else {
            flushList();
            html += `<p>${processInline(line)}</p>`;
        }
    }
    flushList();
    return html;
}

const bodyHTML = convertToHTML(testMarkdown);

const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${minimalCSS}</style>
</head>
<body>
${bodyHTML}
</body>
</html>`;

// Write to file
fs.writeFileSync('/tmp/obsidian-mdskill-output.html', fullHTML);

console.log('✓ 生成完整 HTML 输出');
console.log('✓ 文件位置: /tmp/obsidian-mdskill-output.html');
console.log(`✓ 文件大小: ${(fullHTML.length / 1024).toFixed(2)} KB`);
console.log('\n预览前 200 个字符:');
console.log(fullHTML.substring(0, 200) + '...');
