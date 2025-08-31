import { ValidationError } from "@nestjs/common";

function getAllValidationErrorConstraints(errors: ValidationError[]): string[] {
  const constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const constraintValues = Object.values(error.constraints);
      constraints.push(...constraintValues);
    }

    if (error.children) {
      const childConstraints = getAllValidationErrorConstraints(error.children);
      constraints.push(...childConstraints);
    }
  }

  return constraints;
}

export { getAllValidationErrorConstraints };
