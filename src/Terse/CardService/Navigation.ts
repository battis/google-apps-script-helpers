export function replaceStack(
  card: GoogleAppsScript.Card_Service.Card,
  url: string = null
): GoogleAppsScript.Card_Service.ActionResponse {
  let action = CardService.newActionResponseBuilder().setNavigation(
    CardService.newNavigation().popToRoot().updateCard(card)
  );

  if (url) {
    action = action.setOpenLink(CardService.newOpenLink().setUrl(url));
  }

  return action.build();
}

export function pushCard(
  card: GoogleAppsScript.Card_Service.Card,
  url = null
): GoogleAppsScript.Card_Service.ActionResponse {
  let action = CardService.newActionResponseBuilder().setNavigation(
    CardService.newNavigation().pushCard(card)
  );

  if (url) {
    action = action.setOpenLink(CardService.newOpenLink().setUrl(url));
  }

  return action.build();
}
