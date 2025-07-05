import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'productoDtoValido', async: false })
export class ListaProductoDtoValidoConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (!value) return false;
    if (value.id) return true;
    return !!(value.producto && value.cantidad);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Cada producto de lista debe tener un ID válido, o un producto y una cantidad';
  }
}

export function listaProductoDtoValido(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'listaProductoDtoValido',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ListaProductoDtoValidoConstraint,
    });
  };
}