import { Injectable } from '../../decorators/injectable.decorators';
import { MetadataStorage } from '../../metadata/metadataStorage';

@Injectable()
export class GraphqlArgsFactory {
  private storage = MetadataStorage.getStorage();

  setArgsOrder(
    {
      parent,
      args,
      context,
      info,
    }: {
      parent: any;
      args: any;
      context: any;
      info: any;
    },
    resolver?: Function,
    originalName?: string | symbol
  ): any[] {
    const defaultArgs = [parent, args, context, info];

    const argsOrder =
      resolver && originalName
        ? this.storage.getParameter(resolver, originalName)
        : null;

    if (!argsOrder) {
      return defaultArgs;
    }

    return argsOrder.map((index) => {
      if (typeof index === 'number') {
        return defaultArgs[index];
      }
      return null;
    });
  }
}
