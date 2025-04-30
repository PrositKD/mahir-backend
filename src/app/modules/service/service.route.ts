import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ServiceValidations } from './service.validation';
import { ServiceController } from './service.controller';
const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_create'),
    validate(ServiceValidations.postServiceValidationSchema),
    ServiceController.createServiceByPayload,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_view'),
    ServiceController.getServiceListByAdmin,
);
router.get('/site', ServiceController.getServiceListByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_edit'),
    validate(ServiceValidations.updateServiceValidationSchema),
    ServiceController.updateServiceByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('service_delete'),
    ServiceController.deleteServiceByAdmin,
);
export const serviceRoutes: Router = router;
