import * as Property from './shared/EncodeDecode';

function getProperty(
  properties: () => GoogleAppsScript.Properties.Properties,
  key: string,
  decoder: Property.Decoder = JSON.parse
) {
  return Property.decodeWith(decoder, properties().getProperty(key));
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
  encoder: Property.Encoder = JSON.stringify
) {
  return properties().setProperty(key, Property.encodeWith(encoder, value));
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
