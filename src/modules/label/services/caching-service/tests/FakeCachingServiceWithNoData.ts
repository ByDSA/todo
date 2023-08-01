/* eslint-disable class-methods-use-this */
import RealCachingService from "../RealCachingService";

export default class FakeCachingServiceWithNoData extends RealCachingService {
  protected fetchData = () => Promise.resolve([]);
}
