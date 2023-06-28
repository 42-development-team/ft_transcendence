import { registerDecorator, ValidationOptions, ValidationArguments, IsStrongPasswordOptions, ValidationDecoratorOptions } from "class-validator";

export function isStrongPassword(validationOptions?: ValidationDecoratorOptions) {
    return function(object: Object, propertyName: string) {
    registerDecorator({
        name: 'isStrongPassword',
        target: object.constructor,
        propertyName: propertyName,
        options: { 
            message: 'Password has to contain at least one Special Char, one Upper-case Char and one digit',
        },
        validator:{
            validate(value: string, args: ValidationArguments) {
                if (!value || value.length < 10)
                    return false;
                if (!/[$#!?]/.test(value)) {
                    return false;
                }
                if (!/[A-Z]/.test(value)) {
                    return false;
                }
                return true;
              },
            }
        })
    }
}