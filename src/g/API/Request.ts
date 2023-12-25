import type { JSONValue } from '@battis/typescript-tricks';

export type Request = GoogleAppsScript.URL_Fetch.URLFetchRequest & {
  contentType?: never;
  payload?: JSONValue;
};
