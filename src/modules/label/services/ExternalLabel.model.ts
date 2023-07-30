import Label from "../models/label.model";

export type ExternalLabel = Label;

export function externalToInnerModel(external: ExternalLabel): Label {
  return external;
}
