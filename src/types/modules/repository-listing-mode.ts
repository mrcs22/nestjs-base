type DefaultSimplifiedListedData = {
  id: string;
};

type RepositoryListingResult<
  T,
  Simplified extends boolean,
> = Simplified extends true
  ? [DefaultSimplifiedListedData[], number]
  : [T[], number];

export { RepositoryListingResult, DefaultSimplifiedListedData };
