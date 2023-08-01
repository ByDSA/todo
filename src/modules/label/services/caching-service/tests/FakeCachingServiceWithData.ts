/* eslint-disable class-methods-use-this */
import RealCachingService from "../RealCachingService";

export default class FakeCachingServiceWithData extends RealCachingService {
  protected fetchData = () => Promise.resolve([{
    id: "1",
    name: "Work",
  }]);
}
