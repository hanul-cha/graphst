import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { FieldResolver, Inject, Mutation, Query, Resolver } from 'graphst';
import { DataSource } from 'typeorm';
import { TestTable } from '../entity/log';
import { TestService } from '../service/testService';

@Resolver(() => TestTable)
export class TestTableResolver {
  @Inject(() => DataSource)
  dataSource!: DataSource;

  @Inject(() => TestService)
  testService!: TestService;

  @Query({
    args: {
      id: () => GraphQLNonNull(GraphQLID),
    },
    returnType: () => TestTable,
  })
  async getUser(_: null, args: { id: number }): Promise<TestTable | null> {
    console.log(this.testService.getTest());
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

    // return null;
  }
}
