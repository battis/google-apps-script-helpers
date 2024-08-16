export type Configuration = {
  topLabel?: string;
  text: string;
  bottomLabel?: string;
  wrap?: boolean;
};

export function create({
  topLabel,
  text,
  bottomLabel,
  wrap = true
}: Partial<Configuration>): GoogleAppsScript.Card_Service.DecoratedText {
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

export const $ = create;
