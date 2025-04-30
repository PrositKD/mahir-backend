import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { EventValidations } from './event.validation';
import { EventController } from './event.controller';

const router = Router();
router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('event_create'),
    validate(EventValidations.postEventValidationSchema),
    EventController.createEventPayload,
);
router.post(
    '/payment',
    auth('user'),
    validate(EventValidations.postEventBookingPaymentSchema),
    EventController.createEventPaymentPayload,
);
router.patch('/payment', auth('user'), EventController.conformEventPayment);
router.patch(
    '/booking',
    auth('admin' , "employee"),
    validate(EventValidations.updateEventBookingSchema),
    EventController.updateEventBooking,
);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('event_view'),
    EventController.getEventListByAdmin,
);
router.get('/site', EventController.getEventListByPublic);
router.get('/bookings', auth('user', 'admin'), EventController.getEventBooking);
router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('event_edit'),
    validate(EventValidations.updateEventValidationSchema),
    EventController.updateEventByAdmin,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('event_delete'),
    EventController.deleteEventByAdmin,
);
export const eventRoutes: Router = router;
