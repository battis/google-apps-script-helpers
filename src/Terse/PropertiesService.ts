const P = PropertiesService;

export namespace Terse {
  export namespace Properties_Service {
    export namespace Property {
      export type Decoder = (encoded: string) => any;
      export type Encoder = (value: any) => string;
    }
  }

  export class PropertiesService {
    public static getScriptProperty(
      key: string,
      decoder: Properties_Service.Property.Decoder = null
    ) {
      const value = P.getScriptProperties().getProperty(key);
      if (decoder) {
        return decoder(value);
      }
      return value;
    }

    public static getUserProperty(
      key: string,
      decoder: Properties_Service.Property.Decoder = null
    ) {
      const value = P.getUserProperties().getProperty(key);
      if (decoder) {
        return decoder(value);
      }
      return value;
    }

    public static setUserProperty(
      key: string,
      value: string,
      encoder: Properties_Service.Property.Encoder = null
    ) {
      if (encoder) {
        value = encoder(value);
      }
      return P.getUserProperties().setProperty(key, value);
    }

    public static deleteUserProperty(key: string) {
      return P.getUserProperties().deleteProperty(key);
    }
  }
}
