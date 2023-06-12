import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import { FieldResolver } from '../../decorators/fieldResolver.decorators';
import { Resolver } from '../../decorators/resolver.decorators';
import { Mutation } from '../../decorators/mutation.decorators';
import { Query } from '../../decorators/query.decorators';
import { Project } from '../entity/project';
import { User } from '../object/user';

@Resolver(() => Project)
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
  hasUser(parent: User, args: { key: number }): boolean {
    return false;
  }

  @Query({
    args: {
      id: () => GraphQLInt,
    },
    returnType: () => GraphQLInt,
  })
  projectAll(
    _: null,
    args: {
      id: number;
    }
  ): number {
    if (args.id > 0) {
      return 0;
    }
    return 1;
  }

  @Query({
    args: {
      id: () => GraphQLInt,
    },
    returnType: () => GraphQLString,
  })
  projectName(
    _: null,
    args: {
      id: number;
    }
  ): string {
    if (args.id === 1) {
      return '테스트 프로젝트';
    }
    return '???';
  }

  @Mutation({
    args: {
      id: () => GraphQLInt,
    },
    returnType: () => GraphQLString,
  })
  setProject(
    _: null,
    args: {
      id: number;
    }
  ): string {
    if (args.id === 1) {
      return '테스트 프로젝트';
    }
    return '???';
  }
}
