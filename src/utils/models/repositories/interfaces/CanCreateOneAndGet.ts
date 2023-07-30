export default interface CanCreateOneAndGet<T> {
  createOneAndGet(model: T): Promise<T>;
}
