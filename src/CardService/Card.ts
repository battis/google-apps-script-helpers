import * as Widget from './Widget';

export type Card = {
  name: string;
  header: string;
  sections: GoogleAppsScript.Card_Service.CardSection[];
  widgets?: (GoogleAppsScript.Card_Service.Widget | string)[];
};

export type CardSection = {
  header: string;
  widgets: (GoogleAppsScript.Card_Service.Widget | string)[];
  collapsible: boolean;
  numUncollapsibleWidgets: GoogleAppsScript.Integer;
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
    card = card.setHeader(newCardHeader(header));
  }
  sections.forEach((section) => (card = card.addSection(section)));
  if (widgets !== null) {
    card = card.addSection(newCardSection({ widgets }));
  }
  return card.build();
}

export function newCardHeader(
  title: string
): GoogleAppsScript.Card_Service.CardHeader {
  return CardService.newCardHeader().setTitle(title);
}

export function newCardSection({
  header = null,
  widgets = [],
  collapsible = null,
  numUncollapsibleWidgets = 0
}: Partial<CardSection>): GoogleAppsScript.Card_Service.CardSection {
  let section = CardService.newCardSection();
  if (header) {
    section = section.setHeader(header);
  }
  if (collapsible !== null) {
    section = section
      .setCollapsible(collapsible)
      .setNumUncollapsibleWidgets(numUncollapsibleWidgets);
  }
  widgets.forEach(
    (widget) =>
    (section = section.addWidget(
      typeof widget == 'string' ? Widget.newTextParagraph(widget) : widget
    ))
  );
  return section;
}
