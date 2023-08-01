import ExpressApp from "./main/ExpressApp";
import RealMongoDatabase from "./main/db/real-mongo.database";
import { RealLabelCachingService } from "./modules/label";
import { MongoRepository as LabelMongoRepository } from "./modules/label/repositories/mongo";
import { MongoRepository as TodoMongoRepository } from "./modules/todo/repositories/mongo";

(async () => {
  const labelRepository = new LabelMongoRepository();
  const app = new ExpressApp( {
    todo: {
      repository: new TodoMongoRepository( {
        labelRepository,
      } ),
    },
    db: {
      instance: new RealMongoDatabase(),
    },
    label: {
      cachingService: new RealLabelCachingService( {
        repository: labelRepository,
      } ),
    },
  } );

  await app.init();
  app.listen();
} )();
