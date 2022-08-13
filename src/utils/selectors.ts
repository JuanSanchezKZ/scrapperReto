export function $(selector: string, node = document.body): HTMLElement {
  return node.querySelector(selector);
}

// Form

export function $form(selector: string, node = document.body): HTMLFormElement {
  return node.querySelector(selector);
}

// Anchor

export function $Anch(
  selector: string,
  node = document.body
): HTMLAnchorElement {
  return node.querySelector(selector);
}

export function $$(selector: string, node = document.body) {
  return [...node.querySelectorAll(selector)];
}
