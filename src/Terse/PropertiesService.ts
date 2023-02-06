import * as Property from './shared/EncodeDecode';

function getProperty(
  properties: () => GoogleAppsScript.Properties.Properties,
  key: string,
  decoder: Property.Decoder = null
) {
  const value = properties().getProperty(key);
  if (decoder) {
    return decoder(value);
  }
  return value;
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
  value: string,
  encoder: Property.Encoder = null
) {
  if (encoder) {
    value = encoder(value);
  }
  return properties().setProperty(key, value);
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
