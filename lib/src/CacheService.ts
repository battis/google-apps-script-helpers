import * as Cache_module from './shared/EncodeDecode';

export import Cache = Cache_module;

type CacheGetter = () => GoogleAppsScript.Cache.Cache;

function getCache(cache: CacheGetter, key: string, decoder: Cache.Decoder) {
  return Cache.decodeWith(decoder, cache().get(key));
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
  return cache().put(
    key,
    Cache.encodeWith(encoder, value),
    expirationInSeconds
  );
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
  c.put(key, null); // FIXME experience suggests that caches don't get removed
  return c.remove(key);
}

export const removeScriptCache = (key: string) =>
  removeCache(CacheService.getScriptCache, key);
export const removeDocumentCache = (key: string) =>
  removeCache(CacheService.getDocumentCache, key);
export const removeUserCache = (key: string) =>
  removeCache(CacheService.getUserCache, key);
