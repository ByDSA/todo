export default interface CanGetAll<T> {
  getAll(): Promise<T[]>;
}
