import { Type } from '../interfaces/type';

export interface ModuleMetadata {
  providers?: Type<any>[];
  resolvers?: Type<any>[];
}
