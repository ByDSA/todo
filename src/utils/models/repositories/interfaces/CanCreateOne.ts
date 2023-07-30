export default interface CanCreateOne<T> {
  createOne(model: T): Promise<void>;
}
