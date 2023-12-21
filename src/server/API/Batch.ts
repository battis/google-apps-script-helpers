const EOL = '\n';

export class Batch {
  private api?: string;
  private requests: Request[] = [];
  private response?: GoogleAppsScript.URL_Fetch.HTTPResponse;

  public add(request: Request) {
    if (!this.response) {
      if (this.requests.length < 1000) {
        request.url = request.url.replace(/^https:\/\/www.googleapis.com/, '');
        const api = request.url.match(/^(\/\w+\/v\d+)/)[1];
        if (!this.api) {
          this.api = api;
        }
        if (api === this.api) {
          this.requests.push(request);
        } else {
          throw new Error(
            `API mismatch: batch request for ${this.api} cannot accept ${api}`
          );
        }
      } else {
        throw new Error('Maximum of 1000 requests can be batched together');
      }
    } else {
      throw new Error(`Batch request has already been sent`);
    }
    return this;
  }

  public send() {
    if (!this.api) {
      throw new Error('No API specified');
    }
    if (this.requests.length === 0) {
      throw new Error('No requests added');
    }
    Logger.log(
      this.requests.reduce(
        (payload, request) =>
          (payload[Utilities.getUuid()] = Utilities.newBlob(
            `${Batch.flattenHeaders(request.headers) + EOL + EOL}${
              request.method || 'GET'
            } ${request.url}${
              request.payload ? EOL + EOL + request.payload : ''
            }`
          )),
        {}
      )
    );
    this.response = UrlFetchApp.fetch(
      `https://www.googleapis.com/batch${this.api}`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${ScriptApp.getOAuthToken()}`,
          'Accept-Encoding': 'gzip',
          'User-Agent': 'Google Apps Script (gzip)'
        },
        payload: this.buildPayload()
      }
    );
    return Batch.splitParts(this.response);
  }

  private static flattenHeaders(
    headers: GoogleAppsScript.URL_Fetch.HttpHeaders
  ) {
    const text = [];
    for (const header in headers) {
      text.push(`${header}: ${headers[header]}`);
    }
    return text.join(EOL);
  }

  private static blobRequest(request: Request): GoogleAppsScript.Base.Blob {
    return Utilities.newBlob(
      /*      `${Batch.flattenHeaders(request.headers) + EOL + EOL}*/ `${
        request.method || 'GET'
      } ${request.url}${
        request.payload ? EOL + EOL + JSON.stringify(request.payload) : ''
      }`
    );
  }

  private buildPayload() {
    const payload = {};
    this.requests.forEach((request) => {
      payload[Utilities.getUuid()] = Batch.blobRequest(request);
    });
    return payload;
  }

  private static getBoundary(
    response: GoogleAppsScript.URL_Fetch.HTTPResponse
  ): string {
    return response
      .getHeaders()
      ['Content-Type'].split(/;\s*/)
      .reduce((boundary: string, part: string) => {
        const pair = part.split('=');
        if (pair.length && pair[0] == 'boundary') {
          return pair[1];
        }
        return boundary;
      }, undefined);
  }

  private static splitParts(
    response: GoogleAppsScript.URL_Fetch.HTTPResponse
  ): any[] {
    const boundary = Batch.getBoundary(response);

    if (boundary) {
      const lines = response.getContentText().split('\r\n');
      let current: Response;
      const parts = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line == `--${boundary}--`) {
          if (current) {
            parts.push(current.parse());
          }
          return parts;
        }
        if (line == `--${boundary}`) {
          if (current) {
            parts.push(current.parse());
          }
          current = new Response();
        } else if (current) {
          current.addLine(line);
        } else {
          Logger.log(`unexpected line at ${i}: ${JSON.stringify(line)}`);
        }
      }
    }

    return [];
  }
}

class Response {
  private httpStatus: string;
  private headers: Record<string, string> = {};
  private body: string[] = [];

  private collectingHeaders = true;

  private addHeader(line: string) {
    const pair = line.split(': ');
    if (pair.length == 2) {
      this.headers[pair[0]] = pair[1];
      return true;
    }
    return false;
  }

  private addBody(line: string) {
    this.body.push(line);
  }

  public addLine(line: string) {
    if (this.collectingHeaders) {
      this.collectingHeaders = this.addHeader(line);
    } else {
      this.addBody(line);
      if (
        this.headers['Content-Type'] === 'application/http' &&
        this.body[0] == 'HTTP/1.1 200 OK'
      ) {
        this.httpStatus = this.body[0];
        this.headers = {};
        this.body = [];
        this.collectingHeaders = true;
      }
    }
  }

  public parse() {
    if (this.headers['Content-Type'].startsWith('application/json')) {
      return JSON.parse(this.body.join());
    } else {
      return this.body.join('\n');
    }
  }
}

export type Request = GoogleAppsScript.URL_Fetch.URLFetchRequest & {
  payload?: Json;
};

// https://stackoverflow.com/a/64117261
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface JSONObject {
  [k: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {}
type Json = JSONValue | JSONObject | JSONArray;
