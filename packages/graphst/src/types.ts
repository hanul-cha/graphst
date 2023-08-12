export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type ConstructType<T = any> = new (...args: any[]) => T;
