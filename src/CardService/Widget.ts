import * as Action from './Action';

export type DecoratedText = {
    topLabel: string;
    text: string;
    bottomLabel: string;
    wrap: boolean;
};

export type TextButton = Action.Action & {
    text: string;
};

export function newTextParagraph(
    text: string
): GoogleAppsScript.Card_Service.TextParagraph {
    return CardService.newTextParagraph().setText(text);
}

export function newDecoratedText({
    topLabel = null,
    text = null,
    bottomLabel = null,
    wrap = true,
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
    functionName,
    parameters = null,
}: Partial<TextButton>): GoogleAppsScript.Card_Service.TextButton {
    return CardService.newTextButton()
        .setText(text)
        .setOnClickAction(Action.create({ functionName, parameters }));
}
