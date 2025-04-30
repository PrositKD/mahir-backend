import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { EventCategoryValidations } from './event-category.validation';
import { EventCategoryController } from './event-category.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('event_create'),
    validate(EventCategoryValidations.postEventCategoryValidationSchema),
    EventCategoryController.createEventCategory,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('event_view'),
    EventCategoryController.getCategoryListByAdmin,
);
router.get('/categories', EventCategoryController.getCategoryListByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('event_edit'),
    validate(EventCategoryValidations.updateEventCategoryValidationSchema),
    EventCategoryController.updateCategoryByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('event_delete'),
    EventCategoryController.deleteCategoryByAdmin,
);
export const eventCategoryRoutes: Router = router;
