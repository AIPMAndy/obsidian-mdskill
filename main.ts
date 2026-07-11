import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, Notice, MarkdownView } from 'obsidian';

interface WeChatPublisherSettings {
	defaultStyle: string;
	autoUpdate: boolean;
}

const DEFAULT_SETTINGS: WeChatPublisherSettings = {
	defaultStyle: 'minimal',
	autoUpdate: true
}

const STYLES = {
	minimal: {
		name: '极简黑白',
		description: '默认款、深度文章、方法论、诊断报告',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.82;color:#2b2b2b;max-width:740px;margin:0 auto;padding:24px 22px;background:#fff;}h1{font-size:24px;line-height:1.35;font-weight:800;text-align:left;margin:34px 0 24px;color:#111;padding-bottom:16px;border-bottom:1px solid #111;}h2{font-size:19px;line-height:1.45;font-weight:800;margin:42px 0 14px;color:#111;}h2:before{content:"";display:block;width:30px;height:3px;background:#111;margin:0 0 12px;}h3{font-size:17px;line-height:1.5;font-weight:760;margin:30px 0 10px;color:#222;}p{margin:12px 0;line-height:1.82;}blockquote{margin:20px 0;padding:13px 16px;border-left:3px solid #111;background:#f7f7f7;color:#555;font-style:normal;}ul{margin:12px 0;padding-left:20px;}li{margin:7px 0;line-height:1.82;}strong{font-weight:850;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f2f2f2;color:#111;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#f2f2f2;color:#111;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #e0e0e0;margin:32px 0;}`
	},
	medium: {
		name: 'Medium Essay',
		description: '个人观点、深度长文、方法论文章',
		css: `body{font-family:Georgia,"Times New Roman","Songti SC","Noto Serif CJK SC",SimSun,serif;font-size:16px;line-height:1.92;color:#242424;max-width:680px;margin:0 auto;padding:34px 24px;background:#fff;}h1{font-size:28px;line-height:1.28;font-weight:700;text-align:left;margin:42px 0 28px;color:#111;}h2{font-size:22px;line-height:1.35;font-weight:700;margin:52px 0 18px;color:#111;}h3{font-size:18px;line-height:1.45;font-weight:700;margin:34px 0 12px;color:#333;}p{margin:15px 0;line-height:1.92;}blockquote{margin:28px 0;padding:0 0 0 22px;border-left:3px solid #242424;color:#444;font-size:17px;line-height:1.86;font-style:italic;}ul{margin:15px 0;padding-left:24px;}li{margin:8px 0;line-height:1.9;}strong{font-weight:800;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f2f2f2;color:#222;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#f2f2f2;color:#222;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #d8d8d8;margin:40px auto;width:34%;}`
	},
	wired: {
		name: 'WIRED Feature',
		description: 'AI、科技观点、产品发布、前沿趋势',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.74;color:#111;max-width:750px;margin:0 auto;padding:22px;background:#fff;}h1{font-size:28px;line-height:1.16;font-weight:950;text-align:left;margin:36px 0 26px;color:#111;border-top:6px solid #111;border-bottom:6px solid #111;padding:16px 0;}h2{font-size:20px;line-height:1.35;font-weight:950;margin:44px 0 14px;color:#111;background:#f5ff00;padding:10px 12px;}h3{font-size:18px;line-height:1.4;font-weight:900;margin:32px 0 10px;color:#111;text-decoration:underline;text-decoration-thickness:4px;text-decoration-color:#00e5ff;text-underline-offset:5px;}p{margin:12px 0;line-height:1.74;}blockquote{margin:22px 0;padding:15px 16px;background:#111;color:#fff;border-left:0;font-weight:750;font-style:normal;}ul{margin:12px 0;padding-left:0;list-style:none;}li{margin:8px 0;line-height:1.72;padding:8px 10px;background:#f2f2f2;border-left:5px solid #111;}strong{font-weight:950;color:#111;background:#f5ff00;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#111;color:#00e5ff;padding:2px 6px;border-radius:0;font-size:14px;}pre{background:#111;color:#00e5ff;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;color:inherit;}hr{border:none;height:5px;background:#111;margin:34px 0;}`
	},
	verge: {
		name: 'The Verge Briefing',
		description: '热点解读、产品更新、资讯评论',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.76;color:#171717;max-width:750px;margin:0 auto;padding:22px;background:#fff7fb;}h1{font-size:27px;line-height:1.2;font-weight:950;text-align:left;margin:36px 0 24px;color:#fff;background:#111;padding:18px 16px;box-shadow:8px 8px 0 #ff4fd8;}h2{font-size:20px;line-height:1.35;font-weight:900;margin:44px 0 14px;color:#111;padding:10px 12px;background:#bcff2f;}h3{font-size:18px;line-height:1.42;font-weight:880;margin:32px 0 10px;color:#111;border-bottom:3px solid #ff4fd8;padding-bottom:6px;}p{margin:12px 0;line-height:1.76;}blockquote{margin:22px 0;padding:14px 16px;border:3px solid #111;background:#fff;color:#111;font-weight:700;font-style:normal;}ul{margin:12px 0;padding-left:0;list-style:none;}li{margin:8px 0;line-height:1.74;padding:9px 10px;background:#fff;border-left:5px solid #ff4fd8;}strong{font-weight:950;color:#111;background:#bcff2f;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#111;color:#bcff2f;padding:2px 6px;border-radius:0;font-size:14px;}pre{background:#111;color:#bcff2f;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;color:inherit;}hr{border:none;height:3px;background:#ff4fd8;margin:34px 0;width:70%;}`
	},
	stripe: {
		name: 'Stripe Docs',
		description: '教程、工具说明、Agent 工作流文档',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.78;color:#2a2f45;max-width:760px;margin:0 auto;padding:24px 22px;background:#fbfcff;}h1{font-size:25px;line-height:1.32;font-weight:850;text-align:left;margin:36px 0 24px;color:#0a2540;}h2{font-size:19px;line-height:1.45;font-weight:820;margin:42px 0 14px;color:#0a2540;padding:10px 12px;background:#f1f5ff;border-left:4px solid #635bff;}h3{font-size:17px;line-height:1.5;font-weight:780;margin:30px 0 10px;color:#425466;}p{margin:12px 0;line-height:1.78;}blockquote{margin:20px 0;padding:14px 16px;background:#fff;border:1px solid #d9e2f3;border-left:4px solid #635bff;color:#3c4257;font-style:normal;}ul{margin:12px 0;padding-left:0;list-style:none;counter-reset:item;}li{margin:8px 0;line-height:1.76;padding:9px 10px;background:#fff;border:1px solid #e5ebf5;}li:before{counter-increment:item;content:"0" counter(item) " ";font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;font-size:12px;color:#635bff;font-weight:800;}strong{font-weight:850;color:#0a2540;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#eef2ff;color:#3b35a8;padding:2px 6px;border-radius:4px;font-size:14px;}pre{background:#eef2ff;color:#3b35a8;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #d9e2f3;margin:32px 0;}`
	},
	apple: {
		name: 'Apple Newsroom',
		description: '正式公告、产品介绍、品牌文章',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.82;color:#1d1d1f;max-width:730px;margin:0 auto;padding:34px 24px;background:#fff;}h1{font-size:30px;line-height:1.16;font-weight:800;text-align:center;margin:42px 0 30px;color:#1d1d1f;}h2{font-size:21px;line-height:1.42;font-weight:750;margin:48px 0 16px;color:#1d1d1f;text-align:center;}h3{font-size:18px;line-height:1.5;font-weight:700;margin:32px 0 10px;color:#424245;}p{margin:13px 0;line-height:1.82;}blockquote{margin:22px 0;padding:16px 18px;background:#f5f5f7;border-left:0;color:#424245;border-radius:10px;font-style:normal;}ul{margin:13px 0;padding-left:22px;}li{margin:7px 0;line-height:1.82;}strong{font-weight:800;color:#1d1d1f;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f5f5f7;color:#1d1d1f;padding:2px 6px;border-radius:5px;font-size:14px;}pre{background:#f5f5f7;color:#1d1d1f;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;border-radius:10px;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #d2d2d7;margin:36px auto;width:42%;}`
	},
	ft: {
		name: 'FT Analysis',
		description: '商业分析、市场判断、对标研究',
		css: `body{font-family:Georgia,"Times New Roman","Songti SC","Noto Serif CJK SC",SimSun,serif;font-size:16px;line-height:1.9;color:#262018;max-width:740px;margin:0 auto;padding:24px 22px;background:#fff1df;}h1{font-size:27px;line-height:1.3;font-weight:800;text-align:left;margin:38px 0 24px;color:#111;border-bottom:3px double #5a4a36;padding-bottom:14px;}h2{font-size:21px;line-height:1.42;font-weight:800;margin:46px 0 16px;color:#3b2b1d;padding-top:10px;border-top:1px solid #8a7356;}h3{font-size:18px;line-height:1.5;font-weight:750;margin:32px 0 10px;color:#4c3a29;}p{margin:13px 0;line-height:1.9;}blockquote{margin:22px 0;padding:12px 0 12px 18px;border-left:4px solid #8a7356;color:#4f4030;background:#f9e6cf;font-style:normal;}ul{margin:13px 0;padding-left:22px;}li{margin:7px 0;line-height:1.9;}strong{font-weight:850;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f5dec4;color:#3b2b1d;padding:2px 6px;border-radius:2px;font-size:14px;}pre{background:#f5dec4;color:#3b2b1d;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #8a7356;margin:34px 0;width:58%;}`
	},
	linear: {
		name: 'Linear Changelog',
		description: '版本公告、功能更新、路线图说明',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.76;color:#d7d7e1;max-width:750px;margin:0 auto;padding:24px 22px;background:#111114;}h1{font-size:25px;line-height:1.32;font-weight:850;text-align:left;margin:36px 0 24px;color:#fff;}h2{font-size:19px;line-height:1.45;font-weight:820;margin:40px 0 14px;color:#fff;padding:10px 0;border-bottom:1px solid #2b2b33;}h2:before{content:"◆ ";color:#8b5cf6;}h3{font-size:17px;line-height:1.5;font-weight:780;margin:30px 0 10px;color:#c4b5fd;}p{margin:12px 0;line-height:1.76;}blockquote{margin:20px 0;padding:14px 16px;background:#19191f;border:1px solid #2b2b33;color:#d7d7e1;font-style:normal;}ul{margin:12px 0;padding-left:0;list-style:none;}li{margin:8px 0;line-height:1.74;padding:9px 10px;background:#17171c;border-left:3px solid #8b5cf6;}strong{font-weight:850;color:#fff;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#242432;color:#c4b5fd;padding:2px 6px;border-radius:4px;font-size:14px;}pre{background:#242432;color:#c4b5fd;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #2b2b33;margin:32px 0;}`
	},
	github: {
		name: 'GitHub README',
		description: '安装说明、工具介绍、技术文档',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.76;color:#24292f;max-width:760px;margin:0 auto;padding:24px 22px;background:#fff;}h1{font-size:26px;line-height:1.28;font-weight:750;text-align:left;margin:36px 0 22px;color:#24292f;padding-bottom:10px;border-bottom:1px solid #d0d7de;}h2{font-size:20px;line-height:1.45;font-weight:700;margin:38px 0 14px;color:#24292f;padding-bottom:8px;border-bottom:1px solid #d8dee4;}h3{font-size:17px;line-height:1.5;font-weight:700;margin:28px 0 10px;color:#24292f;}p{margin:11px 0;line-height:1.76;}blockquote{margin:18px 0;padding:8px 16px;border-left:4px solid #d0d7de;color:#57606a;background:#fff;font-style:normal;}ul{margin:12px 0;padding-left:24px;}li{margin:6px 0;line-height:1.76;}strong{font-weight:750;color:#24292f;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f6f8fa;color:#24292f;padding:2px 6px;border-radius:4px;font-size:14px;}pre{background:#f6f8fa;color:#24292f;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #d0d7de;margin:28px 0;}`
	},
	notion: {
		name: 'Notion Memo',
		description: '学习笔记、内部总结、项目复盘',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.82;color:#37352f;max-width:720px;margin:0 auto;padding:28px 24px;background:#fffefc;}h1{font-size:27px;line-height:1.28;font-weight:780;text-align:left;margin:38px 0 24px;color:#37352f;}h2{font-size:20px;line-height:1.45;font-weight:720;margin:42px 0 14px;color:#37352f;background:#f7f6f3;padding:10px 12px;}h3{font-size:17px;line-height:1.5;font-weight:720;margin:30px 0 10px;color:#37352f;}p{margin:12px 0;line-height:1.82;}blockquote{margin:20px 0;padding:12px 16px;border-left:3px solid #9b9a97;background:#f7f6f3;color:#4f4d48;font-style:normal;}ul{margin:12px 0;padding-left:22px;}li{margin:7px 0;line-height:1.82;}strong{font-weight:800;color:#37352f;background:#fff2cc;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f1f1ef;color:#37352f;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#f1f1ef;color:#37352f;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #e7e6e2;margin:32px 0;}`
	},
	magazine: {
		name: 'Magazine Feature',
		description: '人物稿、品牌故事、深度专题',
		css: `body{font-family:Georgia,"Times New Roman","Songti SC","Noto Serif CJK SC",SimSun,serif;font-size:16px;line-height:1.94;color:#282828;max-width:700px;margin:0 auto;padding:30px 24px;background:#fff;}h1{font-size:28px;line-height:1.3;font-weight:700;text-align:center;margin:42px 0 30px;color:#111;}h1:after{content:"";display:block;width:46px;height:1px;background:#111;margin:20px auto 0;}h2{font-size:21px;line-height:1.45;font-weight:700;margin:50px 0 18px;color:#111;text-align:center;}h3{font-size:18px;line-height:1.5;font-weight:700;margin:34px 0 12px;color:#333;text-align:center;}p{margin:15px 0;line-height:1.94;}blockquote{margin:26px 0;padding:0 22px;border-left:0;color:#555;font-size:15px;line-height:1.95;text-align:center;font-style:italic;}blockquote:before{content:"“";display:block;font-size:38px;line-height:0.9;color:#a0a0a0;}ul{margin:15px 0;padding-left:22px;}li{margin:8px 0;line-height:1.92;}strong{font-weight:800;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f3f3f3;color:#222;padding:2px 6px;border-radius:2px;font-size:14px;}pre{background:#f3f3f3;color:#222;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #bdbdbd;margin:36px auto;width:46%;}`
	},
	editorial: {
		name: 'Editorial Column',
		description: '创作者手记、观点随笔、复盘札记',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.92;color:#252525;max-width:680px;margin:0 auto;padding:28px 24px;background:#fff;}h1{font-size:25px;line-height:1.42;font-weight:650;text-align:left;margin:38px 0 24px;color:#111;}h2{font-size:19px;line-height:1.5;font-weight:700;margin:46px 0 16px;color:#111;}h2:before{content:"";display:block;width:34px;height:2px;background:#111;margin:0 0 12px;}h3{font-size:17px;line-height:1.55;font-weight:700;margin:32px 0 12px;color:#333;}p{margin:14px 0;line-height:1.92;}blockquote{margin:22px 0;padding:0 0 0 18px;border-left:2px solid #222;color:#4f4f4f;font-size:15px;line-height:1.9;font-style:normal;}ul{margin:14px 0;padding-left:20px;}li{margin:7px 0;line-height:1.9;}strong{font-weight:800;color:#111;background:linear-gradient(transparent 62%,#eeeeee 0);}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f5f5f5;color:#222;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#f5f5f5;color:#222;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #e0e0e0;margin:34px 0;}`
	},
	newspaper: {
		name: 'Newspaper Report',
		description: '调查稿、商业报道、严肃分析',
		css: `body{font-family:"Songti SC","Noto Serif CJK SC",Georgia,"Times New Roman",SimSun,serif;font-size:16px;line-height:1.88;color:#202020;max-width:760px;margin:0 auto;padding:22px;background:#fff;}h1{font-size:25px;line-height:1.36;font-weight:800;text-align:left;margin:34px 0 20px;color:#111;padding:0 0 14px;border-bottom:3px double #111;}h2{font-size:20px;line-height:1.42;font-weight:800;margin:42px 0 14px;color:#111;padding-top:10px;border-top:2px solid #111;}h3{font-size:17px;line-height:1.5;font-weight:800;margin:30px 0 10px;color:#222;}p{margin:12px 0;line-height:1.88;}blockquote{margin:20px 0;padding:12px 0 12px 18px;border-left:4px solid #555;color:#444;background:#fafafa;font-style:normal;}ul{margin:12px 0;padding-left:21px;}li{margin:7px 0;line-height:1.88;}strong{font-weight:800;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#eeeeee;color:#222;padding:2px 6px;border-radius:1px;font-size:14px;}pre{background:#eeeeee;color:#222;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #999;margin:30px 0;}`
	},
	course: {
		name: '课程讲义',
		description: '课程、教程、学习笔记、操作说明',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.84;color:#272727;max-width:750px;margin:0 auto;padding:22px;background:#fff;}h1{font-size:24px;line-height:1.38;font-weight:800;text-align:center;margin:34px 0 22px;color:#111;}h2{font-size:19px;line-height:1.45;font-weight:800;margin:40px 0 16px;color:#111;padding:11px 14px;background:#f3f3f3;}h3{font-size:17px;line-height:1.5;font-weight:800;margin:30px 0 10px;color:#111;padding-bottom:6px;border-bottom:1px dotted #aaa;}p{margin:12px 0;line-height:1.84;}blockquote{margin:18px 0;padding:14px 16px;background:#f8f8f8;border-left:0;border-top:1px solid #e1e1e1;border-bottom:1px solid #e1e1e1;color:#444;font-style:normal;}ul{margin:12px 0;padding-left:20px;}li{margin:7px 0;line-height:1.84;}strong{font-weight:850;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#eeeeee;color:#222;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#eeeeee;color:#222;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #ddd;margin:30px 0;}`
	},
	event: {
		name: '活动公告',
		description: '活动通知、招募、发布公告、转化文',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.78;color:#2c2424;max-width:740px;margin:0 auto;padding:22px;background:#fff;}h1{font-size:24px;line-height:1.35;font-weight:900;text-align:center;margin:34px 0 20px;color:#8f1f1d;padding:18px 12px;border:2px solid #8f1f1d;background:#fffafa;}h2{font-size:19px;line-height:1.45;font-weight:850;margin:40px 0 14px;color:#8f1f1d;padding:0 0 10px;border-bottom:2px solid #8f1f1d;}h3{font-size:17px;line-height:1.5;font-weight:800;margin:30px 0 10px;color:#4a2a2a;}p{margin:12px 0;line-height:1.78;}blockquote{margin:18px 0;padding:14px 16px;background:#8f1f1d;color:#fff;border-left:0;font-style:normal;}ul{margin:12px 0;padding-left:20px;}li{margin:7px 0;line-height:1.78;}strong{font-weight:900;color:#8f1f1d;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#fff0f0;color:#8f1f1d;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#fff0f0;color:#8f1f1d;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;height:2px;background:#8f1f1d;margin:30px 0;}`
	}
};

