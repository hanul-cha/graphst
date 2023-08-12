import { MetadataStorage } from '../metadata/metadataStorage';

export function Parent(): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    targetIndex: number
  ) => {
    setParam(target, propertyKey, targetIndex, 0);
  };
}

export function Args(): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    targetIndex: number
  ) => {
    setParam(target, propertyKey, targetIndex, 1);
  };
}

export function Context(): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    targetIndex: number
  ) => {
    setParam(target, propertyKey, targetIndex, 2);
  };
}

export function Info(): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    targetIndex: number
  ) => {
    setParam(target, propertyKey, targetIndex, 3);
  };
}

function setParam(
  target: object,
  propertyKey: string | symbol,
  targetIndex: number,
  parameterIndex: number
) {
  const storage = MetadataStorage.getStorage();

  storage.setParameter({
    target: target.constructor,
    propertyKey,
    targetIndex,
    parameterIndex,
  });
}
