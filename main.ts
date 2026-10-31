import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, Notice, MarkdownView } from 'obsidian';

interface WeChatPublisherSettings {
	defaultStyle: string;
	autoUpdate: boolean;
}

const DEFAULT_SETTINGS: WeChatPublisherSettings = {
	defaultStyle: 'playful',
	autoUpdate: true
}

// 从 MDSKILL 提取的主题样式
const STYLES = {
  playful: {
    name: '多彩活力',
    description: '高级多彩设计感，融合当代审美',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:17px;line-height:1.9;color:#2c2c2c;max-width:700px;margin:0 auto;padding:56px 48px;background:#fefdfb;}h1{font-family:"Georgia", "Noto Serif SC", serif;font-size:36px;font-weight:700;color:#1a1a1a;margin:0 0 32px;}h2{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:26px;font-weight:700;color:#0066cc;margin:48px 0 20px;border-bottom:2px solid #0066cc;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#1a4d99;margin:30px 0 12px;}p{margin:20px 0;line-height:1.9;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #d4af37;background:#fffbf0;color:#4a4a4a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.9;color:#2c2c2c;}strong{font-weight:bold;color:#1a1a1a;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#c41e3a;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #d4af37;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  default: {
    name: 'GitHub Dark',
    description: '经典 GitHub 暗色主题，适合代码文档',
    css: `body{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:16px;line-height:1.8;color:#d4d4d4;max-width:900px;margin:0 auto;padding:40px;background:#252526;}h1{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:32px;font-weight:700;color:#ffffff;margin:0 0 24px;}h2{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:24px;font-weight:600;color:#e2e8f0;margin:36px 0 16px;border-bottom:2px solid #3e3e42;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#cbd5e1;margin:30px 0 12px;}p{margin:8px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #4fc3f7;background:#1e293b;color:#94a3b8;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#d4d4d4;}strong{font-weight:bold;color:#ffffff;}code{font-family:Consolas,Monaco,monospace;background:#1e1e1e;color:#ce9178;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #3e3e42;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  githubLight: {
    name: 'GitHub Light',
    description: '清爽的亮色主题，护眼舒适',
    css: `body{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:16px;line-height:1.8;color:#333333;max-width:900px;margin:0 auto;padding:40px;background:#ffffff;}h1{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:32px;font-weight:700;color:#1a1a1a;margin:0 0 24px;}h2{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:24px;font-weight:600;color:#1a1a1a;margin:36px 0 16px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #2563eb;background:#f0f7ff;color:#4b5563;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#333333;}strong{font-weight:bold;color:#1a1a1a;}code{font-family:Consolas,Monaco,monospace;background:#f1f5f9;color:#e11d48;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e2e8f0;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  minimal: {
    name: '极简现代',
    description: '极简设计，专注内容',
    css: `body{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:16px;line-height:1.9;color:#374151;max-width:680px;margin:0 auto;padding:48px 32px;background:#fafafa;}h1{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:36px;font-weight:800;color:#111827;margin:0 0 24px;}h2{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:22px;font-weight:600;color:#111827;margin:36px 0 16px;border-bottom:none;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#374151;margin:30px 0 12px;}p{margin:8px 0;line-height:1.9;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #111827;background:#f9fafb;color:#6b7280;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.9;color:#374151;}strong{font-weight:bold;color:#111827;}code{font-family:Consolas,Monaco,monospace;background:#f3f4f6;color:#111827;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e5e7eb;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  magazine: {
    name: '杂志布局',
    description: '杂志风格布局，适合深度报道',
    css: `body{font-family:"Georgia", serif;font-size:17px;line-height:1.9;color:#333333;max-width:740px;margin:0 auto;padding:48px 40px;background:#ffffff;}h1{font-family:"Merriweather", Georgia, serif;font-size:36px;font-weight:900;color:#1a1a1a;margin:0 0 12px;}h2{font-family:"Merriweather", Georgia, serif;font-size:26px;font-weight:700;color:#2c2c2c;margin:44px 0 16px;border-bottom:2px solid #1a1a1a;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#3a3a3a;margin:30px 0 12px;}p{margin:20px 0;line-height:1.9;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #c41e3a;background:#fef2f2;color:#4a4a4a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.9;color:#333333;}strong{font-weight:bold;color:#1a1a1a;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#c41e3a;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #d6d6d6;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  artistic: {
    name: '艺术创意',
    description: '装饰性创意元素，适合设计展示',
    css: `body{font-family:"Quicksand", sans-serif;font-size:16px;line-height:1.85;color:#3d3d3d;max-width:680px;margin:0 auto;padding:52px 44px;background:#f9f7f2;}h1{font-family:"Pacifico", cursive;font-size:34px;font-weight:400;color:#6b5b4e;margin:0 0 28px;}h2{font-family:"Quicksand", sans-serif;font-size:26px;font-weight:600;color:#8b7355;margin:40px 0 18px;border-bottom:none;padding-bottom:8px;}h3{font-size:21px;font-weight:600;color:#a68370;margin:30px 0 12px;}p{margin:18px 0;line-height:1.85;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #c9a575;background:#faf8f3;color:#5a5a5a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.85;color:#3d3d3d;}strong{font-weight:bold;color:#6b5b4e;}code{font-family:Consolas,Monaco,monospace;background:#f0ebe5;color:#8b7355;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e0d5c7;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  wechatElegant: {
    name: '公众号·优雅',
    description: '经典公众号风格，优雅灵动',
    css: `body{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:17px;line-height:1.95;color:#3a3a3a;max-width:640px;margin:0 auto;padding:52px 44px;background:#fefbf7;}h1{font-family:"Noto Serif SC", Georgia, serif;font-size:34px;font-weight:700;color:#2c2c2c;margin:0 0 28px;}h2{font-family:"Noto Serif SC", Georgia, serif;font-size:26px;font-weight:600;color:#9b6b47;margin:44px 0 18px;border-bottom:2px solid #e8d5c4;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#a87555;margin:30px 0 12px;}p{margin:20px 0;line-height:1.95;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #d4a89a;background:#faf6f1;color:#5a5a5a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.95;color:#3a3a3a;}strong{font-weight:bold;color:#2c2c2c;}code{font-family:Consolas,Monaco,monospace;background:#f5f0ea;color:#9b6b47;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e8d5c4;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  nytimes: {
    name: '纽约时报',
    description: '经典报业风格，严谨优雅',
    css: `body{font-family:"Georgia", serif;font-size:18px;line-height:1.95;color:#222222;max-width:680px;margin:0 auto;padding:56px 48px;background:#ffffff;}h1{font-family:"Georgia", "Noto Serif SC", serif;font-size:38px;font-weight:700;color:#000000;margin:0 0 32px;}h2{font-family:"Georgia", serif;font-size:24px;font-weight:700;color:#000000;margin:44px 0 18px;border-bottom:2px solid #cccccc;padding-bottom:8px;}h3{font-size:18px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:18px 0;line-height:1.95;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #999999;background:transparent;color:#666666;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.95;color:#222222;}strong{font-weight:bold;color:#000000;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#333333;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #cccccc;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  wired: {
    name: 'Wired 连线',
    description: '科技媒体风格，色彩鲜明',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:17px;line-height:1.85;color:#1a1a1a;max-width:740px;margin:0 auto;padding:56px 48px;background:#ffffff;}h1{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:40px;font-weight:900;color:#000000;margin:0 0 24px;}h2{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:28px;font-weight:800;color:#0066ff;margin:44px 0 18px;border-bottom:2px solid #0066ff;padding-bottom:8px;}h3{font-size:20px;font-weight:700;color:#1a1a1a;margin:30px 0 12px;}p{margin:18px 0;line-height:1.85;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #0066ff;background:#f0f5ff;color:#333333;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.85;color:#1a1a1a;}strong{font-weight:bold;color:#000000;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#ff6600;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #0066ff;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  medium: {
    name: 'Medium 长文',
    description: '内容平台风格，专注阅读',
    css: `body{font-family:"Charter", Georgia, serif;font-size:18px;line-height:2;color:#36363636;max-width:660px;margin:0 auto;padding:60px 50px;background:#ffffff;}h1{font-family:"Tiempos Headline", Georgia, serif;font-size:38px;font-weight:700;color:#000000;margin:0 0 32px;}h2{font-family:"Tiempos Headline", Georgia, serif;font-size:26px;font-weight:700;color:#000000;margin:48px 0 20px;border-bottom:none;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:24px 0;line-height:2;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #36363636;background:transparent;color:#757575;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:2;color:#36363636;}strong{font-weight:bold;color:#000000;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#d73a49;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e1e4e8;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  anthropic: {
    name: 'Anthropic Claude',
    description: 'AI 时代风格，简洁现代',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:16px;line-height:1.8;color:#2c2c2c;max-width:720px;margin:0 auto;padding:56px 48px;background:#fafafa;}h1{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:36px;font-weight:700;color:#000000;margin:0 0 28px;}h2{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:24px;font-weight:600;color:#1a1a1a;margin:44px 0 18px;border-bottom:2px solid #e5e5e5;padding-bottom:8px;}h3{font-size:18px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:16px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #d0d0d0;background:#f5f5f5;color:#555555;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#2c2c2c;}strong{font-weight:bold;color:#000000;}code{font-family:Consolas,Monaco,monospace;background:#f0f0f0;color:#d9453b;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e5e5e5;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  code: {
    name: '开发者',
    description: '开发者等宽字体，适合技术文档',
    css: `body{font-family:"Fira Code", "Monaco", monospace;font-size:15px;line-height:1.7;color:#d4d4d4;max-width:800px;margin:0 auto;padding:40px 36px;background:#1e1e1e;}h1{font-family:"Fira Code", "Monaco", monospace;font-size:28px;font-weight:700;color:#4ec9b0;margin:0 0 24px;}h2{font-family:"Fira Code", "Monaco", monospace;font-size:22px;font-weight:600;color:#569cd6;margin:36px 0 16px;border-bottom:2px solid #569cd6;padding-bottom:8px;}h3{font-size:18px;font-weight:600;color:#9cdcfe;margin:30px 0 12px;}p{margin:16px 0;line-height:1.7;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #569cd6;background:#2d2d30;color:#9cdcfe;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.7;color:#d4d4d4;}strong{font-weight:bold;color:#dcdcaa;}code{font-family:Consolas,Monaco,monospace;background:#2d2d30;color:#ce9178;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #3e3e42;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  terminal: {
    name: '终端控制台',
    description: '终端控制台美学，适合命令行文档',
    css: `body{font-family:"Courier New", monospace;font-size:15px;line-height:1.6;color:#c0c0c0;max-width:840px;margin:0 auto;padding:32px 28px;background:#0c0c0c;}h1{font-family:"Courier New", monospace;font-size:26px;font-weight:700;color:#00ff00;margin:0 0 20px;}h2{font-family:"Courier New", monospace;font-size:20px;font-weight:700;color:#00ff00;margin:32px 0 14px;border-bottom:none;padding-bottom:8px;}h3{font-size:18px;font-weight:600;color:#00cc00;margin:30px 0 12px;}p{margin:14px 0;line-height:1.6;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #00ff00;background:#1a1a1a;color:#a0a0a0;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.6;color:#c0c0c0;}strong{font-weight:bold;color:#ffffff;}code{font-family:Consolas,Monaco,monospace;background:#1a1a1a;color:#ffff00;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #333333;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  cyberpunk: {
    name: '赛博朋克',
    description: '未来霓虹风格，适合科技前沿内容',
    css: `body{font-family:"Rajdhani", sans-serif;font-size:16px;line-height:1.75;color:#e0e0e0;max-width:720px;margin:0 auto;padding:44px 40px;background:#0a0e27;}h1{font-family:"Orbitron", sans-serif;font-size:32px;font-weight:900;color:#ff00ff;margin:0 0 24px;}h2{font-family:"Orbitron", sans-serif;font-size:24px;font-weight:700;color:#00ffff;margin:40px 0 16px;border-bottom:2px solid #ff00ff;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#00ff00;margin:30px 0 12px;}p{margin:16px 0;line-height:1.75;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #00ffff;background:#1a1f3a;color:#b0b0b0;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.75;color:#e0e0e0;}strong{font-weight:bold;color:#ff00ff;}code{font-family:Consolas,Monaco,monospace;background:#1a1f3a;color:#ff00ff;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #00ffff;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  zen: {
    name: '禅意留白',
    description: '超极简留白设计，适合深度思考',
    css: `body{font-family:"Noto Serif SC", serif;font-size:16px;line-height:2.2;color:#4a4a4a;max-width:600px;margin:0 auto;padding:64px 48px;background:#ffffff;}h1{font-family:"Noto Serif SC", serif;font-size:28px;font-weight:400;color:#2c2c2c;margin:0 0 40px;}h2{font-family:"Noto Serif SC", serif;font-size:22px;font-weight:400;color:#3a3a3a;margin:56px 0 24px;border-bottom:none;padding-bottom:8px;}h3{font-size:18px;font-weight:400;color:#4a4a4a;margin:30px 0 12px;}p{margin:24px 0;line-height:2.2;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #d0d0d0;background:transparent;color:#6a6a6a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:2.2;color:#4a4a4a;}strong{font-weight:bold;color:#2c2c2c;}code{font-family:Consolas,Monaco,monospace;background:#f9f9f9;color:#2c2c2c;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e8e8e8;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  appleLight: {
    name: 'Apple Light',
    description: '纯净亮色，极简无衬线，高级感',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:16px;line-height:1.8;color:#333333;max-width:680px;margin:0 auto;padding:56px 48px;background:#ffffff;}h1{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:32px;font-weight:700;color:#000000;margin:0 0 28px;}h2{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:24px;font-weight:600;color:#1a1a1a;margin:44px 0 16px;border-bottom:2px solid #f5f5f5;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:16px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #d0d0d0;background:#f9f9f9;color:#666666;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#333333;}strong{font-weight:bold;color:#000000;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#d9453b;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e8e8e8;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  appleDark: {
    name: 'Apple Dark',
    description: '深灰暗色，优雅极简，适合夜间阅读',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:16px;line-height:1.8;color:#e5e5e7;max-width:700px;margin:0 auto;padding:56px 48px;background:#1d1d1f;}h1{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:32px;font-weight:700;color:#ffffff;margin:0 0 28px;}h2{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:24px;font-weight:600;color:#f5f5f7;margin:44px 0 16px;border-bottom:2px solid #424245;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#e5e5e7;margin:30px 0 12px;}p{margin:16px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #424245;background:#2a2a2d;color:#a1a1a6;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#e5e5e7;}strong{font-weight:bold;color:#ffffff;}code{font-family:Consolas,Monaco,monospace;background:#2a2a2d;color:#ff9f0a;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #424245;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  appleGray: {
    name: 'Apple Gray',
    description: '中性灰系，SF Pro 风格，专业严谨',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:16px;line-height:1.8;color:#424245;max-width:700px;margin:0 auto;padding:56px 48px;background:#f5f5f7;}h1{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:32px;font-weight:700;color:#1d1d1f;margin:0 0 28px;}h2{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:24px;font-weight:600;color:#424245;margin:44px 0 16px;border-bottom:2px solid #d5d5d7;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#555555;margin:30px 0 12px;}p{margin:16px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #d5d5d7;background:#ffffff;color:#666666;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#424245;}strong{font-weight:bold;color:#1d1d1f;}code{font-family:Consolas,Monaco,monospace;background:#ffffff;color:#d9453b;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #d5d5d7;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  silicon: {
    name: 'Silicon Valley',
    description: '科技感高级风格，适合技术内容',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:16px;line-height:1.8;color:#3a4555;max-width:720px;margin:0 auto;padding:56px 48px;background:#fafbfc;}h1{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:32px;font-weight:700;color:#0a0e27;margin:0 0 28px;}h2{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:24px;font-weight:600;color:#1a2332;margin:44px 0 16px;border-bottom:2px solid #e1e6ed;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#3a4555;margin:30px 0 12px;}p{margin:16px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #0071e3;background:#f0f6ff;color:#5a6b7a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#3a4555;}strong{font-weight:bold;color:#0a0e27;}code{font-family:Consolas,Monaco,monospace;background:#f5f7fa;color:#0071e3;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e1e6ed;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  minimalPro: {
    name: 'Minimal Pro',
    description: '极简升级版，严谨排版，高级感',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:16px;line-height:1.9;color:#374151;max-width:660px;margin:0 auto;padding:60px 50px;background:#ffffff;}h1{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:30px;font-weight:800;color:#111827;margin:0 0 32px;}h2{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:22px;font-weight:700;color:#1f2937;margin:48px 0 20px;border-bottom:none;padding-bottom:8px;}h3{font-size:18px;font-weight:600;color:#374151;margin:30px 0 12px;}p{margin:20px 0;line-height:1.9;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #d1d5db;background:transparent;color:#6b7280;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.9;color:#374151;}strong{font-weight:bold;color:#111827;}code{font-family:Consolas,Monaco,monospace;background:#f3f4f6;color:#111827;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e5e7eb;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  paper: {
    name: '纸质纹理',
    description: '纸质纹理效果，适合传统阅读',
    css: `body{font-family:"Crimson Text", Georgia, serif;font-size:17px;line-height:1.9;color:#3d3426;max-width:680px;margin:0 auto;padding:48px 40px;background:#f4f1ea;}h1{font-family:"Crimson Text", Georgia, serif;font-size:32px;font-weight:600;color:#2c2416;margin:0 0 24px;}h2{font-family:"Crimson Text", Georgia, serif;font-size:24px;font-weight:600;color:#3d3426;margin:40px 0 16px;border-bottom:none;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#4e4436;margin:30px 0 12px;}p{margin:18px 0;line-height:1.9;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #c9b896;background:transparent;color:#5e5446;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.9;color:#3d3426;}strong{font-weight:bold;color:#2c2416;}code{font-family:Consolas,Monaco,monospace;background:#e8e3d6;color:#8b6914;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #d4cdb8;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  novel: {
    name: '小说阅读',
    description: '书籍阅读体验，适合长篇故事',
    css: `body{font-family:"Libre Baskerville", Georgia, serif;font-size:17px;line-height:2;color:#2c2c2c;max-width:640px;margin:0 auto;padding:56px 44px;background:#faf8f3;}h1{font-family:"Libre Baskerville", Georgia, serif;font-size:30px;font-weight:700;color:#1a1a1a;margin:0 0 32px;}h2{font-family:"Libre Baskerville", Georgia, serif;font-size:24px;font-weight:700;color:#2c2c2c;margin:48px 0 20px;border-bottom:none;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#3a3a3a;margin:30px 0 12px;}p{margin:20px 0;line-height:2;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #d4a574;background:transparent;color:#5a5a5a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:2;color:#2c2c2c;}strong{font-weight:bold;color:#1a1a1a;}code{font-family:Consolas,Monaco,monospace;background:#f0ebe3;color:#8b4513;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e0d8cc;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  journal: {
    name: '个人日记',
    description: '个人日记风格，适合随笔记录',
    css: `body{font-family:"Patrick Hand", cursive;font-size:16px;line-height:1.95;color:#3d3d3d;max-width:620px;margin:0 auto;padding:48px 40px;background:#f9f8f6;}h1{font-family:"Dancing Script", cursive;font-size:32px;font-weight:700;color:#4a5046;margin:0 0 28px;}h2{font-family:"Indie Flower", cursive;font-size:24px;font-weight:400;color:#5a6456;margin:40px 0 18px;border-bottom:none;padding-bottom:8px;}h3{font-size:20px;font-weight:400;color:#6b7566;margin:30px 0 12px;}p{margin:18px 0;line-height:1.95;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #95a7b8;background:#f5f4f0;color:#5a5a5a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.95;color:#3d3d3d;}strong{font-weight:bold;color:#4a5046;}code{font-family:Consolas,Monaco,monospace;background:#eef0ee;color:#6b7355;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #d4dde5;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  hischeEditorial: {
    name: 'Hische·编辑部',
    description: '编辑部杂志风格 - 红色经典 + Bodoni 衬线',
    css: `body{font-family:"Crimson Text", Garamond, serif;font-size:17px;line-height:1.8;color:#2c2c2c;max-width:700px;margin:0 auto;padding:20px 20px 50px 20px;background:#fffef9;}h1{font-family:"Bodoni MT", "Didot", "Crimson Text", serif;font-size:32px;font-weight:400;color:#c9302c;margin:0 0 24px;}h2{font-family:"Bodoni MT", "Didot", serif;font-size:26px;font-weight:400;color:#2c2c2c;margin:36px 0 16px;border-bottom:2px solid #c9302c;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #2563eb;background:transparent;color:#2c2c2c;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#2c2c2c;}strong{font-weight:bold;color:#c9302c;}code{font-family:Consolas,Monaco,monospace;background:#f9f9f9;color:#c9302c;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #c9302c;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  wechatNyt: {
    name: '公众号·纽约时报',
    description: '纽约时报经典风格 - 黑白衬线',
    css: `body{font-family:Georgia, "Times New Roman", serif;font-size:18px;line-height:1.8;color:#121212;max-width:680px;margin:0 auto;padding:40px;background:#fff;}h1{font-family:Georgia, "Times New Roman", serif;font-size:42px;font-weight:700;color:#000;margin:0 0 24px;}h2{font-family:Georgia, serif;font-size:32px;font-weight:700;color:#000;margin:36px 0 16px;border-bottom:2px solid #000;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #121212;background:#f7f7f7;color:#121212;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#121212;}strong{font-weight:bold;color:#000;}code{font-family:Consolas,Monaco,monospace;background:#f0f0f0;color:#666;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #ddd;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  wechatApple: {
    name: 'Apple 极简',
    description: 'Apple 设计哲学 - 极简克制',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;font-size:17px;line-height:1.65;color:#86868b;max-width:640px;margin:0 auto;padding:40px;background:#fbfbfd;}h1{font-family:-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;font-size:32px;font-weight:600;color:#1d1d1f;margin:0 0 24px;}h2{font-family:-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif;font-size:26px;font-weight:600;color:#1d1d1f;margin:36px 0 16px;border-bottom:2px solid #d2d2d7;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.65;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid transparent;background:transparent;color:#1d1d1f;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.65;color:#86868b;}strong{font-weight:bold;color:#1d1d1f;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f7;color:#86868b;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #d2d2d7;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  wechatMedium: {
    name: '公众号·Medium',
    description: 'Medium 平台风格 - 优雅阅读',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;font-size:17px;line-height:1.7;color:#242424;max-width:680px;margin:0 auto;padding:40px;background:#fff;}h1{font-family:Georgia, "Times New Roman", serif;font-size:28px;font-weight:700;color:#242424;margin:0 0 24px;}h2{font-family:Georgia, "Times New Roman", serif;font-size:24px;font-weight:700;color:#242424;margin:36px 0 16px;border-bottom:2px solid #e6e6e6;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.7;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #242424;background:transparent;color:#242424;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.7;color:#242424;}strong{font-weight:bold;color:#242424;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#d73a49;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e6e6e6;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  wechatClaude: {
    name: 'Claude AI',
    description: 'Anthropic Claude 风格 - 科技+温暖',
    css: `body{font-family:-apple-system, BlinkMacSystemFont, sans-serif;font-size:17px;line-height:1.8;color:#2b2b2b;max-width:700px;margin:0 auto;padding:40px;background:#faf9f7;}h1{font-family:-apple-system, BlinkMacSystemFont, sans-serif;font-size:32px;font-weight:600;color:#C15F3C;margin:0 0 24px;}h2{font-family:-apple-system, BlinkMacSystemFont, sans-serif;font-size:26px;font-weight:600;color:#C15F3C;margin:36px 0 16px;border-bottom:2px solid #C15F3C;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #C15F3C;background:rgba(193, 95, 60, 0.06);color:#2b2b2b;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#2b2b2b;}strong{font-weight:bold;color:#C15F3C;}code{font-family:Consolas,Monaco,monospace;background:rgba(193, 95, 60, 0.08);color:#C15F3C;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid rgba(193, 95, 60, 0.3);margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  wechatElegantMinimal: {
    name: '优雅简约',
    description: '宋体衬线 + 极简风格',
    css: `body{font-family:"Songti SC", "SimSun", Georgia, serif;font-size:17px;line-height:1.85;color:#444;max-width:720px;margin:0 auto;padding:40px;background:#fff;}h1{font-family:"Songti SC", "SimSun", Georgia, serif;font-size:26px;font-weight:400;color:#1a1a1a;margin:0 0 24px;}h2{font-family:"Songti SC", Georgia, serif;font-size:22px;font-weight:400;color:#2c2c2c;margin:36px 0 16px;border-bottom:none;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.85;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #ccc;background:transparent;color:#666;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.85;color:#444;}strong{font-weight:bold;color:#1a1a1a;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#8b4513;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e0e0e0;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  wechatTech: {
    name: '技术风格',
    description: '蓝绿色调 + 技术感',
    css: `body{font-family:-apple-system, sans-serif;font-size:16px;line-height:1.8;color:#3a3a3a;max-width:740px;margin:0 auto;padding:40px;background:#fff;}h1{font-family:-apple-system, sans-serif;font-size:26px;font-weight:700;color:#1a1a1a;margin:0 0 24px;}h2{font-family:-apple-system, sans-serif;font-size:22px;font-weight:700;color:#1a1a1a;margin:36px 0 16px;border-bottom:2px solid #00a67d;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #2196f3;background:#f5f9fc;color:#555;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#3a3a3a;}strong{font-weight:bold;color:#1a1a1a;}code{font-family:Consolas,Monaco,monospace;background:#ffe6e6;color:#d63031;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #0066cc;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  wechatDeepread: {
    name: '深度阅读',
    description: '深度长文 - 克制设计',
    css: `body{font-family:-apple-system, sans-serif;font-size:17px;line-height:1.8;color:#1a1a1a;max-width:680px;margin:0 auto;padding:40px;background:#fff;}h1{font-family:-apple-system, "SF Pro Text", sans-serif;font-size:26px;font-weight:700;color:#0a0a0a;margin:0 0 24px;}h2{font-family:-apple-system, sans-serif;font-size:22px;font-weight:700;color:#0a0a0a;margin:36px 0 16px;border-bottom:2px solid #e1e4e8;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #0a0a0a;background:#f8f9fa;color:#1a1a1a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#1a1a1a;}strong{font-weight:bold;color:#0a0a0a;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#d73a49;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e1e4e8;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  guardian: {
    name: 'Guardian 卫报',
    description: 'The Guardian 风格 - 蓝黄配色',
    css: `body{font-family:-apple-system, sans-serif;font-size:17px;line-height:1.7;color:#121212;max-width:700px;margin:0 auto;padding:40px;background:#fff;}h1{font-family:-apple-system, sans-serif;font-size:42px;font-weight:700;color:#052962;margin:0 0 24px;}h2{font-family:-apple-system, sans-serif;font-size:32px;font-weight:600;color:#052962;margin:36px 0 16px;border-bottom:2px solid #C70000;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.7;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #C70000;background:#FEC200;color:#052962;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.7;color:#121212;}strong{font-weight:bold;color:#052962;}code{font-family:Consolas,Monaco,monospace;background:#f6f6f6;color:#C70000;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #052962;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  },
  warmDocs: {
    name: '焦橙文档',
    description: '焦橙色 + 温暖文档风格',
    css: `body{font-family:-apple-system, sans-serif;font-size:16px;line-height:1.8;color:#1A1A1A;max-width:700px;margin:0 auto;padding:40px;background:#FAFAF9;}h1{font-family:-apple-system, sans-serif;font-size:28px;font-weight:700;color:#1A1A1A;margin:0 0 24px;}h2{font-family:-apple-system, sans-serif;font-size:22px;font-weight:700;color:#1A1A1A;margin:36px 0 16px;border-bottom:2px solid #C2410C;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:8px 0;line-height:1.8;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #C2410C;background:#FFF7ED;color:#1A1A1A;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.8;color:#1A1A1A;}strong{font-weight:bold;color:#C2410C;}code{font-family:Consolas,Monaco,monospace;background:#F5F5F0;color:#C2410C;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #E5E5E5;margin:30px 0;}table{width:100%;border-collapse:collapse;margin:20px 0;}th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}td{border:1px solid #ddd;padding:10px;text-align:left;}`
  }
};

// 生成了 33 个主题

const VIEW_TYPE_WECHAT_PREVIEW = 'wechat-preview';

class WeChatPreviewView extends ItemView {
	plugin: WeChatPublisherPlugin;
	currentStyle: string;
	previewEl: HTMLElement;
	cachedMarkdown: string = '';
	themeStyleEl: HTMLStyleElement | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: WeChatPublisherPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.currentStyle = plugin.settings.defaultStyle;
	}

	getViewType() {
		return VIEW_TYPE_WECHAT_PREVIEW;
	}

	getDisplayText() {
		return '公众号预览';
	}

	getIcon() {
		return 'smartphone';
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		container.empty();
		container.addClass('wechat-publisher-view');

		// Header
		const header = container.createDiv('wechat-publisher-header');

		// Style selector
		const selector = header.createEl('select', {
			cls: 'wechat-publisher-style-selector'
		});

		Object.entries(STYLES).forEach(([key, style]) => {
			const option = selector.createEl('option', {
				value: key,
				text: `${style.name} - ${style.description}`
			});
			if (key === this.currentStyle) {
				option.selected = true;
			}
		});

		selector.addEventListener('change', () => {
			console.log('[MDskill] 主题切换:', selector.value);
			this.currentStyle = selector.value;
			this.updatePreview();
		});

		// Actions
		const actions = header.createDiv('wechat-publisher-actions');

		const copyBtn = actions.createEl('button', {
			text: '复制到公众号',
			cls: 'wechat-publisher-btn'
		});
		copyBtn.addEventListener('click', () => this.copyToClipboard());

		const exportBtn = actions.createEl('button', {
			text: '导出HTML',
			cls: 'wechat-publisher-btn secondary'
		});
		exportBtn.addEventListener('click', () => this.exportHTML());

		// Preview
		const previewContainer = container.createDiv('wechat-publisher-preview');
		this.previewEl = previewContainer.createDiv('wechat-publisher-preview-content');

		// 监听文件切换和编辑
		this.registerEvent(
			this.app.workspace.on('active-leaf-change', () => {
				this.cacheCurrentMarkdown();
				this.updatePreview();
			})
		);

		this.registerEvent(
			this.app.workspace.on('editor-change', () => {
				if (this.plugin.settings.autoUpdate) {
					this.cacheCurrentMarkdown();
					this.updatePreview();
				}
			})
		);

		this.cacheCurrentMarkdown();
		this.updatePreview();
	}

	async onClose() {
		// 清理：移除动态注入的样式
		if (this.themeStyleEl) {
			this.themeStyleEl.remove();
			this.themeStyleEl = null;
		}
	}

	cacheCurrentMarkdown() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (activeView) {
			this.cachedMarkdown = activeView.editor.getValue();
		}
	}

	async updatePreview() {
		// 优先使用缓存的 markdown，避免切换主题时丢失内容
		if (!this.cachedMarkdown) {
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!activeView) {
				this.previewEl.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">请打开一个 Markdown 文件</p>';
				return;
			}
			this.cachedMarkdown = activeView.editor.getValue();
		}

		console.log('[MDskill] 更新预览, 当前主题:', this.currentStyle);

		const style = STYLES[this.currentStyle as keyof typeof STYLES];
		if (!style) {
			this.previewEl.innerHTML = '<p>未找到样式</p>';
			return;
		}

		// 关键改变：将样式注入到 document.head 而不是容器内
		// 移除旧的主题样式
		if (this.themeStyleEl) {
			this.themeStyleEl.remove();
		}

		// 创建新的主题样式并添加到 head（使用标准 DOM API，不是 Obsidian 的 createEl）
		this.themeStyleEl = document.createElement('style');
		this.themeStyleEl.id = 'mdskill-theme-style';
		document.head.appendChild(this.themeStyleEl);

		// 作用域化 CSS
		let scopedCSS = style.css
			.replace(/body\s*\{/g, '.mdskill-preview {')
			.replace(/\}h1\s*\{/g, '}.mdskill-preview h1 {')
			.replace(/\}h2\s*\{/g, '}.mdskill-preview h2 {')
			.replace(/\}h3\s*\{/g, '}.mdskill-preview h3 {')
			.replace(/\}h4\s*\{/g, '}.mdskill-preview h4 {')
			.replace(/\}h5\s*\{/g, '}.mdskill-preview h5 {')
			.replace(/\}h6\s*\{/g, '}.mdskill-preview h6 {')
			.replace(/\}p\s*\{/g, '}.mdskill-preview p {')
			.replace(/\}blockquote\s*\{/g, '}.mdskill-preview blockquote {')
			.replace(/\}code\s*\{/g, '}.mdskill-preview code {')
			.replace(/\}pre\s*\{/g, '}.mdskill-preview pre {')
			.replace(/\}ul\s*\{/g, '}.mdskill-preview ul {')
			.replace(/\}ol\s*\{/g, '}.mdskill-preview ol {')
			.replace(/\}li\s*\{/g, '}.mdskill-preview li {')
			.replace(/\}a\s*\{/g, '}.mdskill-preview a {')
			.replace(/\}img\s*\{/g, '}.mdskill-preview img {')
			.replace(/\}hr\s*\{/g, '}.mdskill-preview hr {')
			.replace(/\}strong\s*\{/g, '}.mdskill-preview strong {')
			.replace(/\}em\s*\{/g, '}.mdskill-preview em {')
			.replace(/\}table\s*\{/g, '}.mdskill-preview table {')
			.replace(/\}th\s*\{/g, '}.mdskill-preview th {')
			.replace(/\}td\s*\{/g, '}.mdskill-preview td {');

		// 添加 !important 强制覆盖
		scopedCSS = scopedCSS.replace(/(color|font-size|font-family|line-height|border-bottom|background|padding|margin|font-weight|border|border-collapse|width|text-align):\s*([^;]+);/g, '$1:$2 !important;');

		this.themeStyleEl.textContent = scopedCSS;
		console.log('[MDskill] ✅ 已将样式注入到 document.head，CSS 长度:', scopedCSS.length);

		// 更新内容容器
		this.previewEl.empty();
		const contentDiv = this.previewEl.createDiv('mdskill-preview');
		const htmlContent = this.convertMarkdownToHTMLOnly(this.cachedMarkdown);
		contentDiv.innerHTML = htmlContent;

		console.log('[MDskill] ✅ 预览更新完成');

		// 自检：验证样式是否真的应用了
		setTimeout(() => {
			const styleInHead = document.getElementById('mdskill-theme-style');
			if (!styleInHead) {
				console.error('[MDskill] ❌ 自检失败：document.head 中找不到样式标签！');
				return;
			}
			console.log('[MDskill] ✅ 自检通过：样式标签在 head 中');

			const h2 = contentDiv.querySelector('h2');
			if (h2) {
				const computed = window.getComputedStyle(h2);
				console.log('[MDskill] 📊 H2 实际样式:');
				console.log('  - color:', computed.color);
				console.log('  - font-size:', computed.fontSize);
				console.log('  - font-family:', computed.fontFamily.substring(0, 50));
				console.log('  - border-bottom:', computed.borderBottom);
				console.log('  - font-weight:', computed.fontWeight);

				// 检查样式是否被应用（不是默认值）
				const fontSize = parseFloat(computed.fontSize);
				if (fontSize < 18 || fontSize > 30) {
					console.warn('[MDskill] ⚠️ H2 字体大小异常:', fontSize, 'px（预期 18-30px）');
					console.warn('[MDskill] 可能原因：主题样式被全局样式覆盖');
				} else {
					console.log('[MDskill] ✅ 样式应用成功！字体大小正常:', fontSize, 'px');
				}
			}
		}, 100);
	}

	convertMarkdownToHTMLOnly(markdown: string): string {
		// 只返回 HTML 内容，不包含 style 标签
		let html = '';
		const lines = markdown.split('\n');
		let inList = false;
		let inOrderedList = false;
		let inCodeBlock = false;
		let inTable = false;
		let codeBlockContent: string[] = [];
		let codeBlockLang = '';
		let listItems: string[] = [];
		let tableRows: string[] = [];
		let tableHeaders: string[] = [];

		const flushList = () => {
			if (listItems.length > 0) {
				if (inOrderedList) {
					html += '<ol>' + listItems.join('') + '</ol>';
				} else {
					html += '<ul>' + listItems.join('') + '</ul>';
				}
				listItems = [];
			}
			inList = false;
			inOrderedList = false;
		};

		const flushCodeBlock = () => {
			if (codeBlockContent.length > 0) {
				const codeText = this.escapeHTML(codeBlockContent.join('\n'));
				html += '<pre><code' + (codeBlockLang ? ' class="language-' + codeBlockLang + '"' : '') + '>' + codeText + '</code></pre>';
				codeBlockContent = [];
				codeBlockLang = '';
			}
			inCodeBlock = false;
		};

		const flushTable = () => {
			if (tableHeaders.length > 0 || tableRows.length > 0) {
				html += '<table>';
				if (tableHeaders.length > 0) {
					html += '<thead><tr>';
					tableHeaders.forEach(header => {
						html += '<th>' + this.processInline(header.trim()) + '</th>';
					});
					html += '</tr></thead>';
				}
				if (tableRows.length > 0) {
					html += '<tbody>';
					tableRows.forEach(row => {
						html += '<tr>';
						row.split('|').slice(1, -1).forEach(cell => {
							html += '<td>' + this.processInline(cell.trim()) + '</td>';
						});
						html += '</tr>';
					});
					html += '</tbody>';
				}
				html += '</table>';
				tableHeaders = [];
				tableRows = [];
			}
			inTable = false;
		};

		const isTableRow = (line: string): boolean => {
			return line.trim().startsWith('|') && line.trim().endsWith('|');
		};

		const isTableDelimiter = (line: string): boolean => {
			return /^\|[\s:-]+\|/.test(line.trim());
		};

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// Code block start/end
			if (line.startsWith('```')) {
				if (inCodeBlock) {
					flushCodeBlock();
				} else {
					flushList();
					flushTable();
					inCodeBlock = true;
					codeBlockLang = line.substring(3).trim();
				}
				continue;
			}

			// Inside code block
			if (inCodeBlock) {
				codeBlockContent.push(line);
				continue;
			}

			// Table detection
			if (isTableRow(line)) {
				// Check if next line is delimiter (header separator)
				if (i + 1 < lines.length && isTableDelimiter(lines[i + 1])) {
					// This is a table header
					flushList();
					flushTable();
					inTable = true;
					tableHeaders = line.split('|').slice(1, -1);
					i++; // Skip the delimiter line
					continue;
				} else if (inTable) {
					// This is a table row
					tableRows.push(line);
					continue;
				}
			} else if (inTable) {
				// End of table
				flushTable();
			}

			// H1
			if (line.startsWith('# ')) {
				flushList();
				flushTable();
				html += '<h1>' + this.processInline(line.substring(2)) + '</h1>';
				continue;
			}

			// H2
			if (line.startsWith('## ')) {
				flushList();
				flushTable();
				html += '<h2>' + this.processInline(line.substring(3)) + '</h2>';
				continue;
			}

			// H3
			if (line.startsWith('### ')) {
				flushList();
				flushTable();
				html += '<h3>' + this.processInline(line.substring(4)) + '</h3>';
				continue;
			}

			// H4
			if (line.startsWith('#### ')) {
				flushList();
				flushTable();
				html += '<h4>' + this.processInline(line.substring(5)) + '</h4>';
				continue;
			}

			// H5
			if (line.startsWith('##### ')) {
				flushList();
				flushTable();
				html += '<h5>' + this.processInline(line.substring(6)) + '</h5>';
				continue;
			}

			// H6
			if (line.startsWith('###### ')) {
				flushList();
				flushTable();
				html += '<h6>' + this.processInline(line.substring(7)) + '</h6>';
				continue;
			}

			// Blockquote
			if (line.startsWith('> ')) {
				flushList();
				flushTable();
				html += '<blockquote>' + this.processInline(line.substring(2)) + '</blockquote>';
				continue;
			}

			// Ordered list
			if (line.match(/^\d+\.\s+/)) {
				flushTable();
				const content = line.replace(/^\d+\.\s+/, '');
				listItems.push('<li>' + this.processInline(content) + '</li>');
				inList = true;
				inOrderedList = true;
				continue;
			}

			// Unordered list
			if (line.match(/^[-*+]\s+/)) {
				flushTable();
				// Flush ordered list if we were in one
				if (inOrderedList) {
					flushList();
				}
				const content = line.replace(/^[-*+]\s+/, '');
				listItems.push('<li>' + this.processInline(content) + '</li>');
				inList = true;
				continue;
			}

			// HR
			if (line.match(/^[-*_]{3,}$/)) {
				flushList();
				flushTable();
				html += '<hr>';
				continue;
			}

			// Empty line
			if (line.trim() === '') {
				flushList();
				flushTable();
				continue;
			}

			// Paragraph
			flushList();
			flushTable();
			html += '<p>' + this.processInline(line) + '</p>';
		}

		flushList();
		flushCodeBlock();
		flushTable();
		return html;
	}


	processInline(text: string): string {
		// First escape HTML to prevent XSS
		text = this.escapeHTML(text);

		// Then apply markdown formatting in order
		// Bold and Italic combined (***text***)
		text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');

		// Bold (**text** or __text__)
		text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
		text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

		// Italic (*text* or _text_)
		text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
		text = text.replace(/_(.+?)_/g, '<em>$1</em>');

		// Strikethrough (~~text~~)
		text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');

		// Inline code (`code`)
		text = text.replace(/`(.+?)`/g, '<code>$1</code>');

		// Links [text](url)
		text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

		// Images ![alt](url)
		text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

		return text;
	}

	escapeHTML(text: string): string {
		const map: {[key: string]: string} = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, (m) => map[m]);
	}

	async copyToClipboard() {
		if (!this.cachedMarkdown) {
			new Notice('没有可复制的内容');
			return;
		}

		const style = STYLES[this.currentStyle as keyof typeof STYLES];
		if (!style) {
			new Notice('未找到样式');
			return;
		}

		// 生成带 style 标签的完整 HTML
		const htmlContent = this.convertMarkdownToHTMLOnly(this.cachedMarkdown);
		const scopedCSS = style.css
			.replace(/body\s*\{/g, '.mdskill-preview {')
			.replace(/\bh1\s*\{/g, '.mdskill-preview h1 {')
			.replace(/\bh2\s*\{/g, '.mdskill-preview h2 {')
			.replace(/\bh3\s*\{/g, '.mdskill-preview h3 {')
			.replace(/\bh4\s*\{/g, '.mdskill-preview h4 {')
			.replace(/\bh5\s*\{/g, '.mdskill-preview h5 {')
			.replace(/\bh6\s*\{/g, '.mdskill-preview h6 {')
			.replace(/\bp\s*\{/g, '.mdskill-preview p {')
			.replace(/\bblockquote\s*\{/g, '.mdskill-preview blockquote {')
			.replace(/\bcode\s*\{/g, '.mdskill-preview code {')
			.replace(/\bpre\s*\{/g, '.mdskill-preview pre {')
			.replace(/\bul\s*\{/g, '.mdskill-preview ul {')
			.replace(/\bol\s*\{/g, '.mdskill-preview ol {')
			.replace(/\bli\s*\{/g, '.mdskill-preview li {')
			.replace(/\ba\s*\{/g, '.mdskill-preview a {')
			.replace(/\bimg\s*\{/g, '.mdskill-preview img {')
			.replace(/\bhr\s*\{/g, '.mdskill-preview hr {')
			.replace(/\bstrong\s*\{/g, '.mdskill-preview strong {')
			.replace(/\bem\s*\{/g, '.mdskill-preview em {')
			.replace(/\btable\s*\{/g, '.mdskill-preview table {')
			.replace(/\bth\s*\{/g, '.mdskill-preview th {')
			.replace(/\btd\s*\{/g, '.mdskill-preview td {');

		const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>微信公众号</title>
<style>${scopedCSS}</style>
</head>
<body>
<div class="mdskill-preview">${htmlContent}</div>
</body>
</html>`;

		try {
			await navigator.clipboard.writeText(fullHTML);
			new Notice('✓ 已复制到剪贴板，可直接粘贴到公众号编辑器');
		} catch (err) {
			new Notice('复制失败：' + err);
		}
	}

	async exportHTML() {
		if (!this.cachedMarkdown) {
			new Notice('没有可导出的内容');
			return;
		}

		const style = STYLES[this.currentStyle as keyof typeof STYLES];
		if (!style) {
			new Notice('未找到样式');
			return;
		}

		// 生成带 style 标签的完整 HTML
		const htmlContent = this.convertMarkdownToHTMLOnly(this.cachedMarkdown);
		const scopedCSS = style.css
			.replace(/body\s*\{/g, '.mdskill-preview {')
			.replace(/\bh1\s*\{/g, '.mdskill-preview h1 {')
			.replace(/\bh2\s*\{/g, '.mdskill-preview h2 {')
			.replace(/\bh3\s*\{/g, '.mdskill-preview h3 {')
			.replace(/\bh4\s*\{/g, '.mdskill-preview h4 {')
			.replace(/\bh5\s*\{/g, '.mdskill-preview h5 {')
			.replace(/\bh6\s*\{/g, '.mdskill-preview h6 {')
			.replace(/\bp\s*\{/g, '.mdskill-preview p {')
			.replace(/\bblockquote\s*\{/g, '.mdskill-preview blockquote {')
			.replace(/\bcode\s*\{/g, '.mdskill-preview code {')
			.replace(/\bpre\s*\{/g, '.mdskill-preview pre {')
			.replace(/\bul\s*\{/g, '.mdskill-preview ul {')
			.replace(/\bol\s*\{/g, '.mdskill-preview ol {')
			.replace(/\bli\s*\{/g, '.mdskill-preview li {')
			.replace(/\ba\s*\{/g, '.mdskill-preview a {')
			.replace(/\bimg\s*\{/g, '.mdskill-preview img {')
			.replace(/\bhr\s*\{/g, '.mdskill-preview hr {')
			.replace(/\bstrong\s*\{/g, '.mdskill-preview strong {')
			.replace(/\bem\s*\{/g, '.mdskill-preview em {')
			.replace(/\btable\s*\{/g, '.mdskill-preview table {')
			.replace(/\bth\s*\{/g, '.mdskill-preview th {')
			.replace(/\btd\s*\{/g, '.mdskill-preview td {');

		const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>微信公众号</title>
<style>${scopedCSS}</style>
</head>
<body>
<div class="mdskill-preview">${htmlContent}</div>
</body>
</html>`;

		const blob = new Blob([fullHTML], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `wechat-${Date.now()}.html`;
		a.click();
		URL.revokeObjectURL(url);

		new Notice('✓ HTML 文件已下载');
	}
}

export default class WeChatPublisherPlugin extends Plugin {
	settings: WeChatPublisherSettings;

	async onload() {
		await this.loadSettings();

		// Register view
		this.registerView(
			VIEW_TYPE_WECHAT_PREVIEW,
			(leaf) => new WeChatPreviewView(leaf, this)
		);

		// Add ribbon icon
		this.addRibbonIcon('smartphone', '公众号预览', () => {
			this.activateView();
		});

		// Add command
		this.addCommand({
			id: 'open-wechat-preview',
			name: '打开公众号预览',
			callback: () => {
				this.activateView();
			}
		});

		// Add settings tab
		this.addSettingTab(new WeChatPublisherSettingTab(this.app, this));
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf = workspace.getLeavesOfType(VIEW_TYPE_WECHAT_PREVIEW)[0];

		if (!leaf) {
			const rightLeaf = workspace.getRightLeaf(false);
			if (rightLeaf) {
				await rightLeaf.setViewState({
					type: VIEW_TYPE_WECHAT_PREVIEW,
					active: true,
				});
				leaf = rightLeaf;
			}
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_WECHAT_PREVIEW);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class WeChatPublisherSettingTab extends PluginSettingTab {
	plugin: WeChatPublisherPlugin;

	constructor(app: App, plugin: WeChatPublisherPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Obsidian-MDskill 设置'});

		new Setting(containerEl)
			.setName('默认样式')
			.setDesc('选择打开预览时的默认样式')
			.addDropdown(dropdown => {
				Object.entries(STYLES).forEach(([key, style]) => {
					dropdown.addOption(key, style.name);
				});
				dropdown
					.setValue(this.plugin.settings.defaultStyle)
					.onChange(async (value) => {
						this.plugin.settings.defaultStyle = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('自动更新预览')
			.setDesc('编辑时自动刷新预览（关闭可提升性能）')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoUpdate)
				.onChange(async (value) => {
					this.plugin.settings.autoUpdate = value;
					await this.plugin.saveSettings();
				}));
	}
}
