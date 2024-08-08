import * as DecoratedText from './DecoratedText';
import * as TextButton from './TextButton';
import * as TextParagraph from './TextParagraph';

export { DecoratedText, TextButton, TextParagraph };

/** @deprecated use g.CardService.Widget.DecoratedText.$() */
export const newDecoratedText = DecoratedText.create;

/** @deprecated use g.CardService.Widget.TextBUtton.$() */
export const newTextButton = TextButton.create;

/** @deprecated use g.CardService.Widget.TextParagraph.$() */
export const newTextParagraph = TextParagraph.create;
