export type UnprocessedParameters = { [key: string]: any };
export type Parameters = { [key: string]: string };

export type Action = {
    functionName: string;
    parameters?: UnprocessedParameters;
};

export function stringify(parameters: UnprocessedParameters): Parameters {
    for (const key of Object.keys(parameters)) {
        if (typeof parameters[key] != 'string') {
            parameters[key] = JSON.stringify(parameters[key]);
        }
    }

    return parameters || {};
}

// FIXME fix typing to reflect requirement for functionName or openLink, etc.
export function newAction({
    functionName,
    parameters = null,
}: Action): GoogleAppsScript.Card_Service.Action {
    const action = CardService.newAction().setFunctionName(functionName);
    if (parameters) {
        return action.setParameters(stringify(parameters));
    }
    return action;
}
