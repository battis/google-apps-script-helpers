import Card from './CardService';
import Properties from './PropertiesService';
import Cache from './CacheService';
import Html from './HtmlService';

export namespace Terse {
  export const CacheService = Cache;
  export const CardService = Card;
  export const HtmlService = Html;
  export const PropertiesService = Properties;
}
