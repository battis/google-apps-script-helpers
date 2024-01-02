export default abstract class Component {
  public constructor(
    public readonly css?: string,
    public readonly js?: string
  ) {}

  public abstract getNamespace(): string;
}
