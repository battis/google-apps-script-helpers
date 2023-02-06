import * as Cache from './shared/EncodeDecode';

function getCache(
  cache: () => GoogleAppsScript.Cache.Cache,
  key: string,
  decoder: Cache.Decoder = null
) {
  const value = cache().get(key);
  if (decoder) {
    return decoder(value);
  }
  return value;
}

export const getScriptCache = getCache.bind(null, CacheService.getScriptCache);
export const getDocumentCache = getCache.bind(
  null,
  CacheService.getDocumentCache
);
export const getUserCache = getCache.bind(null, CacheService.getUserCache);

function putCache(
  cache: () => GoogleAppsScript.Cache.Cache,
  key: string,
  value: string,
  encoder: Cache.Encoder = null,
  expirationInSeconds = 600
) {
  if (encoder) {
    value = encoder(value);
  }
  return cache().put(key, value, expirationInSeconds);
}

export const putScriptCache = putCache.bind(null, CacheService.getScriptCache);
export const putDocumentCache = putCache.bind(
  null,
  CacheService.getDocumentCache
);
export const putUserCache = putCache.bind(null, CacheService.getUserCache);

function removeCache(cache: () => GoogleAppsScript.Cache.Cache, key: string) {
  return cache().remove(key);
}

export const removeScriptCache = removeCache.bind(
  null,
  CacheService.getScriptCache
);
export const removeDocumentCache = removeCache.bind(
  null,
  CacheService.getDocumentCache
);
export const removeUserCache = removeCache.bind(
  null,
  CacheService.getUserCache
);
