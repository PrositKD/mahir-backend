import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { ProductValidations } from './product.validation';
import { ProductController } from './product.controller';
const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('product_create'),
    validate(ProductValidations.postProductValidationSchema),
    ProductController.createProductbyPayload,
);
router.post(
    '/payment',
    auth('user'),
    validate(ProductValidations.postProductPaymentSchema),
    ProductController.createProductPayment,
);
router.patch('/payment', auth('user'), ProductController.updateProdutPayment);

router.get(
    '/orders',
    auth('admin', 'user'),
    ProductController.getProductOrders,
);
router.patch(
    '/orders',
    auth('admin', 'employee'),
    employeePermission('order_edit'),
    validate(ProductValidations.updateProductOrderSchema),
    ProductController.updateProductOrders,
);

router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('product_view'),
    ProductController.getProductListByAdmin,
);
router.get('/site', ProductController.getProductListByPublic);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('product_edit'),
    validate(ProductValidations.updateProductValidationSchema),
    ProductController.updateProductByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('product_delete'),
    ProductController.deleteProductByAdmin,
);
export const productRoutes: Router = router;
