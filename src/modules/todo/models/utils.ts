import { assertIsLabel } from "@app/modules/label";
import { assertHasAnyKey, assertHasKey } from "@app/utils/models/assertions";
import Model, { CreationalModel, Keys, UpdateModel } from "./todo.model";

export function assertIsModel(model: Model): asserts model is Model {
  common(model);
  assertHasKey(model, Keys.ID);
  assertIsLabel(model.label);
}

export function assertIsCreationalModel(model: CreationalModel): asserts model is CreationalModel {
  common(model);
  assertHasKey(model, Keys.LABEL_ID);
}

export function assertIsUpdateModel(model: UpdateModel): asserts model is UpdateModel {
  assertHasAnyKey(model, [Keys.DUE_DATE, Keys.MESSAGE, Keys.LABEL_ID]);
}

function common(model: unknown) {
  if (!model || typeof model !== "object")
    throw new Error("TODO must be provided");

  assertHasKey(model, Keys.MESSAGE);
  assertHasKey(model, Keys.DUE_DATE);
}
