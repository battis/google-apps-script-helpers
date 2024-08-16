import * as DecoratedText from './DecoratedText.js';
import * as TextButton from './TextButton.js';
import * as TextParagraph from './TextParagraph.js';

export { DecoratedText, TextButton, TextParagraph };

/** @deprecated use g.CardService.Widget.DecoratedText.$() */
export const newDecoratedText = DecoratedText.create;

/** @deprecated use g.CardService.Widget.TextBUtton.$() */
export const newTextButton = TextButton.create;

/** @deprecated use g.CardService.Widget.TextParagraph.$() */
export const newTextParagraph = TextParagraph.create;
