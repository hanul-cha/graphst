import { Injectable } from '../../decorators/injectable.decorators';

@Injectable()
export class Connection {
  doTest(num: number) {
    return num;
  }
}
