import { Type } from '../interfaces/type';

export interface Provider {
  key: Type;
  instance: any;
}

export interface ContainerOptions {
  providers?: Provider[];
  resolvers?: Type[];
}
