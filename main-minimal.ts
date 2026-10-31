import { App, Plugin, PluginSettingTab, Setting, ItemView, WorkspaceLeaf, MarkdownView } from 'obsidian';

interface WeChatPublisherSettings {
	defaultStyle: string;
	autoUpdate: boolean;
}

const DEFAULT_SETTINGS: WeChatPublisherSettings = {
	defaultStyle: 'githubLight',
	autoUpdate: true
}

// 只保留 3 个主题用于测试
const STYLES = {
	githubLight: {
		name: "GitHub Light",
		description: "清爽的亮色主题",
		css: `body{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:16px;line-height:1.8;color:#333333;}h2{font-size:24px;font-weight:600;color:#1a1a1a;border-bottom:2px solid #e2e8f0;padding-bottom:8px;}p{margin:8px 0;line-height:1.8;color:#333333;}`
	},
	minimal: {
		name: "极简现代",
		description: "极简设计",
		css: `body{font-family:"Noto Sans SC", -apple-system, sans-serif;font-size:16px;line-height:1.9;color:#374151;}h2{font-size:22px;font-weight:600;color:#111827;border-bottom:none;}p{margin:8px 0;line-height:1.9;color:#374151;}`
	},
	magazine: {
		name: "杂志布局",
		description: "杂志风格",
		css: `body{font-family:"Georgia", serif;font-size:17px;line-height:1.9;color:#333333;}h2{font-size:26px;font-weight:700;color:#2c2c2c;border-bottom:2px solid #1a1a1a;padding-bottom:8px;}p{margin:20px 0;line-height:1.9;color:#333333;}`
	}
};

const VIEW_TYPE_WECHAT_PREVIEW = 'wechat-preview';

class WeChatPreviewView extends ItemView {
	plugin: WeChatPublisherPlugin;
	currentStyle: string;
	previewEl: HTMLElement;
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

		// Header with theme selector
		const header = container.createDiv('wechat-publisher-header');
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
			console.log('[MDskill-Minimal] 主题切换:', selector.value);
			this.currentStyle = selector.value;
			this.updatePreview();
		});

		// Preview area
		const previewContainer = container.createDiv('wechat-publisher-preview');
		this.previewEl = previewContainer.createDiv('wechat-publisher-preview-content');

		this.updatePreview();
	}

	async onClose() {
		if (this.themeStyleEl) {
			this.themeStyleEl.remove();
			this.themeStyleEl = null;
		}
	}

	updatePreview() {
		console.log('[MDskill-Minimal] updatePreview 被调用, 当前主题:', this.currentStyle);

		const style = STYLES[this.currentStyle as keyof typeof STYLES];
		if (!style) {
			this.previewEl.innerHTML = '<p>未找到样式</p>';
			return;
		}

		// 移除旧样式
		if (this.themeStyleEl) {
			this.themeStyleEl.remove();
			console.log('[MDskill-Minimal] 已移除旧样式');
		}

		// 创建新样式
		this.themeStyleEl = document.createElement('style');
		this.themeStyleEl.id = 'mdskill-theme-style-minimal';

		// CSS 作用域化
		let scopedCSS = style.css
			.replace(/body\s*\{/g, '.mdskill-preview {')
			.replace(/\}h2\s*\{/g, '}.mdskill-preview h2 {')
			.replace(/\}p\s*\{/g, '}.mdskill-preview p {');

		// 添加 !important
		scopedCSS = scopedCSS.replace(/(color|font-size|font-family|line-height|border-bottom|padding|margin|font-weight):\s*([^;]+);/g, '$1:$2 !important;');

		this.themeStyleEl.textContent = scopedCSS;
		document.head.appendChild(this.themeStyleEl);

		console.log('[MDskill-Minimal] 样式已注入, CSS 长度:', scopedCSS.length);
		console.log('[MDskill-Minimal] CSS 内容:', scopedCSS.substring(0, 200) + '...');

		// 更新内容
		this.previewEl.empty();
		const contentDiv = this.previewEl.createDiv('mdskill-preview');
		contentDiv.innerHTML = `
			<h2>这是二级标题</h2>
			<p>这是段落文本。当前主题: ${style.name}</p>
			<p>如果切换主题后这段文字的颜色、大小、字体改变了，说明功能正常。</p>
		`;

		console.log('[MDskill-Minimal] 内容已更新');

		// 验证样式是否真的应用了
		setTimeout(() => {
			const h2 = contentDiv.querySelector('h2');
			if (h2) {
				const computed = window.getComputedStyle(h2);
				console.log('[MDskill-Minimal] H2 实际样式 - color:', computed.color, 'font-size:', computed.fontSize);
			}
		}, 100);
	}
}

export default class WeChatPublisherPlugin extends Plugin {
	settings: WeChatPublisherSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_WECHAT_PREVIEW,
			(leaf) => new WeChatPreviewView(leaf, this)
		);

		this.addRibbonIcon('smartphone', 'MDskill 预览', () => {
			this.activateView();
		});

		console.log('[MDskill-Minimal] 插件已加载');
	}

	onunload() {
		console.log('[MDskill-Minimal] 插件已卸载');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_WECHAT_PREVIEW);

		const leaf = this.app.workspace.getRightLeaf(false);
		await leaf?.setViewState({
			type: VIEW_TYPE_WECHAT_PREVIEW,
			active: true,
		});

		this.app.workspace.revealLeaf(leaf!);
	}
}
