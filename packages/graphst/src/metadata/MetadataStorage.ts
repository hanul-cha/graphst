import { Type } from '../interfaces/type';
import { ModuleMetadata, ProviderMetadata } from './interfaces';
import { MetadataStorable } from './interfaces';

let Metadata: MetadataStorable | null = null;

export class MetadataStorage implements MetadataStorable {
  static getStorage(): MetadataStorable {
    if (!Metadata) {
      Metadata = new MetadataStorage();
    }
    return Metadata;
  }

  clear() {
    Metadata = null;
  }

  modules = new Map<Function, ModuleMetadata>();
  providers = new Map<Function, ProviderMetadata>();
}
