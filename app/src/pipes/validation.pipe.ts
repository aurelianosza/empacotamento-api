import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

function flattenValidationErrors(
    errors: ValidationError[],
    parentPath = ''
): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    for (const error of errors) {
        const propertyPath = parentPath
            ? `${parentPath}.${error.property}`
            : error.property;

        if (error.constraints) {
            result[propertyPath] = Object.values(error.constraints);
        }

        if (error.children && error.children.length > 0) {
            Object.assign(result, flattenValidationErrors(error.children, propertyPath));
        }
    }

    return result;
}

export const validationPipe = new ValidationPipe({
    exceptionFactory: (errors: ValidationError[]) => {

        const formattedErrors = flattenValidationErrors(errors);

        return new BadRequestException({
            statusCode: 422,
            message: 'Some fields are invalid',
            details: formattedErrors,
        });
    }
});
