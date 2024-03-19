type FindServiceMode = 'default' | 'ensureExistence' | 'ensureNonExistence';

type FindServiceResult<
  T,
  Mode extends FindServiceMode,
> = Mode extends 'ensureExistence'
  ? T
  : Mode extends 'ensureNonExistence'
    ? undefined
    : T | undefined;

export { FindServiceMode, FindServiceResult };
