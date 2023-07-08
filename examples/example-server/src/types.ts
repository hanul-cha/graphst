import { GraphQLObjectType } from 'graphql';
import { getObjectSchema } from 'graphst';
import { TestTable2 } from './entity/log2';

export const GraphqlCustomType = new GraphQLObjectType({
  name: 'TestTable2withData',
  fields: {
    data: {
      type: new GraphQLObjectType({
        name: 'data',
        fields: {
          table: { type: getObjectSchema(TestTable2) },
        },
      }),
    },
  },
});

export interface CustomType {
  data: {
    table: TestTable2;
  };
}
