/// <reference path="../../../google.d.ts" />

declare const g: {
  HtmlService: {
    replaceContent: (content: string) => void;
    Component: {
      Progress: {
        placeholder: string;
        job: string;
        update: () => void;
        onComplete: (complete: object) => void;
        show: () => void;
      };
    };
  };
};
