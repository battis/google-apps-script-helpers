import * as Widget from './Widget';

export type Configuration = {
  header: string;
  widgets: (GoogleAppsScript.Card_Service.Widget | string)[];
  collapsible: boolean;
  numUncollapsibleWidgets: GoogleAppsScript.Integer;
};

export function create({
  header = null,
  widgets = [],
  collapsible = null,
  numUncollapsibleWidgets = 0
}: Partial<Configuration>): GoogleAppsScript.Card_Service.CardSection {
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
        typeof widget == 'string' ? Widget.TextParagraph.$(widget) : widget
      ))
  );
  return section;
}

export const $ = create;
