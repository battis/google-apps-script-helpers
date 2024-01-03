export class Message {
  public messageId = Utilities.getUuid();
  public constructor(message: Record<string, any>) {
    Object.assign(this, message);
  }

  public static close() {
    return new Message({ close: true });
  }

  public static replaceContent(html: string) {
    return new Message({ html });
  }

  public static loading() {
    return new Message({ loading: true });
  }
}

export namespace Message {}

export default Message;
