import { Type } from '../interfaces/type';

export interface Provider<T = any> {
  provide: Type<T>;
  valuable?: any;
  callback?: (instance: T) => any;
}

export interface ContainerOptions<T = any> {
  providers?: Provider<T>[];
}
