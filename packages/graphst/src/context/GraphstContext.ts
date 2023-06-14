import { IncomingMessage } from 'node:http';

export abstract class GraphstContext {
  abstract result(req: IncomingMessage): any;
}
