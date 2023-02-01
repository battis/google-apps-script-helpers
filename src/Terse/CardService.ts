const C = CardService;

export namespace Terse {
  type CardDefinition = {
    name: string;
    header: string;
    sections: GoogleAppsScript.Card_Service.CardSection[];
    widgets?: (GoogleAppsScript.Card_Service.Widget | string)[];
  };

  type CardSectionDefinition = {
    header: string;
    widgets: (GoogleAppsScript.Card_Service.Widget | string)[];
    collapsible: boolean;
    numUncollapsibleWidgets: GoogleAppsScript.Integer;
  };

  type DecoratedTextDefinition = {
    topLabel: string;
    text: string;
    bottomLabel: string;
    wrap: boolean;
  };

  type UnprocessedParameters = { [key: string]: any };
  type Parameters = { [key: string]: string };
  type ActionDefinition = {
    functionName: string;
    parameters?: UnprocessedParameters;
  };
  type TextButtonDefinition = ActionDefinition & {
    text: string;
  };

  export class CardService {
    public static replaceStack(
      card: GoogleAppsScript.Card_Service.Card,
      url: string = null
    ): GoogleAppsScript.Card_Service.ActionResponse {
      var action = C.newActionResponseBuilder().setNavigation(
        C.newNavigation().popToRoot().updateCard(card)
      );

      if (url) {
        action = action.setOpenLink(C.newOpenLink().setUrl(url));
      }

      return action.build();
    }

    public static pushCard(
      card: GoogleAppsScript.Card_Service.Card,
      url = null
    ): GoogleAppsScript.Card_Service.ActionResponse {
      var action = C.newActionResponseBuilder().setNavigation(
        C.newNavigation().pushCard(card)
      );

      if (url) {
        action = action.setOpenLink(C.newOpenLink().setUrl(url));
      }

      return action.build();
    }

    public static newCard({
      name = null,
      header = null,
      sections = [],
      widgets = null,
    }: Partial<CardDefinition>) {
      var card = C.newCardBuilder();
      if (name !== null) {
        card = card.setName(name);
      }
      if (header !== null) {
        card = card.setHeader(this.newCardHeader(header));
      }
      sections.forEach((section) => (card = card.addSection(section)));
      if (widgets !== null) {
        card = card.addSection(this.newCardSection({ widgets }));
      }
      return card.build();
    }

    public static newCardHeader(
      title: string
    ): GoogleAppsScript.Card_Service.CardHeader {
      return C.newCardHeader().setTitle(title);
    }

    public static newCardSection({
      header = null,
      widgets = [],
      collapsible = null,
      numUncollapsibleWidgets = 0,
    }: Partial<CardSectionDefinition>): GoogleAppsScript.Card_Service.CardSection {
      var section = C.newCardSection();
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
            typeof widget == 'string' ? this.newTextParagraph(widget) : widget
          ))
      );
      return section;
    }

    public static newTextParagraph(
      text: string
    ): GoogleAppsScript.Card_Service.TextParagraph {
      return C.newTextParagraph().setText(text);
    }

    public static newDecoratedText({
      topLabel = null,
      text = null,
      bottomLabel = null,
      wrap = true,
    }: Partial<DecoratedTextDefinition>): GoogleAppsScript.Card_Service.DecoratedText {
      var decoratedText = C.newDecoratedText().setText(text || ' ');
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

    public static newTextButton({
      text,
      functionName,
      parameters = null,
    }: Partial<TextButtonDefinition>): GoogleAppsScript.Card_Service.TextButton {
      return C.newTextButton()
        .setText(text)
        .setOnClickAction(CardService.newAction({ functionName, parameters }));
    }

    public static newAction({
      functionName,
      parameters = null,
    }: ActionDefinition): GoogleAppsScript.Card_Service.Action {
      const action = C.newAction().setFunctionName(functionName);
      if (parameters) {
        return action.setParameters(
          CardService.stringifyParameters(parameters)
        );
      }
      return action;
    }

    private static stringifyParameters(
      parameters: UnprocessedParameters
    ): Parameters {
      for (const key of Object.keys(parameters)) {
        if (typeof parameters[key] != 'string') {
          parameters[key] = JSON.stringify(parameters[key]);
        }
      }

      return parameters || {};
    }
  }
}
