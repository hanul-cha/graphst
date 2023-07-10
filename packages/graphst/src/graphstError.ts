export class GraphstError extends Error {
  public constructor(message: string, public code: string = 'UNKNOWN') {
    super(message);
    this.name = 'GraphstError';
    Object.setPrototypeOf(this, GraphstError.prototype);
  }
}
