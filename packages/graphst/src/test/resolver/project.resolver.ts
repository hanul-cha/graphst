import { GraphQLBoolean } from 'graphql';
import { Injectable } from '../../decorators/injectable.decorators';
import { Query } from '../../decorators/query.decorators';
import { Project } from '../entity/project';

// @Injectable()
export class ProjectResolver {
  // @Query(() => GraphQLBoolean)
  getProject(): Project[] {
    return [
      {
        id: 1,
        name: 'text project no.1',
      },
    ];
  }
}
