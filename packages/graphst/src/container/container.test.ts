import { Container } from '.';
import { Inject } from '../decorators/inject.decorators';
import { Injectable } from '../decorators/injectable.decorators';
import { MetadataStorage } from '../metadata/metadataStorage';

describe('graphst, Container', () => {
  beforeEach(() => {
    MetadataStorage.getStorage().clear();
  });

  it('should create container', () => {
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

    const container = new Container({
      providers: [Connection, User, Log],
    });
    container.boot();

    const connection = container.getProvider(Connection);
    const user = container.getProvider(User);

    expect(user.test()).toEqual(12);
    expect(connection.doTest(2)).toEqual(2);
  });
});
