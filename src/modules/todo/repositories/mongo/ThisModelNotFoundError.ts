import ModelNotFoundError from "@app/utils/repositories/errors/ModelNotFoundError";
import { ModelODM } from "./todo";

export default class ThisModelNotFoundError extends ModelNotFoundError {
  constructor(id: string) {
    super( {
      id,
      modelName: ModelODM.modelName,
    } );
  }
}
