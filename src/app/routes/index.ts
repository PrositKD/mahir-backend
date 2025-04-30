import { Router } from 'express';
import { settingRoutes } from '../modules/setting/setting.route';
import { fileRouters } from '../modules/file/file.route';
import { userRoutes } from '../modules/user/user.route';
import { otpRoutes } from '../modules/otp/otp.route';
import { authRoutes } from '../modules/auth/auth.route';
import { languageRoutes } from '../modules/setting-language/setting-language.route';
import { hrmRoleRoutes } from '../modules/hrm-role/hrm-role.route';
import { pageRoutes } from '../modules/setting-page/setting-page.route';
import { tagRoutes } from '../modules/blog-tag/blog-tag.route';
import { blogCategoryRoutes } from '../modules/blog-category/blog-category.route';
import { blogRoutes } from '../modules/blog/blog.route';
import { faqRoutes } from '../modules/faq/faq.route';
import { subscriberRoutes } from '../modules/subscriber/subscriber.route';
import { advertisementRouter } from '../modules/advertisement/advertisement.route';
import { serviceCategoryRoutes } from '../modules/service-category/service-category.route';
import { eventCategoryRoutes } from '../modules/event-category/event-category.route';
import { eventRoutes } from '../modules/event/event.route';
import { providerRoutes } from '../modules/provider/provider.route';
import { serviceRoutes } from '../modules/service/service.route';
import { contactRoutes } from '../modules/contact/contact.route';
import { serviceTagRoutes } from '../modules/service-tag/service-tag.route';
import { jobCategoryRoutes } from '../modules/job-category/job-category.route';
import { jobRoutes } from '../modules/job/job.route';
import { reviewRoutes } from '../modules/review/review.route';
import { productCategoryRoutes } from '../modules/product-category/product-category.route';
import { jobApplyRoutes } from '../modules/job-apply/job-apply.route';
import { productRoutes } from '../modules/product/product.route';
import { supportRouters } from '../modules/support/support.route';
import { caseTagRoutes } from '../modules/case-tag/case-tag.route';
import { caseCategoryRoutes } from '../modules/case-category/case-category.route';
import { caseRoutes } from '../modules/case/case.route';
import { dashboardRoutes } from '../modules/dashboard/dashboard.route';
import { productReviewRoutes } from '../modules/review-product/review-product.route';
// import { paymentRoutes } from '../modules/payment/payment.route';

const router = Router();

const moduleRouters = [
    {
        path: '/users',
        route: userRoutes,
    },
    {
        path: '/dashboards',
        route: dashboardRoutes,
    },
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/hrm/roles',
        route: hrmRoleRoutes,
    },
    {
        path: '/otps',
        route: otpRoutes,
    },
    {
        path: '/files',
        route: fileRouters,
    },
    {
        path: '/subscribers',
        route: subscriberRoutes,
    },
    {
        path: '/blogs',
        route: blogRoutes,
    },
    {
        path: '/blog-categories',
        route: blogCategoryRoutes,
    },
    {
        path: '/blog-tags',
        route: tagRoutes,
    },
    {
        path: '/advertisements',
        route: advertisementRouter,
    },
    {
        path: '/faqs',
        route: faqRoutes,
    },
    {
        path: '/contacts',
        route: contactRoutes,
    },
    {
        path: '/job-categories',
        route: jobCategoryRoutes,
    },
    {
        path: '/jobs',
        route: jobRoutes,
    },
    {
        path: '/job-applies',
        route: jobApplyRoutes,
    },
    {
        path: '/products',
        route: productRoutes,
    },
    {
        path: '/product-categories',
        route: productCategoryRoutes,
    },{
       path: '/product-reviews',
        route: productReviewRoutes,
    },
    {
        path: '/cases',
        route: caseRoutes,
    },
    {
        path: '/case-tags',
        route: caseTagRoutes,
    },
    {
        path: '/case-categories',
        route: caseCategoryRoutes,
    },
    {
        path: '/supports',
        route: supportRouters,
    },
    {
        path: '/services',
        route: serviceRoutes,
    },
    {
        path: '/service-tags',
        route: serviceTagRoutes,
    },
    {
        path: '/service-categories',
        route: serviceCategoryRoutes,
    },
    {
        path: '/events',
        route: eventRoutes,
    },
    {
        path: '/event-categories',
        route: eventCategoryRoutes,
    },
    {
        path: '/providers',
        route: providerRoutes,
    },
    {
        path: '/reviews',
        route: reviewRoutes,
    },
    {
        path: '/settings',
        route: settingRoutes,
    },
    // {
    //   path: '/payments',
    //   route: paymentRoutes,
    // },
    {
        path: '/settings/languages',
        route: languageRoutes,
    },
    {
        path: '/settings/pages',
        route: pageRoutes,
    },
];

moduleRouters.forEach((route) => router.use(route.path, route.route));
export default router;
