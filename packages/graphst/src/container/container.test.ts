import { Container } from '.';
import { MetadataStorage } from '../metadata/metadataStorage';
import { Age } from './test/age';
import { AgeService } from './test/ageService';
import { AgeService2 } from './test/ageService2';
import { Connection } from './test/connect';
import { Log } from './test/log';
import { User } from './test/user';

describe('graphst, Container', () => {
  beforeEach(() => {
    MetadataStorage.getStorage().clear();
  });

  const container = new Container({
    providers: [Connection, User, Log, Age, AgeService, AgeService2],
  });
  container.boot();

  // 첫 뎁스의 인젝트 테스트
  it('should create container', () => {
    const connection = container.getProvider(Connection);
    const user = container.getProvider(User);

    expect(user.test()).toEqual(12);
    expect(connection.doTest(2)).toEqual(2);
  });

  // 두개 이상 뎁스의 인젝트 테스트
  it('Dependency injection testing more than once deep', () => {
    const user = container.getProvider(User);

    expect(user.getUserAge()).toEqual(12);
  });

  it('Circular dependency testing', () => {
    // TODO: circular dependency test
    expect(1).toEqual(1);
  });
});
