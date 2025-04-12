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
    return `
      <mermaid-chart 
        code="${token.content}"
        theme="light"
      >
      </mermaid-chart>
    `
  } else if (token.info.trim().toLowerCase() === 'plantuml') {
    return `
      <plantuml-chart 
        content="${token.content}"
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

## mermaid示例

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
  actor actor
  agent agent
  artifact artifact
  boundary boundary
  card card
  cloud cloud
  component component
  control control
  database database
  entity entity
  file file
  folder folder
  frame frame
  interface  interface
  node node
  package package
  queue queue
  stack stack
  rectangle rectangle
  storage storage
  usecase usecase
  @enduml
\`\`\`

## 普通代码块示例
\`\`\`javascript
console.log('Hello, world!');
\`\`\`

\`\`\`javascript
function hello() {
  console.log('Hello World!');
}
\`\`\`

\`\`\`python
def greet():
    print("Hello World!")
\`\`\`

`;

init();