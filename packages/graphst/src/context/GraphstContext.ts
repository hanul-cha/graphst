import { IncomingMessage } from 'node:http';

export abstract class GraphstContextClass {
  abstract result(req: IncomingMessage): any;
}
