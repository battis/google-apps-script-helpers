import * as Cache from './shared/EncodeDecode';

function getCache(
    cache: () => GoogleAppsScript.Cache.Cache,
    key: string,
    decoder: Cache.Decoder = JSON.parse
) {
    return Cache.decodeWith(decoder, cache().get(key));
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
    encoder: Cache.Encoder = JSON.stringify,
    expirationInSeconds = 600
) {
    return cache().put(
        key,
        Cache.encodeWith(encoder, value),
        expirationInSeconds
    );
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
