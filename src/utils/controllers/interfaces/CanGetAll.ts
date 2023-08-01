export default interface CanGetAll<REQ, RES> {
  getAll(req: REQ, res: RES): void;
}
