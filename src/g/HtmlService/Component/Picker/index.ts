import Template from '../../Template';
import Base from '../Base';
import dialog from './templates/dialog.html';
import lib from '../../../../../js/HtmlService/Component/Picker.js.html';

class Picker extends Base {
  public static DEFAULT_HEIGHT = 100;

  protected getLib(data: Template.Data): string {
    return Template.create(lib, data).getContent();
  }

  public getHtmlOutput(config: Picker.Configuration) {
    const args: Picker.Arguments = {
      message: 'Select one option',
      actionName: 'Select',
      confirm: config.actionName || 'Confirm',
      confirmation: '',
      ...config
    };
    return Template.create(dialog, {
      job: config.job || Utilities.getUuid(),
      picker: args
    });
  }

  public getHtml = (config: Picker.Configuration) =>
    this.getHtmlOutput(config).getContent();

  public popup(data: Picker.Params.Popup) {
    return super.popup(data);
  }

  public modal(config: Picker.Params.Overlay): void {
    return super.modal(config);
  }

  public modeless(config: Base.Params.Overlay): void {
    super.modeless(config);
  }
}

namespace Picker {
  export type Option = { name: string; value: string };
  export type OptionsCallback = () => Option[];
  export type PickerCallback = (value: string, ...args: any[]) => void;
  export type Configuration = {
    message?: string;
    list: string;
    actionName?: string;
    callback: string;
    confirmation?: string;
    confirm?: string;
    job?: string;
  };
  export type Arguments = Omit<Configuration, 'list' | 'callback'> & {
    list: string;
    callback: string;
  };

  export interface Pickable {
    toOption(): Option;
  }

  export namespace Params {
    export type Overlay = Base.Params.Overlay & Configuration;
    export type Popup = Base.Params.Popup & Configuration;
  }
}

export { Picker as default };
