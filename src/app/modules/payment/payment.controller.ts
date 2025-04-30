import { catchAsync } from '../../utils/catchAsync';
import { Stripe } from  'stripe';
import { SettingService } from '../setting/setting.service';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { EventBookingUpdateDB } from '../event-booking/event-booking.utils';
import { OrderConformUpdateDB } from '../order/order.utils';
import sendResponse from '../../utils/sendResponse';

export class PaymentController {
    static updateStripePaymentWithWebhook = catchAsync(async (req, res,next) => {
        const settings = await SettingService.getSettingsBySelect("stripe");
        const stripe = new Stripe(settings.stripe?.credentials.stripe_secret_key as string);
        const sig = req.headers['stripe-signature'] as string | string[];
        let event: any;
        try {
            const endpointSecret = settings.stripe?.credentials.stripe_webhook_secret as string;
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (error) {
            throw new AppError(
                 httpStatus.BAD_REQUEST,
                "Request Failed !",
                "web hook provide an error"
            )
        }
        const session = await mongoose.connection.startSession();
        session.startTransaction();
        try {
            switch (event.type) {
                case 'checkout.session.completed':
                    if(event.data.object.booking_id){
                        await EventBookingUpdateDB(event.data.object.booking_id);
                    }else if(event.data.object.order_id){
                        await OrderConformUpdateDB(event.data.object.order_id);
                    }
                    console.log(event.data.object);
                    break;
                case 'checkout.session.expired':
                    console.log(event.data.object);
                    break;
                case 'checkout.session.async_payment_failed':
                    console.log(event.data.object);
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
            await session.commitTransaction();
            sendResponse(res,{
                statusCode:httpStatus.OK,
                success:true,
                message:"Payment completed successfully",
                data:undefined,
            })

        } catch (error) {
            await session.abortTransaction();
            next(error);
        } finally {
            await session.endSession();
        }
    })
}