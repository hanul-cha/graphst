import { Module } from '.';
import { Inject } from '../decorators/inject.decorators';
import { Injectable } from '../decorators/injectable.decorators';
import { Module as ModuleDecorators } from '../decorators/module.decorators';
import { MetadataStorage } from '../metadata/metadataStorage';

describe('graphst, module', () => {
  beforeEach(() => {
    MetadataStorage.getStorage().clear();
  });

  it('should create module', () => {
    @Injectable()
    class Connection {
      doTest(num: number) {
        return num;
      }
    }

    @Injectable()
    class Log {
      doTest(num: number) {
        return num;
      }
    }

    @Injectable()
    class User {
      @Inject(Connection)
      readonly connection!: Connection;

      @Inject(Log)
      readonly log!: Log;

      test() {
        return this.connection.doTest(12);
      }
    }

    @ModuleDecorators({
      providers: [Connection, User, Log],
    })
    class UserModule {}

    // 컨테이너가 해줄일
    const moduleMetadata = MetadataStorage.getStorage().modules.get(UserModule);

    const userModule = new Module(moduleMetadata!);
    userModule.boot();

    const connection = userModule.getProvider(Connection);
    const user = userModule.getProvider(User);

    expect(user.test()).toEqual(12);
    expect(connection.doTest(2)).toEqual(2);
  });
});
