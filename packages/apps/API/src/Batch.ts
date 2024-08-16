import type Request from './Request.js';
import Response from './Response.js';
import { EOL } from '@gas-lighter/shared';

export default class Batch {
  private api?: string;
  private requests: Request[] = [];
  private responses?: Response;

  public add(request: Request) {
    if (!this.responses) {
      request.url = request.url.replace(/^https:\/\/www.googleapis.com/, '');
      const api = (request.url.match(/^(\/\w+\/v\d+)/) as string[])[1];
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
    this.responses = new Response(
      UrlFetchApp.fetch(`https://www.googleapis.com/batch${this.api}`, {
        method: 'post',
        headers: {
          Authorization: `Bearer ${ScriptApp.getOAuthToken()}`,
          'Accept-Encoding': 'gzip',
          'User-Agent': 'Google Apps Script (gzip)'
        },
        payload: this.buildPayload()
      })
    );
    return this;
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
      `${(request.method || 'get').toUpperCase()} ${request.url + EOL}${
        request.headers ? Batch.flattenHeaders(request.headers) + EOL : ''
      }${request.payload ? EOL + JSON.stringify(request.payload) : ''}`
    );
  }

  private buildPayload() {
    const payload: Record<string, GoogleAppsScript.Base.Blob> = {};
    this.requests.forEach((request) => {
      payload[Utilities.getUuid()] = Batch.blobRequest(request);
    });
    return payload;
  }

  public getApi() {
    return this.api;
  }

  public getRequests() {
    return this.requests;
  }

  public getResponses() {
    return this.responses?.getResponses();
  }
}
