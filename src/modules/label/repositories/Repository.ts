import CanCreateMany from "@app/utils/models/repositories/interfaces/CanCreateMany";
import CanCreateOne from "@app/utils/models/repositories/interfaces/CanCreateOne";
import CanDeleteAll from "@app/utils/models/repositories/interfaces/CanDeleteAll";
import CanGetOneById from "@app/utils/models/repositories/interfaces/CanGetOneById";
import Model, { CreationalModel, ID } from "../models";

export default interface Repository
extends CanCreateOne<CreationalModel>,
CanGetOneById<Model, ID>, CanDeleteAll, CanCreateMany<CreationalModel> {
}
