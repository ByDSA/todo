/* eslint-disable import/prefer-default-export */
import mongoose from "mongoose";
import Model, { Keys } from "../../models";

interface ThisDocument extends Document {
  [Keys.ID]: Model[Keys.ID];
  [Keys.NAME]: Model[Keys.NAME];
}

const NAME = "Label";
const schema = new mongoose.Schema( {
  [Keys.ID]: {
    type: String,
    required: true,
  },
  [Keys.NAME]: {
    type: String,
    required: true,
  },
}, {
  _id: true,
  autoIndex: false,
} );
const model = mongoose.models[NAME] ?? mongoose.model<ThisDocument>(NAME, schema);

export {
  model as ModelODM, ThisDocument, schema,
};
