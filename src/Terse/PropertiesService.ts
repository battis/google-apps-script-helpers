class P {
  private static getProperty(
    properties: () => GoogleAppsScript.Properties.Properties,
    key: string,
    decoder: P.Property.Decoder = null
  ) {
    const value = properties().getProperty(key);
    if (decoder) {
      return decoder(value);
    }
    return value;
  }

  public static getScriptProperty = P.getProperty.bind(
    null,
    PropertiesService.getScriptProperties
  );
  public static getDocumentProperty = P.getProperty.bind(
    null,
    PropertiesService.getDocumentProperties
  );
  public static getUserProperty = P.getProperty.bind(
    null,
    PropertiesService.getUserProperties
  );

  private static setProperty(
    properties: () => GoogleAppsScript.Properties.Properties,
    key: string,
    value: string,
    encoder: P.Property.Encoder = null
  ) {
    if (encoder) {
      value = encoder(value);
    }
    return properties().setProperty(key, value);
  }

  public static setScriptProperty = P.setProperty.bind(
    null,
    PropertiesService.getScriptProperties
  );
  public static setDocumentProperty = P.setProperty.bind(
    null,
    PropertiesService.getDocumentProperties
  );
  public static setUserProperty = P.setProperty.bind(
    null,
    PropertiesService.getUserProperties
  );

  private static deleteProperty(
    properties: () => GoogleAppsScript.Properties.Properties,
    key: string
  ) {
    return properties().deleteProperty(key);
  }

  public static deleteScriptProperty = P.deleteProperty.bind(
    null,
    PropertiesService.getScriptProperties
  );
  public static deleteDocumentProperty = P.deleteProperty.bind(
    null,
    PropertiesService.getDocumentProperties
  );
  public static deleteUserProperty = P.deleteProperty.bind(
    null,
    PropertiesService.getUserProperties
  );
}

module P {
  export namespace Property {
    export type Decoder = (encoded: string) => any;
    export type Encoder = (value: any) => string;
  }
}

export default P;
