import * as Widget from './Widget/index.js';

export type Configuration = {
  header?: string;
  widgets?: (GoogleAppsScript.Card_Service.Widget | string)[];
  collapsible?: boolean;
  numUncollapsibleWidgets?: GoogleAppsScript.Integer;
};

export function create({
  header,
  widgets = [],
  collapsible,
  numUncollapsibleWidgets = 0
}: Partial<Configuration>): GoogleAppsScript.Card_Service.CardSection {
  let section = CardService.newCardSection();
  if (header) {
    section = section.setHeader(header);
  }
  if (collapsible !== undefined) {
    section = section
      .setCollapsible(collapsible)
      .setNumUncollapsibleWidgets(numUncollapsibleWidgets);
  }
  widgets.forEach(
    (widget) =>
      (section = section.addWidget(
        typeof widget == 'string' ? Widget.TextParagraph.$(widget) : widget
      ))
  );
  return section;
}

export const $ = create;
