export type Decoder = (encoded: string) => any;
export type Encoder = (value: any) => string;

export function encodeWith(encoder: Encoder, value) {
  try {
    return encoder(value);
  } catch (e) {
    return value;
  }
}

export function decodeWith(decoder: Decoder, value) {
  try {
    return decoder(value);
  } catch (e) {
    return value;
  }
}
