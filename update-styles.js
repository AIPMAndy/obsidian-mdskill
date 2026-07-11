// Script to generate main.ts with all 15 styles
const fs = require('fs');

const styles = {
  minimal: {
    name: '极简黑白',
    description: '默认款、方法论、诊断报告',
    css: 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.82;color:#2b2b2b;max-width:740px;margin:0 auto;padding:24px 22px;background:#fff;}h1{font-size:24px;line-height:1.35;font-weight:800;text-align:left;margin:34px 0 24px;color:#111;padding-bottom:16px;border-bottom:1px solid #111;}h2{font-size:19px;line-height:1.45;font-weight:800;margin:42px 0 14px;color:#111;}h2:before{content:"";display:block;width:30px;height:3px;background:#111;margin:0 0 12px;}h3{font-size:17px;line-height:1.5;font-weight:760;margin:30px 0 10px;color:#222;}p{margin:12px 0;line-height:1.82;}blockquote{margin:20px 0;padding:13px 16px;border-left:3px solid #111;background:#f7f7f7;color:#555;font-style:normal;}ul{margin:12px 0;padding-left:20px;}li{margin:7px 0;line-height:1.82;}strong{font-weight:850;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f2f2f2;color:#111;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#f2f2f2;color:#111;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #e0e0e0;margin:32px 0;}'
  },
  medium: {
    name: 'Medium Essay',
    description: '长文观点、个人文章',
    css: 'body{font-family:Georgia,"Times New Roman","Songti SC","Noto Serif CJK SC",SimSun,serif;font-size:16px;line-height:1.92;color:#242424;max-width:680px;margin:0 auto;padding:34px 24px;background:#fff;}h1{font-size:28px;line-height:1.28;font-weight:700;text-align:left;margin:42px 0 28px;color:#111;}h2{font-size:22px;line-height:1.35;font-weight:700;margin:52px 0 18px;color:#111;}h3{font-size:18px;line-height:1.45;font-weight:700;margin:34px 0 12px;color:#333;}p{margin:15px 0;line-height:1.92;}blockquote{margin:28px 0;padding:0 0 0 22px;border-left:3px solid #242424;color:#444;font-size:17px;line-height:1.86;font-style:italic;}ul{margin:15px 0;padding-left:24px;}li{margin:8px 0;line-height:1.9;}strong{font-weight:800;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f2f2f2;color:#222;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#f2f2f2;color:#222;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #d8d8d8;margin:40px auto;width:34%;}'
  }
};

console.log(JSON.stringify(styles, null, 2));
