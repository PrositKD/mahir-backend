import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ReviewValidations } from './review.validation';
import { ReviewController } from './review.controller';
const router = Router();
router.post(
    '/',
    auth('user', 'admin'),
    validate(ReviewValidations.postReviewValidationSchema),
    ReviewController.createReviewByPayload,
);
router.get(
    '/',
    auth('admin', 'employee', 'user'),
    employeePermission('review_view'),
    ReviewController.getReviewListByAdmin,
);
router.get('/site', ReviewController.getReviewListByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('job_edit'),
    validate(ReviewValidations.updateReviewValidationSchema),
    ReviewController.updateReviewByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee', 'user'),
    employeePermission('review_delete'),
    ReviewController.deleteReviewByAdmin,
);
export const reviewRoutes: Router = router;
