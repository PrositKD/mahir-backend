import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ServiceTagController } from './service-tag.controller';
import { ServiceTagValidations } from './service-tag.validation';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_create'),
    validate(ServiceTagValidations.postTagValidationSchema),
    ServiceTagController.createTags,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_view'),
    ServiceTagController.getTagListByAdmin,
);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_edit'),
    validate(ServiceTagValidations.updateTagValidationSchema),
    ServiceTagController.updateTagsByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('service_delete'),
    ServiceTagController.deleteTagsByAdmin,
);
export const serviceTagRoutes: Router = router;
