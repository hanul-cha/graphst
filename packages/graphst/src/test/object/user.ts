import { Inject } from '../../decorators/inject.decorators';
import { Injectable } from '../../decorators/injectable.decorators';
import { Age } from './age';
import { Connection } from './connect';
import { Log } from './log';

function test() {
  console.log('test', Age); // 이거 왜 없지?
  return Age;
}

@Injectable()
export class User {
  @Inject(Connection)
  readonly connection!: Connection;

  @Inject(Age)
  readonly age!: Age;

  @Inject(Log)
  readonly log!: Log;

  test() {
    return this.connection.doTest(12);
  }

  getUserAge() {
    return this.age.getAge();
  }
}
