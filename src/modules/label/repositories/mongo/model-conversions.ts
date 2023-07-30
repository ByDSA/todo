/* eslint-disable import/prefer-default-export */
import Model, { assertIsModel } from "../../models";
import { ThisDocument } from "./label";

export function documentToModel(document: ThisDocument): Model {
  const ret: Model = {
    id: document.id,
    name: document.name,
  };

  assertIsModel(ret);

  return ret;
}
