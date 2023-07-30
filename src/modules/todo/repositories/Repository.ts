import CanCreateOne from "@app/utils/models/repositories/interfaces/CanCreateOne";
import CanDeleteOneById from "@app/utils/models/repositories/interfaces/CanDeleteOneById";
import CanGetOneById from "@app/utils/models/repositories/interfaces/CanGetOneById";
import CanUpdateOneById from "@app/utils/models/repositories/interfaces/CanUpdateOneById";
import Model, { CreationalModel, ID } from "../models";
import { UpdateModel } from "../models/todo.model";

export default interface Repository
extends CanCreateOne<CreationalModel>,
CanGetOneById<Model, ID>,
CanUpdateOneById<UpdateModel, ID>,
CanDeleteOneById<ID> {
}
