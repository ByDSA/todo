import InnerInstance from "@app/utils/innerInstance";

export default interface IApp<T> extends InnerInstance<T> {
  listen(): void;
}
