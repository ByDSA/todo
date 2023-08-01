import { Repository } from "@app/modules/label/repositories";
import Label from "../../models/label.model";

export default class MockRepository implements Repository {
  createOne = jest.fn();

  getOneById = jest.fn();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createMany = jest.fn(((_: Label[]) => Promise.resolve()));

  deleteAll = jest.fn();
}
