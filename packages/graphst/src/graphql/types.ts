export interface ResolverMetadata {
  name: string;
  type: string;
  methodName: string;
  callback?: Function | Record<string, any>;
}

export interface ResolverValue {
  [key: string]: Function | Record<string, any>;
}
