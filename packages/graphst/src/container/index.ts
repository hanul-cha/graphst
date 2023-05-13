import { ConstructType } from '../interfaces/type';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { ContainerOptions } from './interfaces';

export class Container {
  private storage = MetadataStorage.getStorage();
  private providerInstances = new Map<Function, any>();

  constructor(private readonly containerOptions: ContainerOptions) {}

  boot() {
    this.factory();
    this.resolve();
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
    for (const [target, instance] of this.providerInstances) {
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

  getProvider<T extends ConstructType>(target: T): InstanceType<T> {
    return this.providerInstances.get(target);
  }
}
