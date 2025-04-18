import markdownIt from 'markdown-it';

const md = markdownIt({
  highlight: function (str, lang) {
    return `<code-block language="${lang}">${str}</code-block>`;
    // 如果指定了语言
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    // 未指定语言时自动检测
    return '<pre class="hljs"><code>' +
           hljs.highlightAuto(str).value +
           '</code></pre>';
  },
  html: true,          // 允许HTML标签[2](@ref)
  linkify: true,       // 自动转换URL为链接[4](@ref)
  typographer: true    // 支持印刷字符替换[3](@ref)
});



// 保存默认的代码块渲染函数[7](@ref)
// const defaultFenceRenderer = md.renderer.rules.fence;

// 2. 自定义fence渲染规则
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  
  // 识别Mermaid代码块[1,6](@ref)
  if (token.info.trim().toLowerCase() === 'mermaid') {
    // console.log('qin', token.content, idx, {
    //   isLastIdx: idx === tokens.length - 1,
    // })
    return `
      <mermaid-chart 
        code="${encodeURI(token.content)}"
        theme="light"
        shouldRender="${idx !== tokens.length - 1}"
        idx="${idx}"
      >
      </mermaid-chart>
    `
  } else if (token.info.trim().toLowerCase() === 'plantuml') {
    return `
      <plantuml-chart 
        content="${encodeURI(token.content)}"
      >
      </plantuml-chart>
    `
  }
  return `
    <code-block language="${token.info.trim()}">${token.content}</code-block>
  `;
};

document.querySelector('#markdown-content').addEventListener('input', (e) => {
  const content = e.target.value;
  document.querySelector('#app').innerHTML = md.render(content);
});

function init() {
  const content = document.querySelector('#markdown-content').value;
  document.querySelector('#app').innerHTML = md.render(content);
}

document.querySelector('#markdown-content').value = `# markdown-it 配合webcomponent

\`\`\`mermaid
  graph TD;
    A-->B;
    B-->C;
    C-->D;
    D-->A;
\`\`\`

## mermaid示例
\`\`\`javascript
import mermaid from 'mermaid';

class MermaidChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = \`
      <style>
        :host { display: block; }
        .container { padding: 12px; }
      </style>
      <div class="container"></div>
    \`;
    this.container = this.shadowRoot.querySelector('.container');
  }

  // 监听属性变化
  static get observedAttributes() {
    return ['code', 'theme'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.render();
    }
  }

  // 渲染逻辑
  async render() {
    const code = this.getAttribute('code') || '';
    const theme = this.getAttribute('theme') || 'default';
    
    // 初始化 Mermaid
    await mermaid.initialize({ theme });
    const { svg } = await mermaid.render('mermaid-chart', code);
    this.container.innerHTML = svg;
  }
}

// 注册自定义元素
customElements.define('mermaid-chart', MermaidChart);
\`\`\`


\`\`\`mermaid
  graph TD;
    A-->B;
    B-->C;
    C-->D;
    D-->A;
\`\`\`

## plantuml示例

\`\`\`plantuml
@startuml
actor User
participant "主控MCU" as MCU
participant "温湿度传感器" as Sensor

MCU -> Sensor: 发送启动信号(START)
activate Sensor #LightBlue
MCU -> Sensor: 发送设备地址(0x44)
alt 地址匹配成功
    Sensor --> MCU: ACK响应
    MCU -> Sensor: 读取寄存器
    Sensor --> MCU: 数据字节(2 Bytes)
else 地址不匹配
    Sensor --> MCU: NACK响应
    MCU -> MCU: 错误处理
end
deactivate Sensor
@enduml
\`\`\`

`;

init();

// 延迟函数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createDOM(htmlStr) {
  const container = document.createElement('div');
  container.innerHTML = htmlStr;
  return container.firstElementChild; // 返回第一个子元素
}

async function start() {

  const lines = document.querySelector('#markdown-content').value.split('\n');

  let result = '';
  
  for(let i = 0; i < lines.length; i++) {
    const line = lines[i] + '\n';
    result += line;
    await sleep(200);
    const tokens = md.parse(result, {});
    const mermaidTokens = tokens.filter(token => token.type === 'fence' && token.info.trim().toLowerCase() === 'mermaid');

    console.log({mermaidTokens})
    if (mermaidTokens.length > 0) {
    } else {
      document.querySelector('#app').innerHTML = md.renderer.render(tokens);
    }
    const fragment = document.createDocumentFragment();
    for(let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'fence' && token.info.trim().toLowerCase() === 'mermaid') {
        const code = token.content;
        const idx = i;
        window.mermaidChartMap = window.mermaidChartMap || new Map();
        if (!window.mermaidChartMap.has(idx)) {
          const mermaidChart = createDOM(`
            <mermaid-chart 
              code="${code}"
              theme="light"
              shouldRender="${idx !== tokens.length - 1}"
              idx="${idx}"
            >
            </mermaid-chart>
          `);
          window.mermaidChartMap.set(idx, mermaidChart);
          fragment.appendChild(createDOM(md.renderer.render(tokens.slice(0, idx))));
          fragment.appendChild(mermaidChart);
        } else {
          const mermaidChartDOM = window.mermaidChartMap.get(idx);
          mermaidChartDOM.setAttribute('code', code);
          mermaidChartDOM.setAttribute('idx', idx);
          mermaidChartDOM.setAttribute('shouldRender', idx !== tokens.length - 1);
          fragment.appendChild(mermaidChart);
        }
      } else {
        
      }
    }
  }
}
window.md = md;
window.start = start
// start();