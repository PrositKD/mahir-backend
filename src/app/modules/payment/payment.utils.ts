import Stripe from 'stripe';
import paypal from 'paypal-rest-sdk';
import { SettingService } from '../setting/setting.service';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Razorpay from 'razorpay';
import httpStatus from 'http-status';
import { EventBookingUpdateDB } from '../event-booking/event-booking.utils';
import { OrderConformUpdateDB } from '../order/order.utils';
export const executeStripePayment = async ({
    amount,
    payment_type,
    booking_id,
    order_id,
}: {
    amount: number;
    payment_type: string;
    booking_id?: Types.ObjectId | undefined;
    order_id?: Types.ObjectId | undefined;
}) => {
    const setting = await SettingService.getSettings({}, '');
    if (!setting.stripe?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'stripe payment method not found.',
        );
    }
    const stripe = new Stripe(setting.stripe.credentials.stripe_secret_key);
    // @ts-ignore
    const session = await stripe.checkout.sessions.create({ payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: setting.currency_code?.toUpperCase(),
                    unit_amount: amount * 100,
                    product_data: {
                        name: 'Agency Pro',
                        description: 'Description of the Agency Pro',
                    },
                },
                quantity: 1,
            },
        ],

        metadata: {
            booking_id:
                payment_type == 'booking' && booking_id
                    ? booking_id.toString()
                    : undefined,
            order_id:
                payment_type == 'product' && order_id
                    ? order_id.toString()
                    : undefined,
        },

        invoice_creation: {
            enabled: true,
        },
        mode: 'payment',
        success_url: `${setting.client_side_url}/payment/${payment_type}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${setting.client_side_url}/payment/failed?session_id={CHECKOUT_SESSION_ID}`,
    });
    return {
        id: session.id,
        url: session.url,
    };
};

export const stripePaymentInfoDB = async ({ session }: { session: string }) => {
    const setting = await SettingService.getSettings({}, '');
    if (!setting.stripe?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'stripe payment method not found.',
        );
    }
    const stripe = new Stripe(setting.stripe.credentials.stripe_secret_key);
    const stripePayment = await stripe.checkout.sessions.retrieve(
        session as string,
    );
    const { metadata, payment_status, invoice } = stripePayment;
    if (payment_status === 'paid' && metadata?.booking_id)
        await EventBookingUpdateDB(metadata.booking_id);
    else if (payment_status === 'paid' && metadata?.order_id) {
        await OrderConformUpdateDB(metadata?.order_id);
    }
};

