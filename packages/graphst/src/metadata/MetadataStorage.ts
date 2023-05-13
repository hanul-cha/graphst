import {
  FieldTypeMetadata,
  MetadataInjectProp,
  ProviderMetadata,
} from './interfaces';
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

  private providers = new Map<Function, ProviderMetadata>();
  private injectProps = new Map<Function, MetadataInjectProp[]>();
  private resolverMethods = new Map<string, Function[]>();
  private objectTypes = new Map<Function, string>();
  private fields = new Map<Function, FieldTypeMetadata[]>();

  setProvider(target: Function, metadata: ProviderMetadata) {
    this.providers.set(target, metadata);
  }

  setInjectProps(target: Function, metaData: MetadataInjectProp) {
    let props = this.injectProps.get(target);
    if (props) {
      props.push(metaData);
    } else {
      props = [metaData];
    }
    this.injectProps.set(target, props);
  }

  setResolverMethod(target, fn: Function, _option?: any) {
    let methods = this.resolverMethods.get(target);
    if (methods) {
      methods.push(fn);
    } else {
      methods = [fn];
    }
    this.resolverMethods.set(target, methods);
  }

  setObjectType(name: string, target: Function) {
    this.objectTypes.set(target, name);
  }

  setField(target: Function, metaData: FieldTypeMetadata) {
    let fields = this.fields.get(target);
    if (fields) {
      fields.push(metaData);
    } else {
      fields = [metaData];
    }
    this.fields.set(target, fields);
  }

  getProvider(target: Function) {
    return this.providers.get(target);
  }

  getInjectProps(target: Function) {
    return this.injectProps.get(target);
  }

  getResolverMethods() {
    return [...this.resolverMethods].map(([key, value]) => ({
      type: key,
      methods: value,
    }));
  }

  getObjectType(target: Function) {
    return this.objectTypes.get(target) ?? null;
  }
}
