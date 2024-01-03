import type Page from '../Page';

export interface Component {
  getHtml(config: Component.Configuration): string;
  getPage(config: Component.Configuration): Page;
}

export namespace Component {
  export type Configuration = Record<string, any>;
}

export default Component;
