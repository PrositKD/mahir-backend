import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { CaseCategoryValidations } from './case-category.validation';
import { CaseCategoryController } from './case-category.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('case_create'),
    validate(CaseCategoryValidations.postCaseCategoryValidationSchema),
    CaseCategoryController.createCaseCategory,
);
router.get('/', CaseCategoryController.getCategoryList);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('case_edit'),
    validate(CaseCategoryValidations.updateCaseCategoryValidationSchema),
    CaseCategoryController.updateCaseCatgeoyByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('case_delete'),
    CaseCategoryController.deleteCategoryByAdmin,
);
export const caseCategoryRoutes: Router = router;
