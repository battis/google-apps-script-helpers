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
