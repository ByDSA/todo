import Label from "../../models/label.model";

type ExternalLabel = Label;
export default ExternalLabel;

export function externalToInnerModel(external: ExternalLabel): Label {
  return external;
}
