class C {
  private static getCache(
    cache: () => GoogleAppsScript.Cache.Cache,
    key: string,
    decoder: C.Cache.Decoder = null
  ) {
    const value = cache().get(key);
    if (decoder) {
      return decoder(value);
    }
    return value;
  }

  public static getScriptCache = C.getCache.bind(
    null,
    CacheService.getScriptCache
  );
  public static getDocumentCache = C.getCache.bind(
    null,
    CacheService.getDocumentCache
  );
  public static getUserCache = C.getCache.bind(null, CacheService.getUserCache);

  private static putCache(
    cache: () => GoogleAppsScript.Cache.Cache,
    key: string,
    value: string,
    encoder: C.Cache.Encoder = null,
    expirationInSeconds?: number
  ) {
    if (encoder) {
      value = encoder(value);
    }
    return cache().put(key, value, expirationInSeconds);
  }

  public static putScriptCache = C.putCache.bind(
    null,
    CacheService.getScriptCache
  );
  public static putDocumentCache = C.putCache.bind(
    null,
    CacheService.getDocumentCache
  );
  public static putUserCache = C.putCache.bind(null, CacheService.getUserCache);

  private static removeCache(
    cache: () => GoogleAppsScript.Cache.Cache,
    key: string
  ) {
    return cache().remove(key);
  }

  public static removeScriptCache = C.bind(null, CacheService.getScriptCache);
  public static removeDocumentCache = C.bind(
    null,
    CacheService.getDocumentCache
  );
  public static removeUserCache = C.bind(null, CacheService.getUserCache);
}

module C {
  export namespace Cache {
    export type Decoder = (encoded: string) => any;
    export type Encoder = (value: any) => string;
  }
}

export default P;
