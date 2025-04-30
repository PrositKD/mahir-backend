import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { JobCategoryController } from './job-category.controller';
import { JobCategoryValidations } from './job-category.validation';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('job_create'),
    validate(JobCategoryValidations.postJobCategoryValidationSchema),
    JobCategoryController.createJobCategoryByPayload,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('job_view'),
    JobCategoryController.getCategoryListByAdmin,
);
router.get('/categories', JobCategoryController.getCategoryListByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('job_edit'),
    validate(JobCategoryValidations.updateJobCategoryValidationSchema),
    JobCategoryController.updateJobCategoryByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('job_delete'),
    JobCategoryController.deleteJobCategoryByAdmin,
);
export const jobCategoryRoutes: Router = router;
