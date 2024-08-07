export type OpenLink = {
  url: string;
  openAs?: GoogleAppsScript.Card_Service.OpenAs;
  onClose?: GoogleAppsScript.Card_Service.OnClose;
};

export function create({
  url,
  openAs,
  onClose
}: OpenLink): GoogleAppsScript.Card_Service.OpenLink {
  let link = CardService.newOpenLink().setUrl(url);
  if (openAs) {
    link = link.setOpenAs(openAs);
  }
  if (onClose) {
    link = link.setOnClose(onClose);
  }
  return link;
}

export const $ = create;
