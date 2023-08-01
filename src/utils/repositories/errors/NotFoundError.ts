import StatusCode from "@app/utils/http/StatusCode";
import HttpError from "./HttpError";

export const NotFoundErrorName = "NotFoundError";

export default class NotFoundError extends HttpError {
  constructor(message?: string) {
    super(StatusCode.NOT_FOUND, message);
    this.name = NotFoundErrorName;
  }
}
