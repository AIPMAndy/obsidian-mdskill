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
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:17px;line-height:1.9;color:#2c2c2c;max-width:700px;margin:0 auto;padding:56px 48px;background:#fefdfb;}h1{font-family:Georgia,"Noto Serif SC",serif;font-size:36px;font-weight:700;color:#1a1a1a;margin:0 0 32px;}h2{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:26px;font-weight:700;color:#0066cc;margin:48px 0 20px;border-bottom:2px solid #0066cc;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#1a4d99;margin:32px 0 12px;}p{margin:20px 0;line-height:1.9;}blockquote{margin:22px 0;padding:16px 18px;border-left:4px solid #d4af37;background:#fffbf0;color:#4a4a4a;font-style:normal;}ul{margin:20px 0;padding-left:30px;}li{margin:12px 0;line-height:1.9;color:#2c2c2c;}strong{font-weight:bold;color:#1a1a1a;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#c41e3a;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:2px solid #d4af37;margin:30px 0;}`
	},
	minimal: {
		name: '极简现代',
		description: '极简设计，专注内容',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:16px;line-height:1.9;color:#374151;max-width:680px;margin:0 auto;padding:48px 32px;background:#fafafa;}h1{font-size:36px;font-weight:800;color:#111827;margin:0 0 30px;}h2{font-size:22px;font-weight:700;color:#111827;margin:42px 0 16px;border-bottom:none;}h3{font-size:20px;font-weight:600;color:#374151;margin:30px 0 12px;}p{margin:16px 0;line-height:1.9;}blockquote{margin:20px 0;padding:12px 16px;border-left:4px solid #111827;background:#f9fafb;color:#6b7280;font-style:normal;}ul{margin:16px 0;padding-left:24px;}li{margin:8px 0;line-height:1.9;color:#374151;}strong{font-weight:bold;color:#111827;}code{font-family:Consolas,Monaco,monospace;background:#f3f4f6;color:#111827;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e5e7eb;margin:28px 0;}`
	},
	magazine: {
		name: '杂志布局',
		description: '杂志风格布局，适合深度报道',
		css: `body{font-family:Georgia,serif;font-size:17px;line-height:1.9;color:#333333;max-width:740px;margin:0 auto;padding:48px 40px;background:#ffffff;}h1{font-family:Merriweather,Georgia,serif;font-size:36px;font-weight:900;color:#1a1a1a;margin:0 0 12px;}h2{font-family:Merriweather,Georgia,serif;font-size:26px;font-weight:700;color:#2c2c2c;margin:44px 0 16px;border-bottom:2px solid #1a1a1a;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#3a3a3a;margin:30px 0 12px;}p{margin:20px 0;line-height:1.9;}blockquote{margin:22px 0;padding:15px 20px;border-left:4px solid #c41e3a;background:#fef2f2;color:#4a4a4a;font-style:italic;}ul{margin:20px 0;padding-left:24px;}li{margin:10px 0;line-height:1.9;color:#333333;}strong{font-weight:bold;color:#1a1a1a;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#c41e3a;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #d6d6d6;margin:30px 0;}`
	},
	wechatElegant: {
		name: '公众号·优雅',
		description: '经典公众号风格，优雅灵动',
		css: `body{font-family:"Noto Sans SC",-apple-system,sans-serif;font-size:17px;line-height:1.95;color:#3a3a3a;max-width:640px;margin:0 auto;padding:52px 44px;background:#fefbf7;}h1{font-family:"Noto Serif SC",Georgia,serif;font-size:34px;font-weight:700;color:#2c2c2c;margin:0 0 28px;}h2{font-family:"Noto Serif SC",Georgia,serif;font-size:26px;font-weight:600;color:#9b6b47;margin:44px 0 18px;border-bottom:2px solid #e8d5c4;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#a87555;margin:32px 0 12px;}p{margin:20px 0;line-height:1.95;}blockquote{margin:22px 0;padding:14px 18px;border-left:4px solid #d4a89a;background:#faf6f1;color:#5a5a5a;font-style:normal;}ul{margin:20px 0;padding-left:24px;}li{margin:10px 0;line-height:1.95;color:#3a3a3a;}strong{font-weight:bold;color:#2c2c2c;}code{font-family:Consolas,Monaco,monospace;background:#f5f0ea;color:#9b6b47;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e8d5c4;margin:30px 0;}`
	},
	nytimes: {
		name: '纽约时报',
		description: '经典报业风格，严谨优雅',
		css: `body{font-family:Georgia,"Noto Serif SC",serif;font-size:18px;line-height:1.95;color:#222222;max-width:680px;margin:0 auto;padding:56px 48px;background:#ffffff;}h1{font-family:Georgia,serif;font-size:38px;font-weight:700;color:#000000;margin:0 0 32px;}h2{font-family:Georgia,serif;font-size:24px;font-weight:700;color:#000000;margin:44px 0 18px;border-bottom:1px solid #cccccc;padding-bottom:10px;}h3{font-size:18px;font-weight:600;color:#333333;margin:30px 0 12px;}p{margin:18px 0;line-height:1.95;}blockquote{margin:24px 0;padding:0 0 0 18px;border-left:4px solid #999999;background:transparent;color:#666666;font-style:italic;}ul{margin:18px 0;padding-left:24px;}li{margin:10px 0;line-height:1.95;color:#222222;}strong{font-weight:bold;color:#000000;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#333333;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #cccccc;margin:30px 0;}`
	},
	wired: {
		name: 'Wired 连线',
		description: '科技媒体风格，色彩鲜明',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:17px;line-height:1.85;color:#1a1a1a;max-width:740px;margin:0 auto;padding:56px 48px;background:#ffffff;}h1{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:40px;font-weight:900;color:#000000;margin:0 0 24px;}h2{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:28px;font-weight:800;color:#0066ff;margin:44px 0 18px;border-bottom:2px solid #0066ff;padding-bottom:8px;}h3{font-size:20px;font-weight:700;color:#1a1a1a;margin:32px 0 12px;}p{margin:18px 0;line-height:1.85;}blockquote{margin:22px 0;padding:15px 20px;border-left:4px solid #0066ff;background:#f0f5ff;color:#333333;font-style:normal;}ul{margin:18px 0;padding-left:24px;}li{margin:10px 0;line-height:1.85;color:#1a1a1a;}strong{font-weight:bold;color:#000000;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#ff6600;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:2px solid #0066ff;margin:30px 0;}`
	},
	medium: {
		name: 'Medium 长文',
		description: '内容平台风格，专注阅读',
		css: `body{font-family:Georgia,serif;font-size:18px;line-height:2;color:#363636;max-width:660px;margin:0 auto;padding:60px 50px;background:#ffffff;}h1{font-family:Georgia,serif;font-size:38px;font-weight:700;color:#000000;margin:0 0 32px;}h2{font-family:Georgia,serif;font-size:26px;font-weight:700;color:#000000;margin:48px 0 20px;border-bottom:none;}h3{font-size:20px;font-weight:600;color:#333333;margin:32px 0 12px;}p{margin:24px 0;line-height:2;}blockquote{margin:28px 0;padding:0 0 0 22px;border-left:3px solid #363636;background:transparent;color:#757575;font-style:italic;}ul{margin:24px 0;padding-left:24px;}li{margin:10px 0;line-height:2;color:#363636;}strong{font-weight:bold;color:#000000;}code{font-family:Consolas,Monaco,monospace;background:#f5f5f5;color:#d73a49;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e1e4e8;margin:36px 0;}`
	},
	zen: {
		name: '禅意留白',
		description: '超极简留白设计，适合深度思考',
		css: `body{font-family:"Noto Serif SC",Georgia,serif;font-size:18px;line-height:2.2;color:#2c2c2c;max-width:620px;margin:0 auto;padding:80px 60px;background:#ffffff;}h1{font-family:"Noto Serif SC",Georgia,serif;font-size:32px;font-weight:400;color:#000000;margin:0 0 60px;text-align:center;}h2{font-family:"Noto Serif SC",Georgia,serif;font-size:22px;font-weight:400;color:#000000;margin:60px 0 30px;border-bottom:none;}h3{font-size:18px;font-weight:400;color:#4a4a4a;margin:40px 0 16px;}p{margin:32px 0;line-height:2.2;}blockquote{margin:40px 0;padding:0 0 0 24px;border-left:1px solid #cccccc;background:transparent;color:#666666;font-style:italic;}ul{margin:32px 0;padding-left:24px;}li{margin:16px 0;line-height:2.2;color:#2c2c2c;}strong{font-weight:500;color:#000000;}code{font-family:Consolas,Monaco,monospace;background:#f8f8f8;color:#333333;padding:2px 6px;border-radius:2px;font-size:0.9em;}hr{border:none;border-top:1px solid #e0e0e0;margin:50px auto;width:100px;}`
	},
	default: {
		name: 'GitHub Dark',
		description: '经典 GitHub 暗色主题',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:16px;line-height:1.8;color:#d4d4d4;max-width:900px;margin:0 auto;padding:40px;background:#252526;}h1{font-size:32px;font-weight:700;color:#ffffff;margin:0 0 24px;}h2{font-size:24px;font-weight:600;color:#e2e8f0;margin:36px 0 16px;border-bottom:1px solid #3e3e42;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#cbd5e1;margin:28px 0 12px;}p{margin:12px 0;line-height:1.8;}blockquote{margin:20px 0;padding:15px 20px;border-left:4px solid #4fc3f7;background:#1e293b;color:#94a3b8;font-style:italic;}ul{margin:12px 0;padding-left:30px;}li{margin:8px 0;line-height:1.8;color:#d4d4d4;}strong{font-weight:bold;color:#ffffff;}code{font-family:Consolas,Monaco,monospace;background:#1e1e1e;color:#ce9178;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #3e3e42;margin:28px 0;}`
	},
	githubLight: {
		name: 'GitHub Light',
		description: '清爽的亮色主题，护眼舒适',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:16px;line-height:1.8;color:#333333;max-width:900px;margin:0 auto;padding:40px;background:#ffffff;}h1{font-size:32px;font-weight:700;color:#1a1a1a;margin:0 0 24px;}h2{font-size:24px;font-weight:600;color:#1a1a1a;margin:36px 0 16px;border-bottom:1px solid #e2e8f0;padding-bottom:8px;}h3{font-size:20px;font-weight:600;color:#333333;margin:28px 0 12px;}p{margin:12px 0;line-height:1.8;}blockquote{margin:20px 0;padding:15px 20px;border-left:4px solid #2563eb;background:#f0f7ff;color:#4b5563;font-style:italic;}ul{margin:12px 0;padding-left:30px;}li{margin:8px 0;line-height:1.8;color:#333333;}strong{font-weight:bold;color:#1a1a1a;}code{font-family:Consolas,Monaco,monospace;background:#f1f5f9;color:#e11d48;padding:2px 6px;border-radius:3px;font-size:0.9em;}hr{border:none;border-top:1px solid #e2e8f0;margin:28px 0;}`
	}
};

