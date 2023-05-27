import {
  FieldResolverTypeMetadata,
  FieldTypeMetadata,
  MetadataInjectProp,
  ObjectTypeMetadata,
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
  private objectTypes = new Map<Function, ObjectTypeMetadata>();
  private fields = new Map<Function, FieldTypeMetadata[]>();
  private fieldResolversSet = new Map<Function, FieldResolverTypeMetadata[]>();

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

  setObjectType(target: Function, metaData: ObjectTypeMetadata) {
    this.objectTypes.set(target, metaData);
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

  setFieldResolver(target: Function, metaData: FieldResolverTypeMetadata) {
    let fileResolver = this.fieldResolversSet.get(target);
    if (fileResolver) {
      fileResolver.push(metaData);
    } else {
      fileResolver = [metaData];
    }
    this.fieldResolversSet.set(target, fileResolver);
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

  getObjectTypeAll() {
    return [...this.objectTypes.values()];
  }

  getFields(target: Function) {
    return this.fields.get(target) ?? [];
  }

  getFieldResolvers(target: Function) {
    return this.fieldResolversSet.get(target) ?? [];
  }
}
