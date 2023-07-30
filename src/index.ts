import RealApp from "./main/RealApp";
import { LabelCachingServiceReal } from "./modules/label";
import { MongoRepository as LabelMongoRepository } from "./modules/label/repositories/mongo";
import { MongoRepository as TodoMongoRepository } from "./modules/todo/repositories/mongo";

const labelRepository = new LabelMongoRepository();
const app = new RealApp( {
  todo: {
    repository: new TodoMongoRepository( {
      labelRepository,
    } ),
  },
  db: {
    useDB: true,
  },
  label: {
    cachingService: new LabelCachingServiceReal( {
      repository: labelRepository,
    } ),
  },
} );

app.listen();