export const executePaypelPayment = async ({
    amount,
    payment_type,
    booking_id,
    order_id,
}: {
    amount: number;
    payment_type: string;
    booking_id?: Types.ObjectId;
    order_id?: Types.ObjectId;
}): Promise<any> => {
    const setting = await SettingService.getSettings({}, '');
    console.log(setting.currency_code);
    if (!setting.paypal?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'Paypal payment method not found.',
        );
    }
    paypal.configure({
        mode: 'sandbox',
        client_id: setting.paypal.credentials.paypal_client_id as string,
        client_secret: setting.paypal.credentials.paypal_secret_key as string,
    });
    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            return_url: `${setting.client_side_url}/payment/${payment_type}/paypal/success?booking_id=${booking_id}`,
            cancel_url: `${setting.client_side_url}/payment/failed?booking_id=${booking_id}`,
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: 'Agency payment',
                            price: amount.toString(),
                            currency: setting.currency_code?.toUpperCase(),
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: setting.currency_code?.toUpperCase(),
                    total: amount.toString(),
                },
                custom: JSON.stringify({
                    booking_id:
                        payment_type == 'booking' && booking_id
                            ? booking_id.toString()
                            : undefined,
                    order_id:
                        payment_type == 'product' && order_id
                            ? order_id.toString()
                            : undefined,
                }),
                description: `Agency paypal payment`,
            },
        ],
    };

    return new Promise((resolve, reject) => {
        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                console.log(error);
                const message =
                    error.response?.details?.[0]?.issue || 'Unknown error';
                reject(new Error(`PayPal error: ${message}`));
            } else {
                const amount = payment.transactions[0]?.amount?.total;
                let url = null;
                if (payment.links) {
                    // @ts-ignore
                    url = payment.links.find(
                        (item) => item.rel == 'approval_url',
                    ).href;
                }
                const id = payment.id;
                resolve({
                    url,
                    id,
                });
            }
        });
    });
};
export const paypalPaymentInfoDB = async ({
    paymentId,
    PayerID,
}: {
    paymentId: string;
    PayerID: string;
}) => {
    const setting = await SettingService.getSettings({}, '');
    if (!setting.paypal?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'Paypal payment method not found.',
        );
    }
    paypal.configure({
        mode: 'sandbox',
        client_id: setting.paypal.credentials.paypal_client_id as string,
        client_secret: setting.paypal.credentials.paypal_secret_key as string,
    });

    const execute_payment_json = {
        payer_id: PayerID,
    };
    paypal.payment.execute(
        paymentId,
        execute_payment_json,
        async function (error, payment) {
            if (error) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed !',
                    'Paypal payment failed',
                );
            } else {
                const transaction = payment.transactions[0];
                if (transaction.custom != null) {
                    const payload = JSON.parse(transaction.custom);
                    if (payload?.booking_id)
                        await EventBookingUpdateDB(payload.booking_id);
                    else if (payload?.order_id) {
                        await OrderConformUpdateDB(payload?.order_id);
                    }
                }
            }
        },
    );
};

export const executeRazorpayPayment = async ({
    amount,
    payment_type,
    booking_id,
    order_id,
}: {
    amount: number;
    payment_type: string;
    booking_id?: Types.ObjectId;
    order_id?: Types.ObjectId;
}) => {
    const setting = await SettingService.getSettings({}, '');
    if (!setting.razorpay?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'Razorpay payment method not found.',
        );
    }

    const razorpay = new Razorpay({
        key_id: setting.razorpay.credentials.razorpay_key_id,
        key_secret: setting.razorpay.credentials.razorpay_key_secret,
    });
    const notes: {
        booking_id?: string | null;
        order_id?: string | null;
    } = {
        booking_id:
            payment_type == 'booking' && booking_id
                ? booking_id.toString()
                : null,
        order_id:
            payment_type == 'product' && order_id ? order_id.toString() : null,
    };
    const link: any = await razorpay.paymentLink.create({
        amount: amount * 100,
        currency: setting.currency_code?.toUpperCase() || 'USD',
        description: 'Agency Payment',
        customer: {
            name: 'Agency Payment',
        },
        callback_url: `${setting.client_side_url}/payment/${payment_type}/razorpay/success`,
        callback_method: 'get',
        notes,
    });
    return {
        id: link.id,
        url: link.short_url,
    };
};
export const razorpayPaymentInfoBD = async ({
    razorpay_payment_id,
}: {
    razorpay_payment_id: string;
}) => {
    const setting = await SettingService.getSettings({}, '');
    if (!setting.razorpay?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'Razorpay payment method not found.',
        );
    }
    const razorpay = new Razorpay({
        key_id: setting.razorpay.credentials.razorpay_key_id,
        key_secret: setting.razorpay.credentials.razorpay_key_secret,
    });

    const paymentIntent = await razorpay.payments.fetch(razorpay_payment_id);
    if (paymentIntent.status !== 'captured') {
        new AppError(400, 'Request Failed', 'Invalid payment status');
    }
    if (paymentIntent.notes?.booking_id) {
        await EventBookingUpdateDB(paymentIntent.notes.booking_id);
    } else if (paymentIntent.notes?.order_id) {
        await OrderConformUpdateDB(paymentIntent.notes.order_id);
    }
};
