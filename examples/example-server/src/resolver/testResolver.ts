import { Inject, Mutation, Query, Resolver } from 'graphst';
import { DataSource } from 'typeorm';
import { TestTable } from '../entity/log';

@Resolver(() => TestTable)
export class TestTableResolver {
  @Inject(() => DataSource)
  dataSource!: DataSource;

  @Query({
    returnType: () => TestTable,
  })
  async getUser(): Promise<TestTable | null> {
    return this.dataSource.manager.findOne(TestTable, {
      where: {
        id: 1,
      },
    });

    // return null;
  }

  @Mutation({
    returnType: () => TestTable,
  })
  async setUser(): Promise<TestTable | null> {
    return this.dataSource.manager.save(TestTable, {
      id: 1,
      name: 'test',
    });

    // return null;
  }
}
