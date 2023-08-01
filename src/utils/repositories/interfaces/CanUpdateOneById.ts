export default interface CanUpdateOneById<T, ID> {
  updateOneById(id: ID, partialModel: T): Promise<void>;
}
