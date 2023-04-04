import { ModuleMetadata } from '../module/interfaces';

export interface MetadataStorable {
  modules: Map<Function, ModuleMetadata>;
  // TODO
  resolvers: Map<Function, MetadataResolver>;
  queries: Map<Function, MetadataResolve[]>;
  mutations: Map<Function, MetadataResolve[]>;
  entities: Map<Function, MetadataEntity>;
  fields: Map<Function, MetadataField[]>;
}
