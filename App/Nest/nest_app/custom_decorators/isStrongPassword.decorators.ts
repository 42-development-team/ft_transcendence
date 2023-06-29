import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { Console } from "console";

export function isStrongPassword(validationOptions?: ValidationOptions) {
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
                if (!/[1-9]/.test(value))
                    return false;
                return true;
              },
            }
        })
    }
}