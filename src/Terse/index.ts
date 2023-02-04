import Cards from './CardService';
import Properties from './PropertiesService';
import Caches from './CacheService';
import Html from './HtmlService';

export namespace Terse {
  export const CacheService = Caches;
  export const CardService = Cards;
  export const HtmlService = Html;
  export const PropertiesService = Properties;
}
