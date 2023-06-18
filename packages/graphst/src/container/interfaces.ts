import { Type } from '../interfaces/type';

export interface Provider<T = any> {
  key: () => Type<T>;
  instance: Function;
}

export interface ContainerOptions<T = any> {
  providers?: Provider<T>[];
}
