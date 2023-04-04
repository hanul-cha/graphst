import { ModuleMetadata } from '../module/interfaces';
import { MetadataStorable } from './interfaces';

let moduleMetadata: MetadataStorable | null = null;

export class ModuleMetadataStorage implements MetadataStorable {
  static getStorage(): MetadataStorable {
    if (!moduleMetadata) {
      moduleMetadata = new ModuleMetadataStorage();
    }
    return moduleMetadata;
  }

  modules = new Map<Function, ModuleMetadata>();
  resolvers = new Map<Function, MetadataResolver>();
  queries = new Map<Function, MetadataResolver>();
  mutations = new Map<Function, MetadataResolver>();
  entities = new Map<Function, MetadataResolver>();
  fields = new Map<Function, MetadataResolver>();
}
