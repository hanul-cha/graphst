import { Container } from '../container';
import { Inject } from '../decorators/inject.decorators';
import { Injectable } from '../decorators/injectable.decorators';

class TestTable {
  getTest() {
    return '!!';
  }
}

describe('graphst, Container', () => {
  // test용 클래스
  @Injectable()
  class Log {
    doTest(num: number) {
      return num;
    }
  }

  @Injectable()
  class Connection {
    doTest(num: number) {
      return num;
    }
  }

  @Injectable()
  class Age {
    @Inject(() => Connection)
    readonly connection!: Connection;

    @Inject(() => AgeService)
    readonly ageService!: AgeService;

    test() {
      return this.connection.doTest(12);
    }

    getAge() {
      return this.ageService.getAge();
    }
  }

  @Injectable()
  class AgeService2 {
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

  @Injectable()
  class AgeService {
    @Inject(() => AgeService2)
    readonly ageService2!: AgeService2;

    getAge() {
      return this.ageService2.analyzer();
    }
  }

  @Injectable()
  class User {
    @Inject(() => Connection)
    readonly connection!: Connection;

    @Inject(() => TestTable)
    readonly testTable!: TestTable;

    @Inject(() => Age)
    readonly age!: Age;

    @Inject(() => Log)
    readonly log!: Log;

    test() {
      return this.connection.doTest(12);
    }

    getUserAge() {
      return this.age.getAge();
    }

    doTest() {
      return this.testTable.getTest();
    }
  }
  // 여기까지 test용 클래스

  const container = new Container({
    providers: [
      {
        key: TestTable,
        instance: new TestTable(),
      },
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

  it('set instance test', () => {
    const user = container.getProvider(User);
    // TODO: circular dependency test
    expect(user.doTest()).toEqual('!!');
  });
});
