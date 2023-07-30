/* eslint-disable import/prefer-default-export */
import { Label } from "@app/modules/label";
import Model, { assertIsModel } from "../../models";
import { ThisDocument } from "./todo";

export function documentToModel(document: ThisDocument, label: Label): Model {
  const ret: Model = {
    id: document.id,
    label,
    message: document.message,
    dueDate: document.dueDate,
  };

  assertIsModel(ret);

  return ret;
}
