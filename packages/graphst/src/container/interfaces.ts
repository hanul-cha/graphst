import { Type } from '../types';

export interface Provider {
  key: Type;
  instance: any;
}

export interface ContainerOptions {
  providers?: Provider[];
  resolvers?: Type[];
}
