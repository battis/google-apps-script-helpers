/// <reference path="./types.d.ts" />
import API from './API';
import * as CacheService from './CacheService';
import * as CardService from './CardService';
import * as DriveApp from './DriveApp';
import * as HtmlService from './HtmlService';
import * as PropertiesService from './PropertiesService';
import * as SpreadsheetApp from './SpreadsheetApp';
import * as UI from './UI';

export const g = {
  API,
  CacheService,
  CardService,
  DriveApp,
  HtmlService,
  PropertiesService,
  SpreadsheetApp,
  UI
};

export const include = g.HtmlService.Template.include;
export const getProgress = g.HtmlService.Component.Progress.getProgress;

export default g;
