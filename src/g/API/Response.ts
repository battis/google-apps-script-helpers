import EOL from './EOL';
import type { JSONValue } from '@battis/typescript-tricks';

export default class Response {
  private responses: APIResponse[];

  public constructor(
    private httpResponse: GoogleAppsScript.URL_Fetch.HTTPResponse
  ) {}

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

  private parse() {
    let close = false;
    const responses = this.httpResponse
      .getContentText()
      .split(`--${Response.getBoundary(this.httpResponse)}`)
      .slice(1) // lose the null before the first boundary
      .filter((part) => {
        // lose everything _after_ the last boundary
        if (part == '--' + EOL) {
          close = true;
        }
        return !close && part && part !== EOL;
      });

    this.responses = responses.map((response) => {
      const [, s, h, , b] = response.match(
        /\r\nContent-Type: application\/http\r\n\r\nHTTP\/1\.1 (\d+)[^\r\n]*\r\n(([^:]+: [^\r\n]+\r\n)+)\r\n(.*)$/ms
      );
      const status = parseInt(s);
      const headers = h
        .split(EOL)
        .filter((entry) => entry && entry !== EOL)
        .reduce((h, entry) => {
          const [key, value] = entry.split(': ');
          if (h[key]) {
            if (Array.isArray(h[key])) {
              h[key].push(value);
            } else {
              h[key] = [h[key], value];
            }
          } else {
            h[key] = value;
          }
          return h;
        }, {});
      const body = JSON.parse(b);
      return new APIResponse(status, headers, body);
    });
  }

  public getResponses() {
    if (!this.responses) {
      this.parse();
    }
    return this.responses;
  }

  public getHttpResponse() {
    return this.httpResponse;
  }
}

class APIResponse {
  public constructor(
    public readonly status: number,
    public readonly headers: Record<string, string>,
    public readonly body: JSONValue
  ) {}
}
