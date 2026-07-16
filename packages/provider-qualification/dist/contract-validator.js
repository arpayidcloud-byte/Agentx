/**
 * @module provider-qualification/contract-validator
 * @description Validates strict interface implementation.
 */
import { ContractValidationError } from './errors.js';
export class ContractValidator {
    validate(provider, requiredMethods) {
        for (const method of requiredMethods) {
            if (typeof provider[method] !== 'function') {
                throw new ContractValidationError(`Provider ${provider.getMetadata().id} missing method: ${method}`, 'contract-validator');
            }
        }
    }
}
//# sourceMappingURL=contract-validator.js.map