import { MetadataStorage } from '../metadata/MetadataStorage';
import { injectableMetadata } from '../metadata/metaProps';
import { ContainerOptions } from './interfaces';

export type ConstructType = new (...args: any[]) => any;

export class Container {
  private providerInstances = new Map<Function, any>();
  private resolverInstances = new Map<Function, any>();

  constructor(private readonly containerOptions: ContainerOptions) {}

  boot() {
    this.factory();
    this.resolve();
  }

  private factory() {
    const storage = MetadataStorage.getStorage();

    this.containerOptions.providers?.forEach((provider) => {
      const metadata = storage.providers.get(provider);

      // metadata는 나중에 계속 추가될것임(미들웨어 같은거)
      // 여기서 검색을 위한 키는 게속 metadata.target이여야함

      if (metadata) {
        const instance = new metadata.target();
        // metadata.middleware()
        this.providerInstances.set(provider, instance);
      }
    });
  }

  private resolve() {
    for (const [target, instance] of this.providerInstances) {
      const props = injectableMetadata.injectProps.get(target);
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
