import { Module } from '../../../../packages/graphst/src/index';
import { User } from './user.entity';

@Module({ resolvers: [User] })
export class UserModule {}
