import { Encoding } from '@gas-lighter/shared';

export import Cache = Encoding;

type CacheGetter = () => GoogleAppsScript.Cache.Cache | null;

function getCache(cache: CacheGetter, key: string, decoder: Cache.Decoder) {
  const c = cache();
  if (c) {
    return Cache.decodeWith(decoder, c.get(key));
  }
}

export const getScriptCache = (
  key: string,
  decoder: Cache.Decoder = JSON.parse
) => getCache(CacheService.getScriptCache, key, decoder);
export const getDocumentCache = (
  key: string,
  decoder: Cache.Decoder = JSON.parse
) => getCache(CacheService.getDocumentCache, key, decoder);
export const getUserCache = (
  key: string,
  decoder: Cache.Decoder = JSON.parse
) => getCache(CacheService.getUserCache, key, decoder);

function putCache(
  cache: CacheGetter,
  key: string,
  value: any,
  encoder: Cache.Encoder = JSON.stringify,
  expirationInSeconds = 600
) {
  const c = cache();
  if (c) {
    c.put(key, Cache.encodeWith(encoder, value), expirationInSeconds);
  }
}

export const putScriptCache = (
  key: string,
  value: any,
  encoder: Cache.Encoder = JSON.stringify,
  expirationInSeconds = 600
) =>
  putCache(
    CacheService.getScriptCache,
    key,
    value,
    encoder,
    expirationInSeconds
  );
export const putDocumentCache = (
  key: string,
  value: any,
  encoder: Cache.Encoder = JSON.stringify,
  expirationInSeconds = 600
) =>
  putCache(
    CacheService.getDocumentCache,
    key,
    value,
    encoder,
    expirationInSeconds
  );
export const putUserCache = (
  key: string,
  value: any,
  encoder: Cache.Encoder = JSON.stringify,
  expirationInSeconds = 600
) =>
  putCache(CacheService.getUserCache, key, value, encoder, expirationInSeconds);

function removeCache(cache: CacheGetter, key: string) {
  const c = cache();
  if (c) {
    return c.remove(key);
  }
  return null;
}

export const removeScriptCache = (key: string) =>
  removeCache(CacheService.getScriptCache, key);
export const removeDocumentCache = (key: string) =>
  removeCache(CacheService.getDocumentCache, key);
export const removeUserCache = (key: string) =>
  removeCache(CacheService.getUserCache, key);
