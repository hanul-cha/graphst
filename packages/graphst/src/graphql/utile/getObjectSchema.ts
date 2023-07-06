import { Container } from '../../container';
import { MetadataStorage } from '../../metadata/metadataStorage';
import { GraphqlObjectFactory } from '../factory/graphqlObjectFactory';

export function getObjectSchema(target: Function) {
  const graphqlFieldFactory = Container.getProvider(GraphqlObjectFactory);

  if (!graphqlFieldFactory) {
    throw new Error('container is not registered');
  }

  const storage = MetadataStorage.getStorage();
  const object = storage.getObjectType(target);

  if (!object) {
    throw new Error(`${target.name} is not registered`);
  }

  const schema = graphqlFieldFactory.getEntityGraphqlType(
    object.target,
    object.name
  );

  if (!schema) {
    throw new Error(`${object.name} is not registered`);
  }

  return schema;
}
