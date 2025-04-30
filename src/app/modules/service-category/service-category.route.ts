import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ServiceCategoryValidations } from './service-category.validation';
import { ServiceCategoryController } from './service-category.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_create'),
    validate(ServiceCategoryValidations.postServiceCategoryValidationSchema),
    ServiceCategoryController.createServiceCategory,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_view'),
    ServiceCategoryController.getCategoryListAdmin,
);
router.get('/site', ServiceCategoryController.getCategoryListPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('service_edit'),
    validate(ServiceCategoryValidations.updateServiceCategoryValidationSchema),
    ServiceCategoryController.updateCategoryByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('service_delete'),
    ServiceCategoryController.deleteCategoryByAdmin,
);
export const serviceCategoryRoutes: Router = router;
