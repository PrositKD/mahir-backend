import { Router } from 'express';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import validate from '../../middleware/validate';
import { JobApplyValidations } from './job-apply.validation';
import { JobApplyController } from './job-apply.controller';

const router = Router();
router.post(
    '/',
    auth('user'),
    validate(JobApplyValidations.postJobApplyValidationSchema),
    JobApplyController.createJobApply,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('job_view'),
    JobApplyController.getJobApplyListByAdmin,
);
router.get('/site', auth('user'), JobApplyController.getJobApplyListByUser);

router.delete(
    '/:id',
    auth('admin', 'employee', 'user'),
    employeePermission('job_delete'),
    JobApplyController.deleteJobApply,
);
export const jobApplyRoutes: Router = router;
