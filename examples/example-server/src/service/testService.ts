import { Injectable } from 'graphst';

@Injectable()
export class TestService {
  getTest() {
    return 'test';
  }
}
