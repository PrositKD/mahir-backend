interface Module {
    name: string;
    permission: string;
    child?: Array<{ name: string; permission: string }>;
}

const crud = [
    {
        name: 'Create',
        permission: 'create',
    },
    {
        name: 'Edit',
        permission: 'edit',
    },
    {
        name: 'Delete',
        permission: 'delete',
    },
    {
        name: 'View',
        permission: 'view',
    },
];

const modules: Module[] = [
    {
        name: 'Dashboard',
        permission: 'dashboard',
        child: crud,
    },
    {
        name: 'Settings',
        permission: 'setting',
        child: crud,
    },
    {
        name: 'Pages',
        permission: 'page',
        child: crud,
    },
    {
        name: 'Languages',
        permission: 'language',
        child: crud,
    },
    {
        name: 'Products',
        permission: 'product',
        child: crud,
    },
    {
        name: 'Jobs',
        permission: 'job',
        child: crud,
    },
    {
        name: 'Faqs',
        permission: 'faq',
        child: crud,
    },
    {
        name: 'Subscribers',
        permission: 'subscriber',
        child: crud,
    },
    {
        name: 'Events',
        permission: 'event',
        child: crud,
    },
    {
        name: 'Galleries',
        permission: 'gallery',
        child: crud,
    },
    {
        name: 'Services',
        permission: 'service',
        child: crud,
    },
    {
        name: 'Advertisements',
        permission: 'advertisement',
        child: crud,
    },
    {
        name: 'Subscribers',
        permission: 'subscribers',
        child: crud,
    },
    {
        name: 'Hrms',
        permission: 'hrm',
        child: crud,
    },
    {
        name: 'Blogs',
        permission: 'blog',
        child: crud,
    },
    {
        name: 'Provider',
        permission: 'provider',
        child: crud,
    },
    {
        name: 'Case',
        permission: 'case',
        child: crud,
    },
    {
        name: 'Support',
        permission: 'support',
        child: crud,
    },
    {
        name: 'Review',
        permission: 'review',
        child: crud,
    },
    {
        name: 'Contact',
        permission: 'contact',
        child: crud,
    },
];

const permissions = modules?.map((m) => {
    if (m.child) {
        return {
            ...m,
            child: m.child?.map((c) => ({
                ...c,
                permission: `${m.permission}_${c.permission}`,
            })),
        };
    }
    return m;
});
export default permissions;
