import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { AgeService2 } from './ageService2';

@Injectable()
export class AgeService {
  @Inject(() => AgeService2)
  readonly ageService2!: AgeService2;

  getAge() {
    return this.ageService2.analyzer();
  }
}
