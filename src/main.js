import markdownIt from 'markdown-it';
// import text from './md/text.md?raw'
// import text from './md/test.md?raw'
// import text from './md/mermaid_test.md?raw'
// import text from './md/mermaid_single.md?raw'
import text from './md/demo.md?raw'
import fence from './newFence';

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

md.block.ruler.at('fence', fence, {
  alt: ['paragraph', 'reference', 'blockquote', 'list'],
});

// 保存默认的代码块渲染函数[7](@ref)
// const defaultFenceRenderer = md.renderer.rules.fence;

// 2. 自定义fence渲染规则
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  console.log('token', token.content, token.haveEndMarker);
  
  // 识别Mermaid代码块[1,6](@ref)
  // if (token.info.trim().toLowerCase() === 'mermaid') {
  //   // console.log('qin', token.content, idx, {
  //   //   isLastIdx: idx === tokens.length - 1,
  //   // })
  //   return `
  //     <mermaid-chart 
  //       code="${encodeURI(token.content)}"
  //       theme="light"
  //       shouldRender="${idx !== tokens.length - 1}"
  //       idx="${idx}"
  //     >
  //     </mermaid-chart>
  //   `
  // } else if (token.info.trim().toLowerCase() === 'plantuml') {
  //   return `
  //     <plantuml-chart 
  //       content="${encodeURI(token.content)}"
  //     >
  //     </plantuml-chart>
  //   `
  // }
  return `
    <code-block language="${token.info.trim()}" is-end="${token.haveEndMarker}">${token.content}</code-block>
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

document.querySelector('#markdown-content').value = text;

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
    await sleep(100);
    const tokens = md.parse(result, {});
    // console.log('tokens', tokens);
    document.querySelector('#app').innerHTML = md.renderer.render(tokens);
  }
}
window.md = md;
window.start = start

start();
