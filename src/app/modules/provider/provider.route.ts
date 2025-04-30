import { Router } from 'express';
import validate from '../../middleware/validate';
import { ProviderValidations } from './provider.validation';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ProviderController } from './provider.controller';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('provider_create'),
    validate(ProviderValidations.postProviderValidationSchema),
    ProviderController.createProvider,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('provider_view'),
    ProviderController.getProviderListByAdmin,
);
router.get('/site', ProviderController.getProviderListByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('provider_edit'),
    validate(ProviderValidations.updateProviderValidationSchema),
    ProviderController.updateProviderByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('provider_delete'),
    ProviderController.deleteProviderByAdmin,
);

export const providerRoutes: Router = router;
