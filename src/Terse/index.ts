import Cards from './CardService';
import Properties from './PropertiesService';
import Caches from './CacheService';

export namespace Terse {
  export const CacheService = Caches;
  export const CardService = Cards;
  export const PropertiesService = Properties;
}
