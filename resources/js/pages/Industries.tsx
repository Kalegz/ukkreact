import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect, type ReactElement } from 'react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import Pagination from '@/components/pagination';
import Modal from '@/components/modal';
import { useDebounce } from '@/components/use-debounce';
import { type BreadcrumbItem, type Industry, type PaginationData, type IndustriesProps } from '@/types/custom';
import { Briefcase, MapPin, Phone, Mail, Globe } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Industries', href: '/industries' },
];

export default function Industries({ industries, filters, pagination, authStudent }: IndustriesProps): ReactElement {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        business_field: '',
        address: '',
        contact: '',
        email: '',
        website: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [formError, setFormError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        router.get(
            route('industries'),
            { search: debouncedSearch },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }, [debouncedSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        post(route('industries.store'), {
            onError: (errors) => {
                setFormError(
                    errors.name ||
                    errors.business_field ||
                    errors.address ||
                    errors.contact ||
                    errors.email ||
                    errors.website ||
                    'An error occurred while creating the industry.'
                );
            },
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('industries'),
            { search, page },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    if (!industries || !pagination) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Industries" />
                <div className="p-4 sm:p-6 mt-4 text-red-500">Error: Missing industries or pagination data</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Industries" />
            <div className="p-4 sm:p-6 mt-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
                <FlashMessage />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Industries</h1>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Search Industry's name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full sm:w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            aria-label="Search industries"
                        />
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={!authStudent}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto disabled:opacity-50 cursor-pointer"
                            title={authStudent ? 'Create Industry' : 'Only students can create industries'}
                        >
                            + Create Industry
                        </button>
                    </div>
                </div>

                {industries.length === 0 ? (
                    <div className="text-gray-600 dark:text-gray-400 text-center">No Industries Found</div>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {industries.map((industry) => (
                            <li key={industry.id} className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                                <p className="mb-2 font-semibold text-lg text-gray-900 dark:text-gray-100 flex items-center">
                                    {industry.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                    {industry.address}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <Briefcase className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                    {industry.business_field}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                    {industry.contact}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                    {industry.email}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                    <Globe className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                                    <a
                                        href={industry.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                    >
                                        {industry.website}
                                    </a>
                                </p>
                            </li>
                        ))}
                    </ul>
                )}

                <Pagination
                    currentPage={pagination.current_page}
                    lastPage={pagination.last_page}
                    onPageChange={handlePageChange}
                />

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Industry">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* {formError && (
                            <div className="p-2 bg-red-100 border-l-4 border-red-500 text-red-700">{formError}</div>
                        )} */}
                        {[
                            { id: 'name', label: 'Name*', type: 'text', required: true },
                            { id: 'business_field', label: 'Business Field*', type: 'text', required: true },
                            { id: 'address', label: 'Address*', type: 'text', required: true },
                            { id: 'contact', label: 'Contact*', type: 'text', required: true },
                            { id: 'email', label: 'Email*', type: 'email', required: true },
                            { id: 'website', label: 'Website*', type: 'url', required: true },
                        ].map((field) => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    id={field.id}
                                    value={data[field.id as keyof typeof data]}
                                    onChange={(e) => setData(field.id as keyof typeof data, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-[#171717] text-gray-900 dark:text-gray-100"
                                    required={field.required}
                                    aria-describedby={errors[field.id as keyof typeof errors] ? `${field.id}-error` : undefined}
                                />
                                {errors[field.id as keyof typeof errors] && (
                                    <div id={`${field.id}-error`} className="text-red-500 text-sm mt-1">
                                        {errors[field.id as keyof typeof errors]}
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="submit"
                            disabled={processing || !authStudent}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto disabled:opacity-50 cursor-pointer"
                        >
                            Submit
                        </button>
                    </form>
                </Modal>
            </div>
        </AppLayout>
    );
}