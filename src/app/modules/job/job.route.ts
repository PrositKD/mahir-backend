import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { JobValidations } from './job.validation';
import { JobController } from './job.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('job_create'),
    validate(JobValidations.postJobValidationSchema),
    JobController.createCategoryByPayload,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('job_view'),
    JobController.getJobListByAdmin,
);
router.get('/site', JobController.getJobListByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('job_edit'),
    validate(JobValidations.updateJobValidationSchema),
    JobController.updateJobCategoryByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('job_delete'),
    JobController.deleteJobCategoryByAdmin,
);
export const jobRoutes: Router = router;
