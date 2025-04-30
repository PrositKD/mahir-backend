import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import { SupportValidations } from './support.validation';
import { SupportController } from './support.controller';
import employeePermission from '../../middleware/employeePermission';

const router = Router();
router.post(
    '/',
    auth('user'),
    validate(SupportValidations.postSupportValidationSchema),
    SupportController.createSupportByPayload,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('support_view'),
    SupportController.getSupportListByAdmin,
);
router.get('/site', auth('user'), SupportController.getSupportListByUser);

router.delete(
    '/:id',
    auth('admin', 'user', 'employee'),
    employeePermission('support_delete'),
    SupportController.deleteServiceByAdminAndUser,
);
export const supportRouters: Router = router;
