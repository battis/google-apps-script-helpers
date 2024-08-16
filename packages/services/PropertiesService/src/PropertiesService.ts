import { Encoding } from '@gas-lighter/shared';

function getProperty(
  properties: () => GoogleAppsScript.Properties.Properties,
  key: string,
  decoder: Encoding.Decoder = JSON.parse
) {
  return Encoding.decodeWith(decoder, properties().getProperty(key));
}

export const getScriptProperty = getProperty.bind(
  null,
  PropertiesService.getScriptProperties
);
export const getDocumentProperty = getProperty.bind(
  null,
  PropertiesService.getDocumentProperties
);
export const getUserProperty = getProperty.bind(
  null,
  PropertiesService.getUserProperties
);

function setProperty(
  properties: () => GoogleAppsScript.Properties.Properties,
  key: string,
  value: any,
  encoder: Encoding.Encoder = JSON.stringify
) {
  return properties().setProperty(key, Encoding.encodeWith(encoder, value));
}

export const setScriptProperty = setProperty.bind(
  null,
  PropertiesService.getScriptProperties
);
export const setDocumentProperty = setProperty.bind(
  null,
  PropertiesService.getDocumentProperties
);
export const setUserProperty = setProperty.bind(
  null,
  PropertiesService.getUserProperties
);

function deleteProperty(
  properties: () => GoogleAppsScript.Properties.Properties,
  key: string
) {
  return properties().deleteProperty(key);
}

export const deleteScriptProperty = deleteProperty.bind(
  null,
  PropertiesService.getScriptProperties
);
export const deleteDocumentProperty = deleteProperty.bind(
  null,
  PropertiesService.getDocumentProperties
);
export const deleteUserProperty = deleteProperty.bind(
  null,
  PropertiesService.getUserProperties
);
