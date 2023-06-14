import { GraphQLObjectType } from 'graphql';
import {
  FieldResolverTypeMetadata,
  FieldTypeMetadata,
  GraphqlCusComType,
  MetadataInjectProp,
  ObjectTypeMetadata,
  ProviderMetadata,
  providerType,
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
  private fieldResolvers = new Set<FieldResolverTypeMetadata>();
  private graphqlMethods = new Map<
    ResolverGraphqlTarget,
    ResolverGraphqlTypeMetadata[]
  >();
  private graphqlEntityTypes = new Map<Function, GraphQLObjectType>();
  private graphqlCustomTypes = new Set<GraphqlCusComType>();

  // set
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

  setFieldResolver(_target: Function, metaData: FieldResolverTypeMetadata) {
    this.fieldResolvers.add(metaData);
  }

  setGraphqlEntityType(target: Function, metaData: GraphQLObjectType) {
    this.graphqlEntityTypes.set(target, metaData);
  }

  setGraphqlCustomType(type: GraphqlCusComType) {
    this.graphqlCustomTypes.add(type);
  }
  // set end

  // get
  getProviderAll() {
    return [...this.providers.values()];
  }

  getInjectProps(target: Function) {
    return this.injectProps.get(target) ?? [];
  }

  getInjectPropAll() {
    return [...this.injectProps.values()].flat();
  }

  getObjectTypeAll() {
    return [...this.objectTypes.values()];
  }

  getFields(target: Function) {
    return this.fields.get(target) ?? [];
  }

  getFieldResolverAll() {
    return [...this.fieldResolvers];
  }

  getGraphqlMethod(target: ResolverGraphqlTarget) {
    return this.graphqlMethods.get(target) ?? [];
  }

  getGraphqlEntityType(target: Function) {
    return this.graphqlEntityTypes.get(target);
  }

  getGraphqlCustomTypeAll() {
    return [...this.graphqlCustomTypes];
  }

  getResolverAll() {
    return [...this.providers.values()].filter(
      ({ type }) => type && type === providerType.RESOLVER
    );
  }
  // get end
}
