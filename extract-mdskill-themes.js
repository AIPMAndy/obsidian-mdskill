// 从 MDSKILL 提取主题并生成 Obsidian 插件代码
const fs = require('fs');
const path = require('path');

// 读取 MDSKILL templates.js
const mdskillPath = '/Users/andy/Documents/AICode/02 产品网站与服务端/MDSKILL/renderer/templates.js';
const templatesContent = fs.readFileSync(mdskillPath, 'utf8');

// 执行 templates.js 来获取 templates 对象
eval(templatesContent);

// 生成 CSS 的函数
function generateCSS(styles) {
  return `body{
    font-family:${styles.bodyFont};
    font-size:${styles.bodySize};
    line-height:${styles.bodyLineHeight};
    color:${styles.bodyColor};
    max-width:${styles.maxWidth};
    margin:0 auto;
    padding:${styles.padding};
    background:${styles.backgroundColor};
  }
  h1{
    font-family:${styles.titleFont};
    font-size:${styles.titleSize};
    font-weight:${styles.titleWeight};
    color:${styles.titleColor};
    margin-bottom:${styles.titleMarginBottom};
  }
  h2{
    font-family:${styles.h2Font};
    font-size:${styles.h2Size};
    font-weight:${styles.h2Weight};
    color:${styles.h2Color};
    margin-top:${styles.h2MarginTop};
    margin-bottom:${styles.h2MarginBottom};
    ${styles.h2BorderColor !== 'transparent' ? `border-bottom:2px solid ${styles.h2BorderColor};padding-bottom:8px;` : ''}
  }
  h3{
    font-size:${styles.h3Size};
    font-weight:${styles.h3Weight};
    color:${styles.h3Color};
  }
  p{
    margin:${styles.paragraphSpacing} 0;
  }
  blockquote{
    border-left:4px solid ${styles.blockquoteBorderColor};
    background:${styles.blockquoteBg};
    color:${styles.blockquoteColor};
    padding:12px 16px;
    margin:16px 0;
  }
  ul{
    padding-left:24px;
  }
  li{
    margin:6px 0;
    color:${styles.bodyColor};
  }
  strong{
    font-weight:700;
    color:${styles.strongColor};
  }
  code{
    background:${styles.codeBg};
    color:${styles.codeColor};
    padding:2px 6px;
    border-radius:3px;
    font-family:monospace;
  }
  hr{
    border:none;
    border-top:1px solid ${styles.hrColor};
    margin:24px 0;
  }`.replace(/\s+/g, ' ').replace(/\n/g, '');
}

// 选择要包含的主题（只选择免费的和适合公众号的）
const selectedThemes = [
  'playful',      // 多彩活力
  'default',      // GitHub Dark
  'githubLight',  // GitHub Light
  'minimal',      // 极简现代
  'magazine',     // 杂志布局
  'wechatElegant', // 公众号·优雅
  'nytimes',      // 纽约时报
  'wired',        // Wired 连线
  'medium',       // Medium
  'zen',          // 禅意
];

// 生成 STYLES 对象
const stylesObject = {};
selectedThemes.forEach(themeId => {
  const theme = templates[themeId];
  if (!theme) {
    console.warn(`⚠️ 主题 ${themeId} 不存在`);
    return;
  }

  stylesObject[themeId] = {
    name: theme.name,
    description: theme.description,
    css: generateCSS(theme.styles)
  };
});

// 输出 TypeScript 代码
console.log('const STYLES = {');
Object.entries(stylesObject).forEach(([id, style]) => {
  console.log(`  ${id}: {`);
  console.log(`    name: '${style.name}',`);
  console.log(`    description: '${style.description}',`);
  console.log(`    css: \`${style.css}\``);
  console.log(`  },`);
});
console.log('};');

console.log(`\n\n✓ 成功提取 ${Object.keys(stylesObject).length} 个主题`);
