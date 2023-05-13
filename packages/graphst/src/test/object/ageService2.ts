import { Injectable } from '../../decorators/injectable.decorators';

@Injectable()
export class AgeService2 {
  // @Inject(() => Age)
  // readonly age!: Age;

  analyzer() {
    return 12;
  }

  // TODO: 순환 종속 끊어주기
  // getUserAge() {
  //   return this.age.getAge();
  // }
}
