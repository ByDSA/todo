import CanCreateOne from "@app/utils/repositories/interfaces/CanCreateOne";
import CanDeleteOneById from "@app/utils/repositories/interfaces/CanDeleteOneById";
import CanGetAll from "@app/utils/repositories/interfaces/CanGetAll";
import CanGetOneById from "@app/utils/repositories/interfaces/CanGetOneById";
import CanUpdateOneById from "@app/utils/repositories/interfaces/CanUpdateOneById";
import Model, { CreationalModel, ID } from "../models";
import { UpdateModel } from "../models/todo.model";

export default interface Repository
extends CanCreateOne<CreationalModel>,
CanGetOneById<Model, ID>,
CanUpdateOneById<UpdateModel, ID>,
CanDeleteOneById<ID>, CanGetAll<Model> {
}
