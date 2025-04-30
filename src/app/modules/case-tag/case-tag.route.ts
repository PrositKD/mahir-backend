import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { CaseTagValidations } from './case-tag.validation';
import { CaseTagController } from './case-tag.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('case_create'),
    validate(CaseTagValidations.postTagValidationSchema),
    CaseTagController.createCaseTagbyPayload,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('case_view'),
    CaseTagController.getCaseTagListByAdmin,
);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('case_edit'),
    validate(CaseTagValidations.updateTagValidationSchema),
    CaseTagController.updateCaseTagsByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('case__delete'),
    CaseTagController.deleteCaseTagsByAdmin,
);
export const caseTagRoutes: Router = router;
