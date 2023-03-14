import { AfeFormControl } from '../../abstract-controls-extension/afe-form-control';
import { ExpressionRunner } from '../expression-runner/expression-runner';
import { JsExpressionHelper } from '../helpers/js-expression-helper';
import { JsExpressionValidationModel } from '../question-models/js-expression-validation.model';
import { MachineLearningService } from '../services/machine-learning.service';
import { Validations } from './validations';

export class JsExpressionValidator {
  constructor(
    private machineLearningService: MachineLearningService,
  ) { }

  validate(model: JsExpressionValidationModel, form?: any) {
    // convert helper functions to string
    return (control: AfeFormControl): { [key: string]: any } => {
      if (!Validations.JSExpressionValidatorsEnabled) {
        return null;
      }

      const expression = model.failsWhenExpression;
      const helper = new JsExpressionHelper(this.machineLearningService);
      const dataDependencies = {};

      const helperFunctions = helper.helperFunctions;
      const runnable = new ExpressionRunner().getRunnable(
        expression,
        control,
        helperFunctions,
        dataDependencies,
        form
      );

      if (runnable.run()) {
        return {
          js_expression: { expression: expression, message: model.message }
        };
      }

      return null;
    };
  }
}
