import { MetadataStorage } from '../metadata/MetadataStorage';
import { ContainerOptions } from './interfaces';

export type ConstructType = new (...args: any[]) => any;

export class Container {
  private storage = MetadataStorage.getStorage();
  private providerInstances = new Map<Function, any>();
  private resolverInstances = new Map<Function, any>();

  constructor(private readonly containerOptions: ContainerOptions) {}

  boot() {
    this.factory();
    this.resolve();
  }

  private factory() {
    // 데코레이터로 수집한 객체가 있다면  인스턴스화 해서 모아놓음
    this.containerOptions.providers?.forEach((provider) => {
      const metadata = this.storage.getProvider(provider);

      // metadata는 나중에 계속 추가될것임(미들웨어 같은거)
      // 여기서 검색을 위한 키는 게속 metadata.target이여야함

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
      const props = this.storage.getInjectProps(target);
      if (!props || props.length === 0) {
        continue;
      }

      props.forEach(({ name, prop }) => {
        const propsData = this.getProvider(prop);
        if (propsData) {
          Object.defineProperty(instance, name, {
            value: propsData,
            configurable: true,
            writable: false,
            enumerable: false,
            // [name]: propsData,
          });
        }
      });
    }
  }

  getProvider<T extends ConstructType>(target: T): InstanceType<T> {
    return this.providerInstances.get(target);
  }
}
