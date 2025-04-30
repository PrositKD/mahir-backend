import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';

import { DashboardService } from './dashboard.service';
import mongoose from 'mongoose';

export class DashboardController {
    static getDashboard = catchAsync(async (req, res) => {
        const { query }: any = req;
        const { user } = res.locals;
        let data = null;
        if (user.role == 'user') {
            const filter = {
                user: new mongoose.Types.ObjectId(user._id),
            };
            data = await DashboardService.findDashboardByQuery(
                filter,
                query,
                {},
            );
        } else {
            data = await DashboardService.findDashboard();
        }

        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Get dashboard successfully',
            data,
        });
    });
}
