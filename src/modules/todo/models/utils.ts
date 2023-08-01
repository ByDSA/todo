import { assertIsLabel } from "@app/modules/label";
import { assertHasAnyKey, assertHasKey } from "@app/utils/models/assertions";
import Model, { CreationalModel, Keys, UpdateModel } from "./todo.model";

export function assertIsModel(model: Model): asserts model is Model {
  common(model);
  assertHasKey(model, Keys.ID);
  assertIsLabel(model.label);

  if (!(model.dueDate instanceof Date))
    throw new Error("Due date must be a Date");
}

export function assertIsCreationalModel(model: CreationalModel): asserts model is CreationalModel {
  common(model);
  assertIsStringDate(model.dueDate);
  assertHasKey(model, Keys.LABEL_ID);
}

export function assertIsUpdateModel(model: UpdateModel): asserts model is UpdateModel {
  assertHasAnyKey(model, [Keys.DUE_DATE, Keys.MESSAGE, Keys.LABEL_ID]);

  if (model.dueDate)
    assertIsStringDate(model.dueDate);
}

function common(model: unknown) {
  if (!model || typeof model !== "object")
    throw new Error("TODO must be provided");

  assertHasKey(model, Keys.MESSAGE);
  assertHasKey(model, Keys.DUE_DATE);
}

function assertIsStringDate(date: string): asserts date is string {
  if (typeof date !== "string")
    throw new Error("Date must be a string");

  if (new Date(date).toISOString() !== date)
    throw new Error("Date must be a valid date");
}
