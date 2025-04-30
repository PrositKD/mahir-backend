import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { CaseValidations } from './case.validation';
import { CaseController } from './case.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('case_create'),
    validate(CaseValidations.postCaseValidationSchema),
    CaseController.createCases,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('case_view'),
    CaseController.getCaseListByAdmin,
);
router.get('/site', CaseController.getCaseListByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('case_edit'),
    validate(CaseValidations.updateCaseValidationSchema),
    CaseController.updateCaseByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('case_delete'),
    CaseController.deleteCaseByAdmin,
);
export const caseRoutes: Router = router;
