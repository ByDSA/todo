import CanCreateMany from "@app/utils/repositories/interfaces/CanCreateMany";
import CanCreateOne from "@app/utils/repositories/interfaces/CanCreateOne";
import CanDeleteAll from "@app/utils/repositories/interfaces/CanDeleteAll";
import CanGetOneById from "@app/utils/repositories/interfaces/CanGetOneById";
import Model, { CreationalModel, ID } from "../models";

export default interface Repository
extends CanCreateOne<CreationalModel>,
CanGetOneById<Model, ID>, CanDeleteAll, CanCreateMany<CreationalModel> {
}
