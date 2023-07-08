import { GraphQLObjectType } from 'graphql';
import { MetadataStorage } from '../../metadata/metadataStorage';

export function getObjectSchema(target: Function) {
  const storage = MetadataStorage.getStorage();
  const object = storage.getObjectType(target);

  if (!object) {
    throw new Error(`${target.name} is not registered`);
  }

  let schema = storage.getGraphqlEntityType(target);

  if (!schema) {
    schema = storage.getCopyGraphqlEntityType(target);
  }

  if (!schema) {
    schema = new GraphQLObjectType({
      name: object.name + '__copy',
      fields: {},
    });

    storage.setCopyGraphqlEntityType(target, schema);
  }

  return schema;
}
