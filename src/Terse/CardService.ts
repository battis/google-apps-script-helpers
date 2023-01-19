type UnprocessedParameters = { [key: string]: any };
type Parameters = { [key: string]: string };

type CardDefinition = {
    name: string;
    header: string;
    sections: GoogleAppsScript.Card_Service.CardSection[];
};

type CardSectionDefinition = {
    header: string;
    widgets: GoogleAppsScript.Card_Service.Widget[];
    collapsible: boolean;
    numUncollapsibleWidgets: GoogleAppsScript.Integer;
};

export default class TerseCardService {
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
    }: Partial<CardDefinition>) {
        var card = CardService.newCardBuilder();
        if (name !== null) {
            card = card.setName(name);
        }
        if (header !== null) {
            card = card.setHeader(this.newCardHeader(header));
        }
        sections.forEach((section) => (card = card.addSection(section)));
        return card.build();
    }

    public static newCardHeader(title): GoogleAppsScript.Card_Service.CardHeader {
        return CardService.newCardHeader().setTitle(title);
    }

    public static newCardSection({
        header = null,
        widgets = [],
        collapsible = null,
        numUncollapsibleWidgets = 0,
    }: Partial<CardSectionDefinition>): GoogleAppsScript.Card_Service.CardSection {
        var section = CardService.newCardSection();
        if (header) {
            section = section.setHeader(header);
        }
        if (collapsible !== null) {
            section = section
                .setCollapsible(collapsible)
                .setNumUncollapsibleWidgets(numUncollapsibleWidgets);
        }
        widgets.forEach((widget) => (section = section.addWidget(widget)));
        return section;
    }

    public static newTextParagraph(
        text: string
    ): GoogleAppsScript.Card_Service.TextParagraph {
        return CardService.newTextParagraph().setText(text);
    }

    public static newDecoratedText(
        topLabel: string = null,
        text: string,
        bottomLabel: string = null,
        wrap: boolean = true
    ): GoogleAppsScript.Card_Service.DecoratedText {
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

    public static newTextButton(
        text: string,
        functionName: string,
        parameters?: UnprocessedParameters
    ): GoogleAppsScript.Card_Service.TextButton {
        return CardService.newTextButton()
            .setText(text)
            .setOnClickAction(TerseCardService.newAction(functionName, parameters));
    }

    public static newAction(
        functionName: string,
        parameters?: UnprocessedParameters
    ): GoogleAppsScript.Card_Service.Action {
        const action = CardService.newAction().setFunctionName(functionName);
        if (parameters) {
            return action.setParameters(
                TerseCardService.stringifyParameters(parameters)
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
