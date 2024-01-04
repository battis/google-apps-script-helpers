export function create(
  title: string
): GoogleAppsScript.Card_Service.CardHeader {
  return CardService.newCardHeader().setTitle(title);
}

export const $ = create;
