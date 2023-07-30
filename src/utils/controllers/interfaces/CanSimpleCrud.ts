import CanCreateOne from "./CanCreateOne";
import CanDeleteOneById from "./CanDeleteOneById";
import CanGetOneById from "./CanGetOneById";
import CanUpdateOneById from "./CanUpdateOneById";

export default interface CanCommonCrud<REQ, RES>
extends CanCreateOne<REQ, RES>,
CanGetOneById<REQ, RES>,
CanUpdateOneById<REQ, RES>,
CanDeleteOneById<REQ, RES> {
}
