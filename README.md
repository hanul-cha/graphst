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
TODO

## Context & MiddleWare
TODO