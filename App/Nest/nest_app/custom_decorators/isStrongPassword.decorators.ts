// import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

// export function isStrongPassword(validationOptions?: ValidationOptions) {
//     return function(object: Object, propertyName: string) {
//     registerDecorator({
//         name: 'isStrongPassword',
//         target: object.constructor,
//         propertyName: propertyName,
//         options: {
//             message: 'You have to include one special char, one digit and one uppercase in password',
//         },
//         validator:{
//             validate(value: string, args: ValidationArguments) {
//                 if (!value || value.length < 10)
//                     return false;
//                 else if (!/[$#!?]/.test(value)) {
//                     return false;
//                 }
//                 else if (!/[A-Z]/.test(value)) {
//                     return false;
//                 }
//                 return /[1-9]/.test(value);
//               },
//             }
//         })
//     }
// }