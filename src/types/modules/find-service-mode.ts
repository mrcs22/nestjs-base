type FindServiceMode = 'default' | 'ensureExistence' | 'ensureActiveExistence' | 'ensureNonExistence';

type FindServiceResult<
  T,
  Mode extends FindServiceMode,
> = Mode extends 'ensureExistence'
  ? T
  : Mode extends 'ensureActiveExistence' ? T
  : Mode extends 'ensureNonExistence'
  ? undefined
  : T | undefined;

export { FindServiceMode, FindServiceResult };
