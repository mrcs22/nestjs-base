interface Paginate<T> {
  data: [T[], number];
  page?: number;
  limit?: number;
}

interface PaginationControls {
  totalItems: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  lastPage: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface Paginated<T> {
  items: T[];
  pagination: PaginationControls;
}

function PaginationWrapper<T>({
  data,
  limit = 10,
  page = 1,
}: Paginate<T>): Paginated<T> {
  const [items, totalItems] = data;
  const lastPage = Math.ceil(totalItems / limit);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;

  return {
    items,
    pagination: {
      totalItems,
      currentPage: page,
      nextPage,
      prevPage,
      lastPage,
    },
  };
}

export default PaginationWrapper;
export { Paginated, Paginate, PaginationParams };
