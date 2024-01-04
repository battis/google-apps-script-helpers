import * as CardHeader from './CardHeader';
import * as CardSection from './CardSection';

export type Card = {
  name: string;
  header: string;
  sections: GoogleAppsScript.Card_Service.CardSection[];
  widgets?: (GoogleAppsScript.Card_Service.Widget | string)[];
};

export function create({
  name = null,
  header = null,
  sections = [],
  widgets = null
}: Partial<Card>) {
  let card = CardService.newCardBuilder();
  if (name !== null) {
    card = card.setName(name);
  }
  if (header !== null) {
    card = card.setHeader(CardHeader.$(header));
  }
  sections.forEach((section) => (card = card.addSection(section)));
  if (widgets !== null) {
    card = card.addSection(CardSection.$({ widgets }));
  }
  return card.build();
}

/** @deprecated use g.CardService.CardHeader.$() */
export const newCardHeader = CardHeader.create;

/** @deprecated use g.CardService.CardSection.$() */
export const newCardSection = CardSection.create;

export const $ = create;
