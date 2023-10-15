/// <reference path="../google.d.ts" />

export function replaceContent(html) {
  // https://stackoverflow.com/a/47614491/294171 -- execute inserted <script> elements
  const content = document.getElementById('content');
  content.innerHTML = html;
  Array.from(content.querySelectorAll('script')).forEach((oldScriptEl) => {
    const newScriptEl = document.createElement('script');
    Array.from(oldScriptEl.attributes).forEach((attr) => {
      newScriptEl.setAttribute(attr.name, attr.value);
    });
    const scriptText = document.createTextNode(oldScriptEl.innerHTML);
    newScriptEl.appendChild(scriptText);
    oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
  });
}
