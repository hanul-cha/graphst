import { Type } from '../interfaces/type';

export interface ModuleMetadata {
  providers?: Function[];
  resolvers?: Function[];
}

export interface ProviderMetadata {
  target: Type;
}

export interface MetadataStorable {
  modules: Map<Function, ModuleMetadata>;
  providers: Map<Function, ProviderMetadata>;

  clear: () => void;
}
