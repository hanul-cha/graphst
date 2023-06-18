# Graphst(Graphql Style)

<a href="https://www.npmjs.com/package/graphst"><img alt="Version" src="https://img.shields.io/npm/v/graphst.svg?style=flat-square" /></a>

Graphst is a lightweight and easy-to-use library for creating GraphQL servers in a monolithic architecture. It provides a built-in container that handles dependency management and promotes the use of singletons.

## Features

- Simple and straightforward setup for GraphQL server
- Built-in container for dependency management

> :warning: **Important Note**: Graphst currently only supports the Code-First approach.

## Installation

```bash
npm install graphst
```

## Usage
```javascript
import { GraphstServer } from 'graphst'

const server = new GraphstServer()

server.start(4000, () => {
  console.log('Server start 🕶️');
})
```
## Auto Resolving
```ts
// AgeService
@Injectable()
class AgeService {
  getAge() {
    return ...
  }
}

// User
@Injectable()
class User {
  @Inject(() => AgeService)
  readonly ageService!: AgeService;

  getUserAge() {
    return this.ageService.getAge();
  }
}
```

## Use Query/Mutation/FiledResolver
```ts
import { Query, Mutation, FieldResolver } from 'graphst'

@Query({
  returnType: () => Project,
})
getProject(): Project {
  return ...
}

@Mutation({
  args: {
    id: () => GraphQLInt,
  },
  returnType: () => GraphQLString,
})
setProject(
  _: null,
  args: {
    id: number;
  }
): string {
  return ...
}

@FieldResolver({
  parent: () => Project,
  returnType: () => GraphQLBoolean,
  name: 'hasProject',
  args: {
    keys: () => GraphQLList(GraphQLInt),
  },
})
hasProjectByKeys(parent: Project, args: { keys?: number[] }): boolean {
  return ...
}
```

## Use Entity
```ts
@ObjectType()
class Project {
  @Field(() => GraphQLInt)
  id!: number;

  @Field(() => GraphQLString)
  name!: string;
}
```

## Auto Custom Graphql Type
> Automatic registration of user-defined GraphQL types in the schema
```ts
enum LogType {
  INFO = 'info',
  ERROR = 'error',
}

const GraphqlLogType = new GraphQLEnumType({
  name: 'LogType',
  values: {
    INFO: { value: LogType.INFO },
    ERROR: { value: LogType.ERROR },
  },
});

const GraphqlInputLogType = new GraphQLInputObjectType({
  name: 'InputLogType',
  fields: {
    type: { type: GraphqlLogType, description: 'log type' },
  },
});

const GraphqlTestObject = new GraphQLObjectType({
  name: 'TestObject',
  fields: {
    name: { type: GraphQLString },
  },
});

@ObjectType('Log')
class Log {
  @Field(() => GraphqlLogType)
  getLog!: LogType;
}

@Mutation({
  args: {
    names: () => GraphqlInputLogType,
  },
  // Automatic detection and addition of underlying types when using `GraphqlList`
  returnType: () => GraphQLList(GraphqlTestObject),
})
```
```gql
type Log {
  getLog: LogType
}

enum LogType {
  INFO
  ERROR
}

input InputLogType {
  """log type"""
  type: LogType
}

type TestObject {
  name: String
}
```

## Context & MiddleWare
> :warning: **Important Note**: The FieldResolver is not affected by the resolver middleware.

```ts
class AddRole implements MiddlewareInterface {
  // essential
  handle(props, next) {
    return next({
      ...props,
      context: {
        ...props.context,
        authRole: ['admin'],
      },
    });
  }
}
```

```ts
// global middleware
server = new GraphstServer({
  middlewares: [AddRole],
});

...

// resolver group middleware
@Resolver({
  key: () => Project,
  middlewares: [AddRole],
})

...

// query middleware, Also available in mutation and FieldResolver
@Query({
  middlewares: [AddRole],
  returnType: () => GraphQLBoolean,
})
```

<!--
  미들웨어 대상은 query, mutation, fieldResolver, resolver, 글로벌
  resolver 미들웨어에선 fieldResolver는 제외됨
 -->