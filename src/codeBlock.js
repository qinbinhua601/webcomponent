import css from './code.css?raw';
console.log(css)

// 定义 Web Component
class CodeBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._language = 'Unknown';
    this._content = '';
  }

  static get observedAttributes() {
    return ['language'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'language') {
      this._language = newValue || 'Unknown';
      this._updateHeader();
    }
  }

  connectedCallback() {
    this._render();
    this._setupCopyButton();
  }

  _render() {
    this._content = this.textContent
      .replace(/^\n/, '')       // 移除首行空行
      .replace(/\n\s*$/, '');   // 移除末尾空行
    const style = `
      ${css}
    `;
    const canPreview = this._language === 'mermaid' || this._language === 'plantuml';
    const header = `
      <div class="header">
        <div class="left">
          <input type="checkbox" id="switch" class="switch-input" ${!canPreview ? 'disabled' : ''}>
          <label for="switch" class="switch-label">
            <div class="switch-slider"></div>
            <span class="switch-option">代码</span>
            <span class="switch-option" style="${!canPreview ? 'opacity: 0;' : ''}">预览</span>
          </label>
        </div>
        <div class="right">
          <span class="language">${this._language}</span>
          <button class="copy-btn" title="Copy to clipboard">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </button>
        </div>
      </div>
    `;

    const content = document.createElement('pre');
    content.innerHTML = this._content;
    // 自动高亮代码（需先加载 highlight.js）
    if (window.hljs) {
      const code = document.createElement('code');
      code.innerHTML = this._content;
      content.innerHTML = '';
      content.appendChild(code);
      hljs.highlightElement(code);
    }



    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      ${header}
      <div>
        <div class="code-content">${content.outerHTML}</div>
        ${this._language === 'mermaid' ? `<mermaid-chart code="${encodeURI(this._content)}"></mermaid-chart>` : ''}
        ${this._language === 'plantuml' ? `<plantuml-chart content="${encodeURI(this._content)}"></plantuml-chart>` : ''}
      </div>
    `;
  }

  _updateHeader() {
    const header = this.shadowRoot.querySelector('.language');
    if (header) {
      header.textContent = this._language;
    }
  }

  _setupCopyButton() {
    const btn = this.shadowRoot.querySelector('.copy-btn');
    btn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this._content);
        this._showFeedback('Copied!');
      } catch (err) {
        this._showFeedback('Failed to copy');
      }
    });
  }

  _showFeedback(text) {
    this._clearExistingFeedback();
    
    const feedback = document.createElement('div');
    feedback.className = 'feedback';
    feedback.textContent = text;
    
    // 将反馈添加到 Shadow DOM 内部
    this.shadowRoot.appendChild(feedback);
    
    // 2秒后自动移除
    setTimeout(() => feedback.remove(), 1000);
  }

  _clearExistingFeedback() {
    const existing = this.shadowRoot.querySelector('.feedback');
    if (existing) existing.remove();
  }
}

// 注册组件
customElements.define('code-block', CodeBlock);