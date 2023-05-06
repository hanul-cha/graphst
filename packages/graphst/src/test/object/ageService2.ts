import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { Age } from './age';

@Injectable()
export class AgeService2 {
  @Inject(() => Age)
  readonly age!: Age;

  analyzer() {
    // this.age.getAge(); // 이거 못찾는중 고쳐야함
    return 12;
  }

  getUserAge() {
    return this.age.getAge();
  }
}
