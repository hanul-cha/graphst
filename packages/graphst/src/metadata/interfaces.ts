import { Type } from '../interfaces/type';

export interface ProviderMetadata {
  target: Type;
}

export interface ResolverMetadata {
  target: Type;
}

export interface MetadataStorable {
  providers: Map<Function, ProviderMetadata>;
  // resolvers: Map<Function, ResolverMetadata>;

  clear: () => void;
}
