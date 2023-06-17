import { ConstructType } from '../interfaces/type';
import { MetadataStorage } from '../metadata/metadataStorage';
import { ContainerOptions } from './interfaces';

export class Container {
  private storage = MetadataStorage.getStorage();
  private providerInstances = new WeakMap<Function, any>();

  constructor(readonly containerOptions: ContainerOptions) {
    containerOptions.providers?.forEach(({ provide, valuable, callback }) => {
      const instance = valuable ? new provide(valuable) : new provide();
      if (callback) {
        callback(instance);
      }
      this.providerInstances.set(provide, instance);
    });
  }

  boot() {
    // TODO: provider를 밖에서 생성된 인스턴스를 주입받을 수 있도록
    this.factory();
    this.resolve();
  }

  private factory() {
    // 데코레이터로 수집한 객체가 있다면  인스턴스화 해서 모아놓음
    this.storage.getProviderAll().forEach(({ target }) => {
      this.providerInstances.set(target, new target());
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
