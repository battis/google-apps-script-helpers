import * as Action_module from './Action';
import * as Card_module from './Card';
import * as Navigation_module from './Navigation';
import * as Widget_module from './Widget';

namespace CardService {
    export import Action = Action_module;
    export import Card = Card_module;
    export import Navigation = Navigation_module;
    export import Widget = Widget_module;
}
export default CardService;

/** @deprecated */
export const stringify = Action_module.stringify;
/** @deprecated */
export const newAction = Action_module.create;

/** @deprecated */
export const newCard = Card_module.create;
/** @deprecated */
export const newCardHeader = Card_module.newCardHeader;
/** @deprecated */
export const newCardSection = Card_module.newCardSection;

/** @deprecated */
export const replaceStack = Navigation_module.replaceStack;
/** @deprecated */
export const pushCard = Navigation_module.pushCard;

/** @deprecated */
export const newTexdtParagraph = Widget_module.newTextParagraph;
/** @deprecated */
export const newDecordatedTexdt = Widget_module.newDecoratedText;
/** @deprecated */
export const newTextButton = Widget_module.newTextButton;
