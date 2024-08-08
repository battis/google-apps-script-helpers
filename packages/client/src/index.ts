/// <reference path='./google.d.ts'>
/// <reference path="./types.d.ts" />
import * as Component from './Component';
import * as DOM from './DOM';
import * as Page from './Page';

export const g = {
  HtmlService: {
    DOM,
    Page,
    Component
  }
};

Component.init();

export default g;
