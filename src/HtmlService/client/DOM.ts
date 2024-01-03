export function querySelector<T extends Element = HTMLElement>(
  root: Element,
  selector: string
) {
  return root.querySelector(selector) as T;
}

export function querySelectorAll<T extends Element = HTMLElement>(
  root: Element,
  selector: string
) {
  return Array.from(root.querySelectorAll(selector)) as T[];
}

export function create(html: string) {
  const div = document.createElement('div');
  div.innerHTML = html;
  if (div.childElementCount === 1) {
    return div.firstElementChild;
  }
  return div;
}
