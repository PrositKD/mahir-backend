import { generateRandomNumber } from '../../utils/helpers';
import { OrderService } from './order.service';
import mongoose, { Types } from 'mongoose';
import { PaymentService } from '../payment/payment.service';
import Order from './order.model';

export const generateOrderID = async (prefix: string): Promise<any> => {
    const randomString =
        prefix + String.fromCharCode(...generateRandomNumber(7, 32)).toString();
    const exists = await Order.findOne({
        orderId: randomString,
    });
    if (exists) {
        console.error('Matched!', randomString);
        return await generateOrderID(prefix);
    }
    return randomString;
};
export const OrderConformUpdateDB = async (
    orderId: Types.ObjectId | string,
) => {
    const order = await OrderService.findOrderById(orderId);
    if (order) {
        // await OrderService.updateOrder(
        //     { _id: order._id },
        //     { status: 'accepted' },
        // );
        await PaymentService.updatePaymentByQuery(
            { _id: order.payment },
            { status: 'paid' },
        );
    }
};
