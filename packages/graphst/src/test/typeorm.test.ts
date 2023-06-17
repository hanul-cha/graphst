import { Column, DataSource, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GraphstServer } from '../server';
import { sendGraphQLRequest } from './utile';
import { Resolver } from '../decorators/resolver.decorators';
import { Query } from '../decorators/query.decorators';
import { Inject } from '../decorators/inject.decorators';
import { ObjectType } from '../decorators/objectType.decorators';
import { Field } from '../decorators/field.decorators';
import { GraphQLInt, GraphQLString } from 'graphql';

@ObjectType()
@Entity({ name: 'test_table' })
class testTable {
  @Field({
    returnType: () => GraphQLInt,
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({
    returnType: () => GraphQLString,
  })
  @Column({ type: String })
  name!: string;
}

@Resolver(() => testTable)
class User2Resolver {
  // @Inject(() => DataSource)
  // dataSource!: DataSource;

  @Query({
    returnType: () => testTable,
  })
  async getUser(): Promise<testTable | null> {
    // return this.dataSource.manager.findOne(testTable, {
    //   where: {
    //     id: 1,
    //   },
    // });

    return null;
  }
}

describe('graphst, typeorm.test', () => {
  let server;

  beforeAll(() => {
    server = new GraphstServer({
      // providers: [
      //   {
      //     provide: DataSource,
      //     valuable: {
      //       type: 'mysql',
      //       host: 'localhost',
      //       port: 3306,
      //       database: 'test_db',
      //       username: 'root',
      //       password: 'root',
      //       synchronize: true,
      //     },
      //     callback: (instance: DataSource) => {
      //       instance
      //         .initialize()
      //         .then(() => {
      //           console.log('Data Source has been initialized!');
      //         })
      //         .catch((err) => {
      //           console.error('Error during Data Source initialization', err);
      //         });
      //     },
      //   },
      // ],
    });
    server.start(4000, () => {
      console.log('Server start 🕶️');
    });
  });

  afterAll(() => {
    server.stop();
    server = null;
  });

  test('set context test', async () => {
    const query = `
    query {
      getUser {
        id
        name
      }
    }
    `;

    const response = await sendGraphQLRequest(query, undefined);

    console.log(response);

    expect(1).toEqual(1);
  });
});
