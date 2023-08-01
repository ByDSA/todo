import InnerInstance from "@app/utils/innerInstance";

export default interface App<T> extends InnerInstance<T | null> {
  init(): Promise<void>;
  listen(): void;
  close(): Promise<void>;
}
