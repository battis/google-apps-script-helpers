export function create(
  text: string
): GoogleAppsScript.Card_Service.TextParagraph {
  return CardService.newTextParagraph().setText(text);
}

export const $ = create;
