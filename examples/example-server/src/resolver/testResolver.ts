import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import {
  Args,
  FieldResolver,
  getInstance,
  getObjectSchema,
  GraphstError,
  Inject,
  Mutation,
  Query,
  Resolver,
} from 'graphst';
import { DataSource } from 'typeorm';
import { TestTable } from '../entity/log';
import { TestTable2 } from '../entity/log2';
import { TestService } from '../service/testService';
import { CustomType, GraphqlCustomType } from '../types';

@Resolver(() => TestTable)
export class TestTableResolver {
  @Inject(() => DataSource)
  dataSource!: DataSource;

  @Inject(() => TestService)
  testService!: TestService;

  @Query({
    returnType: () => GraphQLInt,
  })
  version() {
    const dataSource = getInstance(DataSource);
    console.log(dataSource);
    throw new GraphstError('test');
  }

  @Query({
    args: {
      id: () => GraphQLNonNull(GraphQLID),
    },
    returnType: () => TestTable,
  })
  async getUser(@Args() args: { id: number }): Promise<TestTable | null> {
    return this.dataSource.manager.findOne(TestTable, {
      where: {
        id: args.id,
      },
    });
  }

  @FieldResolver({
    parent: () => TestTable,
    returnType: () => GraphQLInt,
  })
  async getId(parent: TestTable): Promise<number> {
    return parent.id;
  }

  @FieldResolver({
    parent: () => TestTable,
    returnType: () =>
      GraphQLNonNull(GraphQLList(GraphQLNonNull(getObjectSchema(TestTable2)))),
  })
  async getLog2s(parent: TestTable): Promise<TestTable2[]> {
    return [];
  }

  @FieldResolver({
    parent: () => TestTable2,
    returnType: () => GraphQLNonNull(GraphqlCustomType),
  })
  async getLogs(parent: TestTable): Promise<CustomType> {
    return {
      data: {
        table: {
          id: 1,
          name: '테스트',
        },
      },
    };
  }

  @Mutation({
    args: {
      name: () => GraphQLNonNull(GraphQLString),
    },
    returnType: () => TestTable,
  })
  async setUser(_: null, args: { name: string }): Promise<TestTable | null> {
    return this.dataSource.manager.save(
      this.dataSource.manager.create(TestTable, {
        name: args.name,
      })
    );
  }
}
