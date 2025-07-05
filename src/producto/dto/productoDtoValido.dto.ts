import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'productoDtoValido', async: false })
export class ProductoDtoValidoConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments): boolean {
    if (!value) return false;
    if (value.id) return true;
    return !!(value.producto);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Cada producto debe tener un ID válido, o un nombre de producto y un rubro';
  }
}

export function ProductoDtoValido(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'productoDtoValido',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ProductoDtoValidoConstraint,
    });
  };
}