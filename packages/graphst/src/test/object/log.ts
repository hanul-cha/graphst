import { Injectable } from '../../decorators/injectable.decorators';

@Injectable()
export class Log {
  doTest(num: number) {
    return num;
  }
}
