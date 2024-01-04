/// <reference path='../google.d.ts'>
import * as DOM from '../../client/DOM';
import closeHtml from './close.html';
import loadingHtml from './loading.html';

const SCRIPT = 'script';

export function replaceContent(html: string) {
  // https://stackoverflow.com/a/47614491/294171 -- execute inserted <script> elements
  const content = document.getElementById('content');
  content.innerHTML = html;
  DOM.querySelectorAll(content, SCRIPT).forEach((oldScriptEl) => {
    const newScriptEl = document.createElement(SCRIPT);
    Array.from(oldScriptEl.attributes).forEach((attr) => {
      newScriptEl.setAttribute(attr.name, attr.value);
    });
    const scriptText = document.createTextNode(oldScriptEl.innerHTML);
    newScriptEl.appendChild(scriptText);
    oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
  });
}

export function loading() {
  replaceContent(loadingHtml);
}

export function close() {
  try {
    google.script.host.close();
  } catch (e) {
    replaceContent(closeHtml);
  }
}

export namespace Script {
  export async function run<
    T extends Record<string, any> = Record<string, any>
  >(functionName: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((response) => {
          if (response && response.messageId) {
            if (response.html) {
              replaceContent(response.html);
            }
            if (response.loading) {
              loading();
            }
            if (response.close) {
              close();
            }
          }
          resolve(response as T);
        })
        .withFailureHandler(reject)
        [functionName](...args);
    });
  }
}
