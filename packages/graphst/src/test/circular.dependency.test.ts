import { Container } from '../container';
import { Inject } from '../decorators/inject.decorators';
import { Injectable } from '../decorators/injectable.decorators';

describe('graphst, circular.dependency.test', () => {
  // test용 클래스
  @Injectable()
  class Circular1 {
    @Inject(() => Circular2)
    circular2!: Circular2;

    doTest1(num: number) {
      return this.circular2.doTest2(num);
    }

    doTestNew(num: number) {
      return this.circular2.doTestNew(num);
    }
  }

  @Injectable()
  class Circular3 {
    @Inject(() => Circular1)
    circular1!: Circular1;

    doTest3(num: number) {
      return this.circular1.doTestNew(num);
    }
  }

  @Injectable()
  class Circular2 {
    @Inject(() => Circular3)
    circular3!: Circular3;

    doTest2(num: number) {
      return this.circular3.doTest3(num);
    }

    doTestNew(num: number) {
      return num;
    }
  }
  // 여기까지 test용 클래스

  const container = new Container({});
  container.boot();

  // 순환종속성 주입 테스트
  it('Circular Dependency injection testing', () => {
    const circular1 = container.getProvider(Circular1);
    const circular2 = container.getProvider(Circular2);

    if (!circular1 || !circular2) {
      throw new Error('instance is undefined');
    }

    expect(circular1.doTest1(1)).toEqual(1);
  });
});
