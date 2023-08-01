import mongoose from "mongoose";
import { LabelKeys } from "@app/modules/label";
import Model, { Keys } from "../../models";

interface ThisDocument extends Document {
  [Keys.ID]: Model[Keys.ID];
  [Keys.DUE_DATE]: Model[Keys.DUE_DATE];
  [Keys.MESSAGE]: Model[Keys.MESSAGE];
  [Keys.LABEL_ID]: Model[Keys.LABEL][LabelKeys.ID];
}

const NAME = "todo";
const schema = new mongoose.Schema( {
  dueDate: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  labelId: {
    type: String,
    default: undefined,
  },
}, {
  _id: true,
  autoIndex: false,
} );
const model = mongoose.models[NAME] ?? mongoose.model<ThisDocument>(NAME, schema);

export {
  model as ModelODM, schema as Schema, ThisDocument,
};
