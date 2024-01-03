/// <reference path='./google.d.ts'>

import * as Component from '../Component/client';
import * as Page from '../Page/client';
import * as DOM from './DOM';

export const g = {
  HtmlService: {
    DOM,
    Page,
    Component
  }
};

Component.init();

export default g;