const VIEW_TYPE_WECHAT_PREVIEW = 'wechat-preview';

class WeChatPreviewView extends ItemView {
	plugin: WeChatPublisherPlugin;
	currentStyle: string;
	previewEl: HTMLElement;
	cachedMarkdown: string = '';

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
		// Cleanup
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

		const html = this.convertMarkdownToHTML(this.cachedMarkdown, this.currentStyle);
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

		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];

			// H1
			if (line.startsWith('# ')) {
				flushList();
				html += '<h1>' + this.processInline(line.substring(2)) + '</h1>';
				continue;
			}

			// H2
			if (line.startsWith('## ')) {
				flushList();
				html += '<h2>' + this.processInline(line.substring(3)) + '</h2>';
				continue;
			}

			// H3
			if (line.startsWith('### ')) {
				flushList();
				html += '<h3>' + this.processInline(line.substring(4)) + '</h3>';
				continue;
			}

			// Blockquote
			if (line.startsWith('> ')) {
				flushList();
				html += '<blockquote>' + this.processInline(line.substring(2)) + '</blockquote>';
				continue;
			}

			// Unordered list
			if (line.match(/^[-*+]\s+/)) {
				const content = line.replace(/^[-*+]\s+/, '');
				listItems.push('<li>' + this.processInline(content) + '</li>');
				inList = true;
				continue;
			}

			// HR
			if (line.match(/^[-*_]{3,}$/)) {
				flushList();
				html += '<hr>';
				continue;
			}

			// Empty line
			if (line.trim() === '') {
				flushList();
				continue;
			}

			// Paragraph
			flushList();
			html += '<p>' + this.processInline(line) + '</p>';
		}

		flushList();

		return `<div style="${style.css}">${html}</div>`;
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
		const html = this.convertMarkdownToHTML(this.cachedMarkdown, this.currentStyle);
		const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>微信公众号</title>
</head>
<body>
${html}
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

		const html = this.convertMarkdownToHTML(this.cachedMarkdown, this.currentStyle);
		const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>微信公众号</title>
</head>
<body>
${html}
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
