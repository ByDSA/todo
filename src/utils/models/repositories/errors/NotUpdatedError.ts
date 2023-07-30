import StatusCode from "@app/utils/http/StatusCode";
import HttpError from "./HttpError";

export const NotUpdatedErrorName = "NotUpdatedError";

export default class NotUpdatedError extends HttpError {
  constructor(message?: string) {
    super(StatusCode.CONFLICT, message);
    this.name = NotUpdatedErrorName;
  }
}
