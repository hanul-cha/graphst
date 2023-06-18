import { Query, Resolver } from 'graphst';
import { testTable } from '../entity/log';

@Resolver(() => testTable)
export class UserResolver {
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
