import {
  GraphQLFieldConfigMap,
  GraphQLNamedType,
  GraphQLObjectType,
  Thunk,
} from 'graphql';
import { Injectable } from '../../../decorators/injectable.decorators';
import { MetadataStorage } from '../../../metadata/MetadataStorage';

/*
스키마와 리졸버 팩토리를 나누지 말고 object, query, mutation 각각의 팩토리를 나눠 리졸버와 스키마를 동시에 리턴 하면 어떨까
그렇게 하면 한번씩만 호출해서 배열을 돌릴 수 있음
*/

@Injectable()
export class GraphqlTypeFactory {
  private storage = MetadataStorage.getStorage();

  create(): GraphQLNamedType[] {
    return this.storage.getObjectTypeAll().map(({ target, name }) => {
      const fields: Thunk<GraphQLFieldConfigMap<any, any>> = {};

      // TODO: target사용해서 fieldResolver찾아서 그것도 넣어주어야함

      // const fieldResolvers = this.storage.getFieldResolvers(
      //   () => target.constructor
      // );

      // console.log(fieldResolvers);

      this.storage.getFields(target).forEach(({ name, returnType }) => {
        const stringName = typeof name === 'symbol' ? name.toString() : name;
        fields[stringName] = { type: returnType() };
      });

      return new GraphQLObjectType({
        name,
        fields,
      });
    });
  }
}
