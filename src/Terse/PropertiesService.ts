type PropertyDecoder = (encoded: string) => any;
type PropertyEncoder = (value: any) => string;

const GPS = PropertiesService;

namespace Terse {
    class PropertiesService {
        public static getScriptProperty(key: string, decoder: PropertyDecoder = null) {
            const value = GPS.getScriptProperties().getProperty(key);
            if (decoder) {
                return decoder(value);
            }
            return value;
        }

        public static getUserProperty(key: string, decoder: PropertyDecoder = null) {
            const value = GPS.getUserProperties().getProperty(key);
            if (decoder) {
                return decoder(value);
            }
            return value;
        }

        public static setUserProperty(key: string, value: string, encoder: PropertyEncoder = null) {
            if (encoder) {
                value = encoder(value);
            }
            return GPS.getUserProperties().setProperty(key, value);
        }

        public static deleteUserProperty(key: string) {
            return GPS.getUserProperties().deleteProperty(key);
        }
    }
}

export default Terse;
