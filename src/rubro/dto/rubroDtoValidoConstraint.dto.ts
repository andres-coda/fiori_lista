import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { RubroDtoEditar } from "./rubroEditar.dto";

@ValidatorConstraint({ name: 'rubroDtoValido', async: false })
export class RubroDtoValidoConstraint implements ValidatorConstraintInterface {
  validate(value: RubroDtoEditar, _args: ValidationArguments): boolean {
    return !!(value && (value.id || value.rubro));
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'Debe proporcionar un ID de rubro existente o un nombre de rubro nuevo';
  }
}