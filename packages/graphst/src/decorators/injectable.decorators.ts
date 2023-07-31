import { MetadataStorage } from '../metadata/metadataStorag';

export function Injectable(): ClassDecorator {
  const storage = MetadataStorage.getStorage();
  return (target: Function) => {
    storage.setProvider(target, { target: target as any });
  };
}
