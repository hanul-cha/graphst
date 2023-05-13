import {
  GraphQLFieldConfigMap,
  GraphQLNamedType,
  GraphQLObjectType,
  Thunk,
} from 'graphql';
import { Injectable } from '../decorators/injectable.decorators';
import { MetadataStorage } from '../metadata/MetadataStorage';

@Injectable()
export class GraphqlTypeFactory {
  private storage = MetadataStorage.getStorage();

  create(): GraphQLNamedType[] {
    return this.storage.getObjectTypeAll().map(({ target, name }) => {
      const fields: Thunk<GraphQLFieldConfigMap<any, any>> = {};

      // TODO: target사용해서 fieldResolver찾아서 그것도 넣어주어야함

      this.storage.getFields(target).forEach(({ name, returnType }) => {
        const stringName = typeof name === 'symbol' ? name.toString() : name;
        fields[stringName] = { type: returnType() };
      });

      return new GraphQLObjectType({
        name,
        fields,
      });
    });
  }
}
