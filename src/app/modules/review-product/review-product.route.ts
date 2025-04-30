import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ReviewValidations } from './review-product.validation';
import { ReviewProductController } from './review-product.controller';
const router = Router();
router.post(
    '/',
    auth('user'),
    validate(ReviewValidations.postReviewValidationSchema),
    ReviewProductController.createProductReview
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('review_view'),
    ReviewProductController.getProductReviewListByAdmin,
);
router.get(
    '/site',
    ReviewProductController.getProductReviewListByPublic
);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('job_edit'),
    validate(ReviewValidations.updateReviewValidationSchema),
    ReviewProductController.updateProductReviewByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee', 'user'),
    employeePermission('review_delete'),
    ReviewProductController.deleteProductReviewByAdmin,
);
export const productReviewRoutes: Router = router;
