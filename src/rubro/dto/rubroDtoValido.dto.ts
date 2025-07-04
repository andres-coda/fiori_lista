import { registerDecorator, ValidationOptions } from "class-validator";
import { RubroDtoValidoConstraint } from "./rubroDtoValidoConstraint.dto";

export function RubroDtoValido(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'rubroDtoValido',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: RubroDtoValidoConstraint,
    });
  };
}
