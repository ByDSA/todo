import MockRepository from "../../../repositories/tests/mock.repository";
import CachingService from "../CachingService";
import FakeCachingServiceWithData from "./FakeCachingServiceWithData";
import FakeCachingServiceWithNoData from "./FakeCachingServiceWithNoData";

describe("CachingService", () => {
  const repository = new MockRepository();

  beforeEach(() => {
    repository.deleteAll.mockClear();
    repository.createMany.mockClear();
  } );

  describe("valid data received", () => {
    const serviceWithData: CachingService = new FakeCachingServiceWithData( {
      repository,
    } );

    it("should call 'deleteAll' and 'createMany' in repo", async () => {
      await serviceWithData.updateCache();

      expect(repository.deleteAll).toHaveBeenCalledTimes(1);
      expect(repository.createMany).toHaveBeenCalledTimes(1);
    } );
  } );

  describe("no data received", () => {
    const serviceWithNoData: CachingService = new FakeCachingServiceWithNoData( {
      repository,
    } );

    it("should not call 'deleteAll' and 'createMany' in repo", async () => {
      expect(repository.deleteAll).not.toHaveBeenCalled();
      expect(repository.deleteAll).not.toHaveBeenCalled();

      await serviceWithNoData.updateCache();

      expect(repository.deleteAll).not.toHaveBeenCalled();
      expect(repository.createMany).not.toHaveBeenCalled();
    } );
  } );
} );
