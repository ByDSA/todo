import Model, { CreationalModel } from "./label.model";

export function assertIsModel(model: Model): asserts model is Model {
  if (!model || typeof model !== "object")
    throw new Error("Label must be provided");

  if (typeof model.id !== "string" || model.id === "")
    throw new Error("Label must have a non-empty string id");

  if (typeof model.name !== "string" || model.name === "")
    throw new Error("Label must have a non-empty string name");
}

export const assertIsCreationalModel = (
  creationalModel: CreationalModel,
) => assertIsModel(creationalModel);
