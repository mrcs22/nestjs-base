import { ApiProperty } from '@nestjs/swagger';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function ApiEnumFromArray(enumValues: readonly string[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ApiEnumFromArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!enumValues.includes(value)) {
            const errorMessage = `${propertyName} must be one of [${enumValues.join(', ')}]`;
            if (args.constraints) {
              throw new Error(errorMessage);
            }
            return false;
          }
          return true;
        },
      },
    });

    ApiProperty({
      type: 'enum',
      enum: enumValues,
      example: enumValues[0], 
    })(object, propertyName);
  };
}
