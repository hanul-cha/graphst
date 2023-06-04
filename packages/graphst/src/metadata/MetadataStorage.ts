import {
  FieldResolverTypeMetadata,
  FieldTypeMetadata,
  MetadataInjectProp,
  ObjectTypeMetadata,
  ProviderMetadata,
  ResolverGraphqlTarget,
  ResolverGraphqlTypeMetadata,
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
  private objectTypes = new Map<Function, ObjectTypeMetadata>();
  private fields = new Map<Function, FieldTypeMetadata[]>();
  private fieldResolversSet = new Map<Function, FieldResolverTypeMetadata[]>();
  private graphqlMethods = new Map<
    ResolverGraphqlTarget,
    ResolverGraphqlTypeMetadata[]
  >();

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

  setGraphqlMethod(
    target: ResolverGraphqlTarget,
    option: ResolverGraphqlTypeMetadata
  ) {
    let methods = this.graphqlMethods.get(target);
    if (methods) {
      methods.push(option);
    } else {
      methods = [option];
    }
    this.graphqlMethods.set(target, methods);
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

  getObjectTypeAll() {
    return [...this.objectTypes.values()];
  }

  getFields(target: Function) {
    return this.fields.get(target) ?? [];
  }

  getFieldResolvers(target: Function) {
    return this.fieldResolversSet.get(target) ?? [];
  }

  getGraphqlMethod(target: ResolverGraphqlTarget) {
    return this.graphqlMethods.get(target) ?? [];
  }
}
