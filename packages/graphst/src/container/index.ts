import { GraphQLSchema } from 'graphql';
import { GraphqlFactory } from '../graphql/factory/graphqlFactory';
import { graphqlInjectList } from '../graphql/graphqlInjectList';
import { ConstructType } from '../interfaces/type';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { ContainerOptions } from './interfaces';

export class Container {
  private storage = MetadataStorage.getStorage();
  private providerInstances = new WeakMap<Function, any>();

  graphqlSchema: null | GraphQLSchema = null;

  constructor(private readonly containerOptions: ContainerOptions) {}

  boot() {
    this.containerOptions.providers = [
      ...(this.containerOptions.providers ?? []),
      ...graphqlInjectList,
    ];
    this.factory();
    this.resolve();
    this.graphqlSchema = this.getProvider(GraphqlFactory).generate();
  }

  private factory() {
    // 데코레이터로 수집한 객체가 있다면  인스턴스화 해서 모아놓음
    this.containerOptions.providers?.forEach((provider) => {
      const metadata = this.storage.getProvider(provider);

      if (metadata) {
        const instance = new metadata.target();
        // metadata.middleware()
        this.providerInstances.set(provider, instance);
      }
    });
  }

  // 인스턴스에 주입할 수 있는 인스턴스를 찾아 모두 맵핑
  private resolve() {
    const dependencies = this.storage.getInjectPropAll().map(({ target }) => ({
      target,
      instance: this.getProvider(target),
    }));

    for (const { target, instance } of dependencies) {
      const circular = (cTarget: Function, cInstance: any) => {
        const props = this.storage.getInjectProps(cTarget);

        for (const { name, prop } of props ?? []) {
          const targetProp = prop();
          const propsData = this.getProvider(targetProp);
          if (propsData) {
            circular(targetProp, propsData);
            Object.defineProperty(cInstance, name, {
              value: propsData,
              configurable: true,
              writable: false,
              enumerable: false,
              // [name]: propsData,
            });
          }
        }
      };

      circular(target, instance);
    }
  }

  getProvider<T extends ConstructType>(target: T | Function): InstanceType<T> {
    return this.providerInstances.get(target);
  }
}
