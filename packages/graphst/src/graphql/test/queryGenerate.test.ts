import { Container } from '../../container';
import { MetadataStorage } from '../../metadata/MetadataStorage';
import { Project } from '../../test/entity/project';
import { ProjectResolver } from '../../test/resolver/project.resolver';
import { GraphqlFactory } from '../factory/graphqlFactory';

describe('graphst, Container', () => {
  beforeEach(() => {
    MetadataStorage.getStorage().clear();
  });

  const container = new Container({
    providers: [Project, ProjectResolver],
  });
  container.boot();

  const graphql = container.getProvider(GraphqlFactory);

  it('query generate test', () => {
    const { schemes, resolvers } = graphql.generate();
    console.log(schemes);
    console.log(resolvers);
    expect(1).toEqual(1);
  });
});
