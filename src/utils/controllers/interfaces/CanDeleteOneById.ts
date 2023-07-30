export default interface CanDeleteOneById<REQ, RES> {
  deleteOneById(req: REQ, res: RES): void;
}
