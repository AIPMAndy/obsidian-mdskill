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
		description: '默认款、方法论、诊断报告',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.82;color:#2b2b2b;max-width:740px;margin:0 auto;padding:24px 22px;background:#fff;}h1{font-size:24px;line-height:1.35;font-weight:800;text-align:left;margin:34px 0 24px;color:#111;padding-bottom:16px;border-bottom:1px solid #111;}h2{font-size:19px;line-height:1.45;font-weight:800;margin:42px 0 14px;color:#111;}h2:before{content:"";display:block;width:30px;height:3px;background:#111;margin:0 0 12px;}h3{font-size:17px;line-height:1.5;font-weight:760;margin:30px 0 10px;color:#222;}p{margin:12px 0;line-height:1.82;}blockquote{margin:20px 0;padding:13px 16px;border-left:3px solid #111;background:#f7f7f7;color:#555;font-style:normal;}ul{margin:12px 0;padding-left:20px;}li{margin:7px 0;line-height:1.82;}strong{font-weight:850;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f2f2f2;color:#111;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#f2f2f2;color:#111;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #e0e0e0;margin:32px 0;}`
	},
	medium: {
		name: 'Medium Essay',
		description: '长文观点、个人文章',
		css: `body{font-family:Georgia,"Times New Roman","Songti SC","Noto Serif CJK SC",SimSun,serif;font-size:16px;line-height:1.92;color:#242424;max-width:680px;margin:0 auto;padding:34px 24px;background:#fff;}h1{font-size:28px;line-height:1.28;font-weight:700;text-align:left;margin:42px 0 28px;color:#111;}h2{font-size:22px;line-height:1.35;font-weight:700;margin:52px 0 18px;color:#111;}h3{font-size:18px;line-height:1.45;font-weight:700;margin:34px 0 12px;color:#333;}p{margin:15px 0;line-height:1.92;}blockquote{margin:28px 0;padding:0 0 0 22px;border-left:3px solid #242424;color:#444;font-size:17px;line-height:1.86;font-style:italic;}ul{margin:15px 0;padding-left:24px;}li{margin:8px 0;line-height:1.9;}strong{font-weight:800;color:#111;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#f2f2f2;color:#222;padding:2px 6px;border-radius:3px;font-size:14px;}pre{background:#f2f2f2;color:#222;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #d8d8d8;margin:40px auto;width:34%;}`
	},
	stripe: {
		name: 'Stripe Docs',
		description: '工具说明、教程、产品文档',
		css: `body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;font-size:16px;line-height:1.78;color:#2a2f45;max-width:760px;margin:0 auto;padding:24px 22px;background:#fbfcff;}h1{font-size:25px;line-height:1.32;font-weight:850;text-align:left;margin:36px 0 24px;color:#0a2540;}h2{font-size:19px;line-height:1.45;font-weight:820;margin:42px 0 14px;color:#0a2540;padding:10px 12px;background:#f1f5ff;border-left:4px solid #635bff;}h3{font-size:17px;line-height:1.5;font-weight:780;margin:30px 0 10px;color:#425466;}p{margin:12px 0;line-height:1.78;}blockquote{margin:20px 0;padding:14px 16px;background:#fff;border:1px solid #d9e2f3;border-left:4px solid #635bff;color:#3c4257;font-style:normal;}ul{margin:12px 0;padding-left:0;list-style:none;counter-reset:item;}li{margin:8px 0;line-height:1.76;padding:9px 10px;background:#fff;border:1px solid #e5ebf5;}li:before{counter-increment:item;content:"0" counter(item) " ";font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;font-size:12px;color:#635bff;font-weight:800;}strong{font-weight:850;color:#0a2540;}code{font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;background:#eef2ff;color:#3b35a8;padding:2px 6px;border-radius:4px;font-size:14px;}pre{background:#eef2ff;color:#3b35a8;padding:14px 16px;overflow:auto;font-size:14px;line-height:1.6;}pre code{background:none;padding:0;}hr{border:none;border-top:1px solid #d9e2f3;margin:32px 0;}`
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
		// Bold
		text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

		// Inline code
		text = text.replace(/`(.+?)`/g, '<code>$1</code>');

		return this.escapeHTML(text);
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
