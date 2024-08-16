import type { JSONValue } from '@battis/typescript-tricks';

type Request = GoogleAppsScript.URL_Fetch.URLFetchRequest & {
  contentType?: never;
  payload?: JSONValue;
};

export default Request;
