import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { GenericRelationItemDto } from 'src/utils/helpers/dto/generic-relation-item.dto';

function IsGenericRelationItem(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        const defaultOptions: ValidationOptions = {
            message: `${propertyName} is invalid`,
        };

        registerDecorator({
            name: 'isGenericRelationItem',
            target: object.constructor,
            propertyName: propertyName,
            options: { ...defaultOptions, ...validationOptions },
            validator: {
                validate(value: any) {
                    const transformedValue: GenericRelationItemDto | null =
                        typeof value === 'string' ? JSON.parse(value) : value;

                    return !!transformedValue && !!transformedValue.id && !!transformedValue.name;
                },
            },
        });

        const itemSchema = {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    example: '1',
                },
                name: {
                    type: 'string',
                    example: 'Client 1',
                },
            },
        };

        let properties: ApiPropertyOptions = {
            type: 'object',
            properties: itemSchema.properties,
        }

        if (validationOptions?.each) properties = {
            type: 'array',
            items: itemSchema,
        }

        ApiProperty(properties)(object, propertyName);
    };
}



export { IsGenericRelationItem };