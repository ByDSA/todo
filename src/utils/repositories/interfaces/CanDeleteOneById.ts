export default interface CanDeleteOneById<ID> {
  deleteOneById(id: ID): Promise<void>;
}
