class P {
  public static getScriptProperty(
    key: string,
    decoder: P.Property.Decoder = null
  ) {
    const value = PropertiesService.getScriptProperties().getProperty(key);
    if (decoder) {
      return decoder(value);
    }
    return value;
  }

  public static getUserProperty(
    key: string,
    decoder: P.Property.Decoder = null
  ) {
    const value = PropertiesService.getUserProperties().getProperty(key);
    if (decoder) {
      return decoder(value);
    }
    return value;
  }

  public static setUserProperty(
    key: string,
    value: string,
    encoder: P.Property.Encoder = null
  ) {
    if (encoder) {
      value = encoder(value);
    }
    return PropertiesService.getUserProperties().setProperty(key, value);
  }

  public static deleteUserProperty(key: string) {
    return PropertiesService.getUserProperties().deleteProperty(key);
  }
}

module P {
  export namespace Property {
    export type Decoder = (encoded: string) => any;
    export type Encoder = (value: any) => string;
  }
}

export default P;
