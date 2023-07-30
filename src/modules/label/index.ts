export {
  default as Label, ID as LabelID, Keys as LabelKeys, assertIsModel as assertIsLabel,
} from "./models";

export {
  Repository as LabelRepository,
} from "./repositories";

export {
  ThisDocument as LabelDocument,
  ModelODM as LabelModelODM,
} from "./repositories/mongo";

export {
  CachingService as LabelCachingService,
  CachingServiceReal as LabelCachingServiceReal,
} from "./services";
