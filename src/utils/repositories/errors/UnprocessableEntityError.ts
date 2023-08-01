import StatusCode from "@app/utils/http/StatusCode";
import HttpError from "./HttpError";

export const UnprocessablEntityErrorName = "UnprocessablEntityError";

export default class UnprocessablEntityError extends HttpError {
  constructor(message?: string) {
    super(StatusCode.UNPROCESSABLE_ENTITY, message);
    this.name = UnprocessablEntityErrorName;
  }
}
