import Payment from './payment.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Types } from 'mongoose';
export class PaymentService {
    static createPaymentByPayload = async (payload: any) => {
        const payment = await Payment.create(payload);
        if (!payment) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed !',
                'Payment Request Failed ! Please try again later',
            );
        }
        return payment;
    };
    static updatePaymentByQuery = async (
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) => {
        const options = {
            new: true,
            session,
        };
        const data = await Payment.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    };
}
