import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'listaDtoValido', async: false })
export class ListaDtoValidoConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (!value) return false;
    if (value.id) return true;
    return !!(value.fecha && value.proveedor);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Cada lista debe tener un ID válido, o una fecha y un proveedor';
  }
}

export function ListaDtoValido(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'listaDtoValido',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ListaDtoValidoConstraint,
    });
  };
}