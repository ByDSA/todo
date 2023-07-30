export default interface CanGetOneById<REQ, RES> {
  getOneById(req: REQ, res: RES): void;
}
