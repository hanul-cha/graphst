import { ConstructType } from '../types';
import { MetadataStorage } from '../metadata/metadataStorage';
import { ContainerOptions } from './interfaces';

const providerInstances = new WeakMap<Function, InstanceType<ConstructType>>();

export function getInstance<T extends ConstructType>(
  target: T
): InstanceType<T> {
  const instance = Container.getProvider(target);

  if (!instance) {
    throw new Error(`Not found instance ${target.name}`);
  }
  return instance;
}

export class Container {
  static getProvider<T extends ConstructType>(
    target: T | Function
  ): InstanceType<T> | undefined {
    return providerInstances.get(target);
  }
  private storage = MetadataStorage.getStorage();

  constructor(readonly containerOptions: ContainerOptions) {
    containerOptions.providers?.forEach(({ key, instance }) => {
      providerInstances.set(key, instance);
    });
  }

  boot() {
    this.factory();
    this.resolve();
  }

  private factory() {
    // 데코레이터로 수집한 객체가 있다면  인스턴스화 해서 모아놓음
    this.storage.getProviderAll().forEach(({ target }) => {
      providerInstances.set(target, new target());
    });
  }

  // 인스턴스에 주입할 수 있는 인스턴스를 찾아 모두 맵핑
  private resolve() {
    const dependencies = this.storage.getInjectPropAll().map(({ target }) => ({
      target,
      instance: this.getProvider(target),
    }));

    const circular = (
      cTarget: Function,
      cInstance: any,
      currentTargets = new Set<Function>()
    ) => {
      if (dependencies.length === 0) {
        return;
      }
      const props = this.storage.getInjectProps(cTarget);

      for (const { name, prop } of props ?? []) {
        if (cInstance[name]) {
          continue;
        }
        const targetProp = prop();
        const propsData = this.getProvider(targetProp);

        if (propsData) {
          // 순환종속이 일어난게 아니라면 재귀
          if (!currentTargets.has(targetProp)) {
            circular(targetProp, propsData, currentTargets.add(cTarget));
          }
          Object.defineProperty(cInstance, name, {
            value: propsData,
            configurable: true,
            writable: false,
            enumerable: false,
          });
        }
      }
    };

    for (const { target, instance } of dependencies) {
      circular(target, instance);
    }
  }

  getProvider<T extends ConstructType>(
    target: T | Function
  ): InstanceType<T> | undefined {
    return providerInstances.get(target);
  }
}
