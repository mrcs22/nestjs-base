import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, getSchemaPath, ApiExtraModels } from "@nestjs/swagger";
import { PaginationDto } from "src/utils/pagination/dto/pagination.dto";

export interface PaginationSchema {
  totalItems: number;
  currentPage: number;
  nextPage?: number | null;
  prevPage?: number | null;
  lastPage: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createPaginationSchema = (model: any) => ({
  type: "object",
  properties: {
    pagination: {
      type: "object",
      properties: {
        totalItems: { type: "number" },
        currentPage: { type: "number" },
        nextPage: { type: "number", nullable: true },
        prevPage: { type: "number", nullable: true },
        lastPage: { type: "number" },
      },
    },
    items: {
      type: "array",
      items: { $ref: getSchemaPath(model) },
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiPaginatedResponse = (model: any) => {
  const schema = createPaginationSchema(model);

  return applyDecorators(
    ApiOkResponse({ schema }),
    ApiExtraModels(model, PaginationDto),
  );
};
