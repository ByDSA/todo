export default interface CanUpdateOneByIdAndGet<T, ID> {
  updateOneByIdAndGet(id: ID, partialModel: T): Promise<T>;
}
