// Simulate the core conversion logic
function escapeHTML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function processInline(text) {
    // First escape HTML
    text = escapeHTML(text);
    
    // Then apply markdown formatting
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/`(.+?)`/g, '<code>$1</code>');
    
    return text;
}

function convertMarkdownToHTML(markdown) {
    let html = '';
    const lines = markdown.split('\n');
    let inList = false;
    let listItems = [];
    
    const flushList = () => {
        if (listItems.length > 0) {
            html += '<ul>' + listItems.join('') + '</ul>';
            listItems = [];
        }
        inList = false;
    };
    
    for (let line of lines) {
        line = line.trim();
        
        if (!line) {
            flushList();
            continue;
        }
        
        if (line.startsWith('# ')) {
            flushList();
            const text = line.substring(2);
            html += `<h1>${escapeHTML(text)}</h1>`;
            continue;
        }
        
        if (line.startsWith('## ')) {
            flushList();
            const text = line.substring(3);
            html += `<h2>${escapeHTML(text)}</h2>`;
            continue;
        }
        
        if (line.startsWith('### ')) {
            flushList();
            const text = line.substring(4);
            html += `<h3>${escapeHTML(text)}</h3>`;
            continue;
        }
        
        if (line.startsWith('> ')) {
            flushList();
            const text = line.substring(2);
            html += `<blockquote>${escapeHTML(text)}</blockquote>`;
            continue;
        }
        
        if (line === '---' || line === '***') {
            flushList();
            html += '<hr>';
            continue;
        }
        
        if (line.startsWith('- ') || line.startsWith('* ')) {
            const text = line.substring(2);
            listItems.push(`<li>${processInline(text)}</li>`);
            inList = true;
            continue;
        }
        
        flushList();
        html += `<p>${processInline(line)}</p>`;
    }
    
    flushList();
    return html;
}

// Test markdown
const testMarkdown = `# 测试标题

这是一段 **粗体文本** 和 \`代码片段\` 的测试。

## 功能列表

- 支持标题
- 支持 **粗体**
- 支持 \`代码\`

> 这是一个引用块

### 小标题

普通段落文本。

---

结束。`;

console.log('=== 测试 Markdown 转换 ===\n');
const result = convertMarkdownToHTML(testMarkdown);
console.log(result);

console.log('\n=== 验证关键元素 ===');
const checks = [
    { name: 'H1 标签', pattern: '<h1>测试标题</h1>', pass: result.includes('<h1>测试标题</h1>') },
    { name: 'H2 标签', pattern: '<h2>功能列表</h2>', pass: result.includes('<h2>功能列表</h2>') },
    { name: 'H3 标签', pattern: '<h3>小标题</h3>', pass: result.includes('<h3>小标题</h3>') },
    { name: '粗体', pattern: '<strong>粗体', pass: result.includes('<strong>粗体') },
    { name: '代码', pattern: '<code>代码', pass: result.includes('<code>代码') },
    { name: '列表', pattern: '<ul><li>', pass: result.includes('<ul><li>') },
    { name: '引用', pattern: '<blockquote>', pass: result.includes('<blockquote>') },
    { name: '分隔线', pattern: '<hr>', pass: result.includes('<hr>') },
    { name: '段落', pattern: '<p>', pass: result.includes('<p>') }
];

checks.forEach(check => {
    console.log(check.pass ? `✓ ${check.name}` : `✗ ${check.name} - 未找到 ${check.pattern}`);
});

const allPassed = checks.every(c => c.pass);
console.log(allPassed ? '\n✓ 所有测试通过' : '\n✗ 部分测试失败');
