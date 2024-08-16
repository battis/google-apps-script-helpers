import type { JSONValue } from '@battis/typescript-tricks';
import { EOL } from '@gas-lighter/core';

export default class Response {
  private responses?: APIResponse[];

  public constructor(
    private httpResponse: GoogleAppsScript.URL_Fetch.HTTPResponse
  ) {}

  private static getBoundary(
    response: GoogleAppsScript.URL_Fetch.HTTPResponse
  ): string {
    return (response.getHeaders() as Record<string, string>)['Content-Type']
      .split(/;\s*/)
      .reduce((boundary: string, part: string) => {
        const pair = part.split('=');
        if (pair.length && pair[0] == 'boundary') {
          return pair[1];
        }
        return boundary;
      });
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
        // @ts-ignore
        /\r\nContent-Type: application\/http\r\n\r\nHTTP\/1\.1 (\d+)[^\r\n]*\r\n(([^:]+: [^\r\n]+\r\n)+)\r\n(.*)$/ms
      ) as string[];
      const status = parseInt(s);
      const headers = h
        .split(EOL)
        .filter((entry: string) => entry && entry !== EOL)
        .reduce((h, entry: string) => {
          const [key, value] = entry.split(': ');
          if (h[key]) {
            if (Array.isArray(h[key])) {
              (h[key] as string[]).push(value);
            } else {
              h[key] = [h[key] as string, value];
            }
          } else {
            h[key] = value;
          }
          return h;
        }, {} as Record<string, string | string[]>);
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
    public readonly headers: Record<string, string | string[]>,
    public readonly body: JSONValue
  ) {}
}
