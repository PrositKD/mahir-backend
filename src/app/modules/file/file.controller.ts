import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import {
    localDeleteFiles,
    localUploadFile,
    localUploadFiles,
    s3DeleteFiles,
    s3UploadFile,
    s3UploadFiles,
} from './file.utils';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SettingService } from '../setting/setting.service';

export class FileController {
    static singleImageUpload = catchAsync(async (req, res) => {
        const { body, files }: any = req;
        if (!files?.image) {
            throw new AppError(400, 'Invalid Request', 'Image is required');
        }
        const mimetypes = [
            'image/png',
            'image/jpeg',
            'image/webp',
            'image/jpg',
        ];
        if (!mimetypes.includes(files?.image?.mimetype)) {
            throw new AppError(
                404,
                'Invalid Request',
                'Only the image file is acceptable',
            );
        }
        const image_name: string = body.image_file_name || 'image';
        let image: any = null;
        const setting =
            await SettingService.getSettingsBySelect('file_upload_type');
        if (setting.file_upload_type == 's3') {
            image = await s3UploadFile(files.image, image_name);
        } else if (setting.file_upload_type == 'local') {
            image = await localUploadFile(files.image, image_name);
        }

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: `Image uploaded successfully.`,
            data: {
                image,
            },
        });
    });
    static singlePdfUpload = catchAsync(async (req, res) => {
        const { body, files }: any = req;
        if (!files?.pdf) {
            throw new AppError(400, 'Invalid Request', 'Image is required');
        }
        const mimetypes = ['application/pdf'];
        if (!mimetypes.includes(files?.pdf?.mimetype)) {
            throw new AppError(
                404,
                'Invalid Request',
                'Only the pdf file is acceptable',
            );
        }
        const image_name: string = body.file_name || 'pdf';
        let data: any = null;
        const setting =
            await SettingService.getSettingsBySelect('file_upload_type');
        if (setting.file_upload_type == 's3') {
            data = await s3UploadFile(files.pdf, image_name);
        } else if (setting.file_upload_type == 'local') {
            data = await localUploadFile(files.pdf, image_name);
        }

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: `Pfd file uploaded successfully.`,
            data,
        });
    });
    static multipleImageUpload = catchAsync(async (req, res) => {
        const { body, files }: any = req;
        if (!files?.images) {
            throw new AppError(400, 'Invalid Request', 'Images are required');
        }
        if (!Array.isArray(files?.images)) {
            files.images = [files.images];
        }

        const invalid = files?.images?.find(
            (file: any) =>
                !['image/jpeg', 'image/png', 'image/jpg'].includes(
                    file?.mimetype,
                ),
        );
        if (invalid) {
            throw new AppError(
                400,
                'Invalid Request',
                'Only jpeg , png and jpg files are allowed for images',
            );
        }

        const image_name = body.image_file_name || 'image';
        let images: any = null;
        const setting =
            await SettingService.getSettingsBySelect('file_upload_type');
        if (setting.file_upload_type == 's3') {
            images = await s3UploadFiles(files?.images || [], image_name);
        } else if (setting.file_upload_type == 'local') {
            images = await localUploadFiles(files.images || [], image_name);
        }
        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: `Images uploaded successfully.`,
            data: {
                images,
            },
        });
    });
    static removeImage = catchAsync(async (req, res) => {
        const { body }: any = req;
        if (!body.file) {
            throw new AppError(400, 'Invalid Request', 'File are required');
        }
        const setting =
            await SettingService.getSettingsBySelect('file_upload_type');
        if (setting.file_upload_type == 's3') {
            await s3DeleteFiles([body?.file]);
        } else if (setting.file_upload_type == 'local') {
            await localDeleteFiles([body?.file]);
        }

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'File removed successfully',
            data: undefined,
        });
    });
}
