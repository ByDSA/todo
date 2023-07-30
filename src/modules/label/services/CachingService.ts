export default interface CachingService {
  initCron(): void;
  updateCache(): Promise<boolean>;
}
