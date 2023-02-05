class C {
  private constructor() {}

  public static replaceStack(
    card: GoogleAppsScript.Card_Service.Card,
    url: string = null
  ): GoogleAppsScript.Card_Service.ActionResponse {
    var action = CardService.newActionResponseBuilder().setNavigation(
      CardService.newNavigation().popToRoot().updateCard(card)
    );

    if (url) {
      action = action.setOpenLink(CardService.newOpenLink().setUrl(url));
    }

    return action.build();
  }

  public static pushCard(
    card: GoogleAppsScript.Card_Service.Card,
    url = null
  ): GoogleAppsScript.Card_Service.ActionResponse {
    var action = CardService.newActionResponseBuilder().setNavigation(
      CardService.newNavigation().pushCard(card)
    );

    if (url) {
      action = action.setOpenLink(CardService.newOpenLink().setUrl(url));
    }

    return action.build();
  }

  public static newCard({
    name = null,
    header = null,
    sections = [],
    widgets = null,
  }: Partial<C.CardDefinition>) {
    var card = CardService.newCardBuilder();
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
    return CardService.newCardHeader().setTitle(title);
  }

  public static newCardSection({
    header = null,
    widgets = [],
    collapsible = null,
    numUncollapsibleWidgets = 0,
  }: Partial<C.CardSectionDefinition>): GoogleAppsScript.Card_Service.CardSection {
    var section = CardService.newCardSection();
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
    return CardService.newTextParagraph().setText(text);
  }

  public static newDecoratedText({
    topLabel = null,
    text = null,
    bottomLabel = null,
    wrap = true,
  }: Partial<C.DecoratedTextDefinition>): GoogleAppsScript.Card_Service.DecoratedText {
    var decoratedText = CardService.newDecoratedText().setText(text || ' ');
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
  }: Partial<C.TextButtonDefinition>): GoogleAppsScript.Card_Service.TextButton {
    return CardService.newTextButton()
      .setText(text)
      .setOnClickAction(C.newAction({ functionName, parameters }));
  }

  public static newAction({
    functionName,
    parameters = null,
  }: C.ActionDefinition): GoogleAppsScript.Card_Service.Action {
    const action = CardService.newAction().setFunctionName(functionName);
    if (parameters) {
      return action.setParameters(C.stringifyParameters(parameters));
    }
    return action;
  }

  private static stringifyParameters(
    parameters: C.Action.UnprocessedParameters
  ): C.Action.Parameters {
    for (const key of Object.keys(parameters)) {
      if (typeof parameters[key] != 'string') {
        parameters[key] = JSON.stringify(parameters[key]);
      }
    }

    return parameters || {};
  }
}

module C {
  export type CardDefinition = {
    name: string;
    header: string;
    sections: GoogleAppsScript.Card_Service.CardSection[];
    widgets?: (GoogleAppsScript.Card_Service.Widget | string)[];
  };

  export type CardSectionDefinition = {
    header: string;
    widgets: (GoogleAppsScript.Card_Service.Widget | string)[];
    collapsible: boolean;
    numUncollapsibleWidgets: GoogleAppsScript.Integer;
  };

  export type DecoratedTextDefinition = {
    topLabel: string;
    text: string;
    bottomLabel: string;
    wrap: boolean;
  };

  export namespace Action {
    export type UnprocessedParameters = { [key: string]: any };
    export type Parameters = { [key: string]: string };
  }
  export type ActionDefinition = {
    functionName: string;
    parameters?: Action.UnprocessedParameters;
  };
  export type TextButtonDefinition = ActionDefinition & {
    text: string;
  };
}

export default C;
