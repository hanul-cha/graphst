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

  it('query generate test', () => {
    const generatedGraphqlSchema = container
      .getProvider(GraphqlFactory)
      .generate();
    console.log(generatedGraphqlSchema.getTypeMap());
    expect(1).toEqual(1);
  });
});
