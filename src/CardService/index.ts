import * as A from './Action';
import * as C from './Card';
import * as N from './Navigation';
import * as W from './Widget';

export const Action = A;
export const Card = C;
export const Navigation = N;
export const Widget = W;

/** @deprecated */
export const stringify = A.stringify;
/** @deprecated */
export const newAction = A.create;

/** @deprecated */
export const newCard = C.create;
/** @deprecated */
export const newCardHeader = C.newCardHeader;
/** @deprecated */
export const newCardSection = C.newCardSection;

/** @deprecated */
export const replaceStack = N.replaceStack;
/** @deprecated */
export const pushCard = N.pushCard;

/** @deprecated */
export const newTexdtParagraph = W.newTextParagraph;
/** @deprecated */
export const newDecordatedTexdt = W.newDecoratedText;
/** @deprecated */
export const newTextButton = W.newTextButton;
