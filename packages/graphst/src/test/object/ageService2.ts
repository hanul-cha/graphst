import { Injectable } from '../../decorators/injectable.decorators';
import { Age } from './age';

function test() {
  console.log('이거 또 없을거지??', Age); // 이거 왜 없지?
  return Age;
}

@Injectable()
export class AgeService2 {
  //   @Inject(test())
  //   readonly age!: Age;

  analyzer() {
    // this.age.getAge(); // 이거 못찾는중 고쳐야함
    return 12;
  }

  //   getUserAge() {
  //     return this.age.getAge();
  //   }
}
