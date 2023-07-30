export default interface CanCreateMany<T> {
  createMany(models: T[]): Promise<void>;
}
