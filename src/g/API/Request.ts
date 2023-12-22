import type JSONValue from './JSONValue';

export type Request = GoogleAppsScript.URL_Fetch.URLFetchRequest & {
  contentType?: never;
  payload?: JSONValue;
};
