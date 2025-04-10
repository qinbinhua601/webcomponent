import markdownIt from 'markdown-it';

const md = markdownIt({
  html: true,          // 允许HTML标签[2](@ref)
  linkify: true,       // 自动转换URL为链接[4](@ref)
  typographer: true    // 支持印刷字符替换[3](@ref)
});

// 保存默认的代码块渲染函数[7](@ref)
const defaultFenceRenderer = md.renderer.rules.fence;

// 2. 自定义fence渲染规则
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  
  // 识别Mermaid代码块[1,6](@ref)
  if (token.info.trim().toLowerCase() === 'mermaid') {
    // return `<pre class="mermaid2">${token.content}</pre>`;
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
  
  // 其他代码块使用默认渲染[8](@ref)
  return defaultFenceRenderer(tokens, idx, options, env, self);
};

// document.querySelector('#app').innerHTML = `
//   <mermaid-chart 
//   code="graph TD; A-->B;"
//   theme="dark"
// ></mermaid-chart>
// `

document.querySelector('#app').innerHTML = md.render(`
  # Hello Markdown-it!
  ## Mermaid Example
  \`\`\`mermaid
  graph TD;
    A-->B;
    B-->C;
    C-->D;
    D-->A;
  \`\`\`

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
`);