const VIEW_TYPE_WECHAT_PREVIEW = 'wechat-preview';

class WeChatPreviewView extends ItemView {
	plugin: WeChatPublisherPlugin;
	currentStyle: string;
	previewEl: HTMLElement;

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

		this.updatePreview();
	}

	async onClose() {
		// Cleanup
	}

	async updatePreview() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			this.previewEl.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">请打开一个 Markdown 文件</p>';
			return;
		}

		const markdown = activeView.editor.getValue();
		const html = this.convertMarkdownToHTML(markdown, this.currentStyle);
		this.previewEl.innerHTML = html;
	}

	convertMarkdownToHTML(markdown: string, styleId: string): string {
		const style = STYLES[styleId as keyof typeof STYLES];
		if (!style) {
			return '<p>未找到样式</p>';
		}

		let html = '';
		const lines = markdown.split('\n');
		let inList = false;
		let listItems: string[] = [];

		const flushList = () => {
			if (listItems.length > 0) {
				html += '<ul>' + listItems.join('') + '</ul>';
				listItems = [];
			}
			inList = false;
		};

		for (let line of lines) {
			line = line.trim();

			// Empty line
			if (!line) {
				flushList();
				continue;
			}

			// H1
			if (line.startsWith('# ')) {
				flushList();
				const text = line.substring(2);
				html += `<h1>${this.escapeHTML(text)}</h1>`;
				continue;
			}

			// H2
			if (line.startsWith('## ')) {
				flushList();
				const text = line.substring(3);
				html += `<h2>${this.escapeHTML(text)}</h2>`;
				continue;
			}

			// H3
			if (line.startsWith('### ')) {
				flushList();
				const text = line.substring(4);
				html += `<h3>${this.escapeHTML(text)}</h3>`;
				continue;
			}

			// Blockquote
			if (line.startsWith('> ')) {
				flushList();
				const text = line.substring(2);
				html += `<blockquote>${this.escapeHTML(text)}</blockquote>`;
				continue;
			}

			// HR
			if (line === '---' || line === '***') {
				flushList();
				html += '<hr>';
				continue;
			}

			// List item
			if (line.startsWith('- ') || line.startsWith('* ')) {
				const text = line.substring(2);
				listItems.push(`<li>${this.processInline(text)}</li>`);
				inList = true;
				continue;
			}

			// Regular paragraph
			flushList();
			html += `<p>${this.processInline(line)}</p>`;
		}

		flushList();

		return html;
	}

	processInline(text: string): string {
		// First escape HTML to prevent XSS
		text = this.escapeHTML(text);

		// Then apply markdown formatting
		// Bold
		text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

		// Inline code
		text = text.replace(/`(.+?)`/g, '<code>$1</code>');

		return text;
	}

	escapeHTML(text: string): string {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}

	async copyToClipboard() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			new Notice('请先打开一个 Markdown 文件');
			return;
		}

		const markdown = activeView.editor.getValue();
		const html = this.generateFullHTML(markdown, this.currentStyle);

		try {
			await navigator.clipboard.writeText(html);
			new Notice('已复制！可直接粘贴到公众号后台');
		} catch (err) {
			new Notice('复制失败：' + err);
		}
	}

	generateFullHTML(markdown: string, styleId: string): string {
		const style = STYLES[styleId as keyof typeof STYLES];
		const bodyHTML = this.convertMarkdownToHTML(markdown, styleId);

		return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${style.css}</style>
</head>
<body>
${bodyHTML}
</body>
</html>`;
	}

	async exportHTML() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeView) {
			new Notice('请先打开一个 Markdown 文件');
			return;
		}

		const markdown = activeView.editor.getValue();
		const html = this.generateFullHTML(markdown, this.currentStyle);
		const fileName = activeView.file?.basename || 'untitled';
		const styleName = STYLES[this.currentStyle as keyof typeof STYLES].name;

		// Create blob and download
		const blob = new Blob([html], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${fileName}_${styleName}_微信公众号版.html`;
		a.click();
		URL.revokeObjectURL(url);

		new Notice(`已导出：${fileName}_${styleName}_微信公众号版.html`);
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

		// Add copy command
		this.addCommand({
			id: 'copy-to-wechat',
			name: '复制到公众号',
			callback: async () => {
				const view = this.app.workspace.getLeavesOfType(VIEW_TYPE_WECHAT_PREVIEW)[0]?.view;
				if (view instanceof WeChatPreviewView) {
					await view.copyToClipboard();
				} else {
					new Notice('请先打开公众号预览面板');
				}
			}
		});

		// Add settings tab
		this.addSettingTab(new WeChatPublisherSettingTab(this.app, this));

		// Auto update preview
		this.registerEvent(
			this.app.workspace.on('editor-change', () => {
				if (this.settings.autoUpdate) {
					const view = this.app.workspace.getLeavesOfType(VIEW_TYPE_WECHAT_PREVIEW)[0]?.view;
					if (view instanceof WeChatPreviewView) {
						view.updatePreview();
					}
				}
			})
		);
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
		// Cleanup
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
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('默认样式')
			.setDesc('选择默认使用的公众号样式')
			.addDropdown(dropdown => dropdown
				.addOptions({
					minimal: '极简黑白',
					medium: 'Medium Essay',
					stripe: 'Stripe Docs'
				})
				.setValue(this.plugin.settings.defaultStyle)
				.onChange(async (value) => {
					this.plugin.settings.defaultStyle = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('自动更新预览')
			.setDesc('编辑时自动更新预览（可能影响性能）')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoUpdate)
				.onChange(async (value) => {
					this.plugin.settings.autoUpdate = value;
					await this.plugin.saveSettings();
				}));
	}
}
