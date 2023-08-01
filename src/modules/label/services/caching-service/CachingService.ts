export default interface CachingService {
  init(): void;
  updateCache(): Promise<boolean>;
}
