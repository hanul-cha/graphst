import { Container } from '../container';
import { MetadataStorage } from '../metadata/metadataStorage';
import { Age } from './object/age';
import { AgeService } from './object/ageService';
import { AgeService2 } from './object/ageService2';
import { Connection } from './object/connect';
import { Log } from './object/log';
import { Project } from './entity/project';
import { User } from './object/user';
import { ProjectResolver } from './resolver/project.resolver';

describe('graphst, Container', () => {
  beforeEach(() => {
    MetadataStorage.getStorage().clear();
  });

  const container = new Container({
    providers: [
      Connection,
      User,
      Log,
      Age,
      AgeService,
      AgeService2,
      Project,
      ProjectResolver,
    ],
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