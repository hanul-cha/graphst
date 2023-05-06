import { Injectable } from '../../decorators/injectable.decorators';

@Injectable()
export class Project {
  id!: number;
  name!: string;
}
