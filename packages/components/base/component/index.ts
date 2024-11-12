import closeHtml from './close.html';
import loadingHtml from './loading.html';
import '@gas-lighter/google-runtime';

export function querySelector<T extends Element = HTMLElement>(
  parentElement: Element,
  selector: string
) {
  return parentElement.querySelector(selector) as T;
}

export function querySelectorAll<T extends Element = HTMLElement>(
  parentElement: Element,
  selector: string
) {
  return Array.from(parentElement.querySelectorAll(selector)) as T[];
}

export function create<T extends Element = HTMLElement>(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html;
  if (div.childElementCount === 1) {
    return div.firstElementChild as T;
  }
  return div;
}

export function replaceContent(html: string) {
  // https://stackoverflow.com/a/47614491/294171 -- execute inserted <script> elements
  const content = document.getElementById('content');
  if (content) {
    content.innerHTML = html;
    querySelectorAll(content, 'script').forEach((oldScriptEl) => {
      const newScriptEl = document.createElement('script');
      Array.from(oldScriptEl.attributes).forEach((attr) => {
        newScriptEl.setAttribute(attr.name, attr.value);
      });
      const scriptText = document.createTextNode(oldScriptEl.innerHTML);
      newScriptEl.appendChild(scriptText);
      oldScriptEl.parentNode?.replaceChild(newScriptEl, oldScriptEl);
    });
  }
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
