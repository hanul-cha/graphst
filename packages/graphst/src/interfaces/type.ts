export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export type ConstructType = new (...args: any[]) => any;
