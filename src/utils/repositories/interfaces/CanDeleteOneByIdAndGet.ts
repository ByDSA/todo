export default interface CanDeleteOneById<T, ID> {
  deleteOneById(id: ID): Promise<T>;
}
