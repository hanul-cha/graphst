import { Injectable } from '../../decorators/injectable.decorators';
import { Query } from '../../decorators/query.decorators';
import { Project } from '../object/project';

@Injectable()
export class ProjectResolver {
  @Query()
  getProject(): Project[] {
    return [
      {
        id: 1,
        name: 'text project no.1',
      },
    ];
  }
}
