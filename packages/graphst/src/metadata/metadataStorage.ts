import { GraphQLObjectType } from 'graphql';
import {
  FieldResolverMetadata,
  FieldResolverTypeMetadata,
  FieldTypeMetadata,
  GraphqlCusComType,
  MetadataInjectProp,
  ObjectTypeMetadata,
  ParameterMetadata,
  ProviderMetadata,
  providerType,
  ResolverGraphqlTypeMetadata,
} from './interfaces';
import { MetadataStorable } from './interfaces';
import { MiddlewareClass } from '../middleware/middleware';
import { GraphQLEntityType, GraphqlMethod } from '../graphql/types';

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
    GraphqlMethod,
    ResolverGraphqlTypeMetadata[]
  >();
  private generatedGraphqlObjectTypes = new Map<Function, GraphQLObjectType>();
  private graphqlCustomTypes = new Set<GraphqlCusComType>();
  private middlewares = [] as MiddlewareClass[];
  private parameters = new Map<
    Function,
    Map<string | symbol, (number | undefined)[]>
  >();

  private generatedFieldResolvers = new Map<
    Function | GraphQLEntityType,
    FieldResolverMetadata[]
  >();
  private copyGraphqlEntityType = new Map<Function, GraphQLObjectType>();

  // set
  setProvider(target: Function, metadata: ProviderMetadata) {
    this.providers.set(target, metadata);
  }

  setInjectProps(target: Function, metaData: MetadataInjectProp) {
    const props = this.injectProps.get(target) ?? [];
    props.push(metaData);
    this.injectProps.set(target, props);
  }

  setGraphqlMethod(target: GraphqlMethod, option: ResolverGraphqlTypeMetadata) {
    const methods = this.graphqlMethods.get(target) ?? [];
    methods.push(option);
    this.graphqlMethods.set(target, methods);
  }

  setObjectType(target: Function, metaData: ObjectTypeMetadata) {
    this.objectTypes.set(target, metaData);
  }

  setField(target: Function, metaData: FieldTypeMetadata) {
    const fields = this.fields.get(target) ?? [];
    fields.push(metaData);
    this.fields.set(target, fields);
  }

  setFieldResolver(_target: Function, metaData: FieldResolverTypeMetadata) {
    this.fieldResolvers.add(metaData);
  }

  setGeneratedGraphqlObjectType(target: Function, metaData: GraphQLObjectType) {
    this.generatedGraphqlObjectTypes.set(target, metaData);
  }

  setGraphqlCustomType(type: GraphqlCusComType) {
    this.graphqlCustomTypes.add(type);
  }

  setGlobalMiddlewares(middlewares: MiddlewareClass[]) {
    this.middlewares = middlewares;
  }

  setCopyGraphqlEntityType(target: Function, metaData: GraphQLObjectType) {
    this.copyGraphqlEntityType.set(target, metaData);
  }

  setParameter({
    target,
    propertyKey,
    parameterIndex,
    targetIndex,
  }: ParameterMetadata): void {
    const methodGroup =
      this.parameters.get(target) ??
      new Map<string | symbol, (number | undefined)[]>();
    const methods = methodGroup.get(propertyKey) ?? [];
    methods[targetIndex] = parameterIndex;
    methodGroup.set(propertyKey, methods);
    this.parameters.set(target, methodGroup);
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

  getObjectType(target: Function) {
    return this.objectTypes.get(target);
  }

  getObjectTypeAll() {
    return [...this.objectTypes.values()];
  }

  getFields(target: Function) {
    return this.fields.get(target) ?? [];
  }

  getFieldResolvers(target: Function) {
    if (this.fieldResolvers.size > 0) {
      if (this.generatedFieldResolvers.size === 0) {
        [...this.fieldResolvers].forEach((fieldResolver) => {
          const targetFunction = fieldResolver.target();
          const fields = this.generatedFieldResolvers.get(targetFunction) ?? [];
          fields.push(fieldResolver);
          this.generatedFieldResolvers.set(targetFunction, fields);
        });
      }
      return this.generatedFieldResolvers.get(target) ?? [];
    }
    return [];
  }

  getGraphqlMethod(target: GraphqlMethod) {
    return this.graphqlMethods.get(target) ?? [];
  }

  getGeneratedGraphqlObjectType(target: Function) {
    return this.generatedGraphqlObjectTypes.get(target);
  }

  getGraphqlCustomTypeAll() {
    return [...this.graphqlCustomTypes];
  }

  getResolverAll() {
    return [...this.providers.values()].filter(
      ({ type }) => type && type === providerType.RESOLVER
    );
  }

  getResolverByTarget(target: Function) {
    let resolver = this.providers.get(target);
    if (resolver && resolver.type !== providerType.RESOLVER) {
      resolver = undefined;
    }
    return resolver;
  }

  getGlobalMiddlewares() {
    return this.middlewares;
  }

  getCopyGraphqlEntityType(target: Function) {
    return this.copyGraphqlEntityType.get(target);
  }

  getParameter(
    target: Function,
    methodName: string | symbol
  ): (number | undefined)[] | null {
    const methodGroup = this.parameters.get(target);
    if (methodGroup) {
      const methods = methodGroup.get(methodName);
      if (methods) {
        return methods;
      }
    }
    return null;
  }
  // get end
}
