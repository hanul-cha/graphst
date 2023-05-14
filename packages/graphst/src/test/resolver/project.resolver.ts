import { GraphQLBoolean, GraphQLInt, GraphQLList } from 'graphql';
import { FieldResolver } from '../../decorators/fieldResolver.decorators';
import { Project } from '../entity/project';
import { User } from '../object/user';

// @Injectable()
export class ProjectResolver {
  @FieldResolver({
    parent: () => Project,
    returnType: () => GraphQLBoolean,
    name: 'hasProject',
    args: {
      keys: () => GraphQLList(GraphQLInt),
    },
  })
  isProject(parent: Project, args: { keys?: number[] }): boolean {
    if ((args.keys ?? []).length > 0) {
      return true;
    }
    return false;
  }

  @FieldResolver({
    parent: () => User,
    returnType: () => GraphQLBoolean,
    args: {
      key: () => GraphQLInt,
    },
  })
  hasUser(parent: Project, args: { key: number }): boolean {
    return false;
  }
}
