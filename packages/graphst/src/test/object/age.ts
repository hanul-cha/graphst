import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { AgeService } from './ageService';
import { Connection } from './connect';

@Injectable()
export class Age {
  @Inject(Connection)
  readonly connection!: Connection;

  @Inject(AgeService)
  readonly ageService!: AgeService;

  test() {
    return this.connection.doTest(12);
  }

  getAge() {
    return this.ageService.getAge();
  }
}
