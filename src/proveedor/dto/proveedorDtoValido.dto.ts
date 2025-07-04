import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'proveedorDtoValido', async: false })
export class ProveedorDtoValidoConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (!value) return false;
    if (value.id) return true;
    return !!(value.nombre && value.telefono);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Cada proveedor debe tener un ID válido, o un nombre y un teléfono';
  }
}

export function ProveedorDtoValido(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'proveedorDtoValido',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ProveedorDtoValidoConstraint,
    });
  };
}