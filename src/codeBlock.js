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
      :host {
        display: block;
        border: 1px solid #e1e4e8;
        border-radius: 6px;
        margin: 1em 0;
        background: #f6f8fa;
        position: relative;
      }
      .feedback {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: #24292e;
        color: white;
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 0.8em;
        animation: fadeOut 2s forwards;
        z-index: 10;
      }

      @keyframes fadeOut {
        0% { opacity: 1; }
        90% { opacity: 1; }
        100% { opacity: 0; }
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border-bottom: 1px solid #e1e4e8;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.9em;
      }

      .language {
        color: #6a737d;
      }

      .copy-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        background: none;
        border: 1px solid #e1e4e8;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .copy-btn:hover {
        background: rgba(255,255,255,0.9);
      }

      .copy-btn:active {
        transform: scale(0.95);
      }

      .code-content {
        padding: 1em;
        overflow-x: auto;
      }

      pre {
        margin: 0;
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      }
      pre code.hljs { display: block; overflow-x: auto; padding: 1em; }code.hljs { padding: 3px 5px; }.hljs { color: rgb(36, 41, 46); background: rgb(255, 255, 255); }.hljs-doctag, .hljs-keyword, .hljs-meta .hljs-keyword, .hljs-template-tag, .hljs-template-variable, .hljs-type, .hljs-variable.language_ { color: rgb(215, 58, 73); }.hljs-title, .hljs-title.class_, .hljs-title.class_.inherited__, .hljs-title.function_ { color: rgb(111, 66, 193); }.hljs-attr, .hljs-attribute, .hljs-literal, .hljs-meta, .hljs-number, .hljs-operator, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-id, .hljs-variable { color: rgb(0, 92, 197); }.hljs-meta .hljs-string, .hljs-regexp, .hljs-string { color: rgb(3, 47, 98); }.hljs-built_in, .hljs-symbol { color: rgb(227, 98, 9); }.hljs-code, .hljs-comment, .hljs-formula { color: rgb(106, 115, 125); }.hljs-name, .hljs-quote, .hljs-selector-pseudo, .hljs-selector-tag { color: rgb(34, 134, 58); }.hljs-subst { color: rgb(36, 41, 46); }.hljs-section { color: rgb(0, 92, 197); font-weight: 700; }.hljs-bullet { color: rgb(115, 92, 15); }.hljs-emphasis { color: rgb(36, 41, 46); font-style: italic; }.hljs-strong { color: rgb(36, 41, 46); font-weight: 700; }.hljs-addition { color: rgb(34, 134, 58); background-color: rgb(240, 255, 244); }.hljs-deletion { color: rgb(179, 29, 40); background-color: rgb(255, 238, 240); }
    `;

    const header = `
      <div class="header">
        <span class="language">${this._language}</span>
        <button class="copy-btn" title="Copy to clipboard">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
        </button>
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
      <div class="code-content">${content.outerHTML}</div>
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