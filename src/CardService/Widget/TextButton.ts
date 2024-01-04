import * as Action from '../Action';
import * as OpenLink from '../OpenLink';

export type Configuration = { text: string } & (
  | Action.Action
  | OpenLink.OpenLink
);

export function create({
  text,
  ...args
}: Configuration): GoogleAppsScript.Card_Service.TextButton {
  let button = CardService.newTextButton().setText(text);
  if ('functionName' in args) {
    button = button.setOnClickAction(Action.create(args));
  }
  if ('url' in args) {
    button = button.setOpenLink(OpenLink.create(args));
  }
  return button;
}

export const $ = create;
