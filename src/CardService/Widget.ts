import * as Action from './Action';
import * as OpenLink from './OpenLink';

export type DecoratedText = {
  topLabel: string;
  text: string;
  bottomLabel: string;
  wrap: boolean;
};

export type TextButton = { text: string } & (Action.Action | OpenLink.OpenLink);

export function newTextParagraph(
  text: string
): GoogleAppsScript.Card_Service.TextParagraph {
  return CardService.newTextParagraph().setText(text);
}

export function newDecoratedText({
  topLabel = null,
  text = null,
  bottomLabel = null,
  wrap = true
}: Partial<DecoratedText>): GoogleAppsScript.Card_Service.DecoratedText {
  let decoratedText = CardService.newDecoratedText().setText(text || ' ');
  if (topLabel) {
    decoratedText = decoratedText.setTopLabel(topLabel);
  }
  if (text) {
    decoratedText = decoratedText.setWrapText(wrap);
  }
  if (bottomLabel) {
    decoratedText = decoratedText.setBottomLabel(bottomLabel);
  }
  return decoratedText;
}

export function newTextButton({
  text,
  ...args
}: TextButton): GoogleAppsScript.Card_Service.TextButton {
  let button = CardService.newTextButton().setText(text);
  if ('functionName' in args) {
    button = button.setOnClickAction(Action.create(args));
  }
  if ('url' in args) {
    button = button.setOpenLink(OpenLink.create(args));
  }
  return button;
}
