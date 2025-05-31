import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, type ReactElement } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Industries',
        href: '/industries',
    },
];

export default function Industries({ industries }: { industries: any[] }): ReactElement {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        business_field: '',
        address: '',
        contact: '',
        email: '',
        website: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('industries.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Industries" />

            <div className="p-6 mt-4 rounded-lg shadow-md relative">
                {/* Flash Messages */}
                {flash.success && (
                    <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                        {flash.error}
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Industries</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        + Create Industry
                    </button>
                </div>

                {industries.length === 0 ? (
                    <div className="text-gray-600">No Industries Found</div>
                ) : (
                    <ul className="space-y-2">
                        {industries.map((industry) => (
                            <li key={industry.id} className="p-2 border rounded-md">
                                <p className="font-semibold">{industry.name}</p>
                                {industry.address && <p className="text-sm text-gray-500">{industry.address}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
                    <div className="dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <h2 className="text-xl font-semibold mb-4">Create Industry</h2>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✖
                        </button>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium">
                                    Name*
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>

                            <div>
                                <label htmlFor="business_field" className="block text-sm font-medium">
                                    Business Field
                                </label>
                                <input
                                    type="text"
                                    id="business_field"
                                    value={data.business_field}
                                    onChange={(e) => setData('business_field', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {errors.business_field && (
                                    <div className="text-red-500 text-sm">{errors.business_field}</div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {errors.address && <div className="text-red-500 text-sm">{errors.address}</div>}
                            </div>

                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium">
                                    Contact
                                </label>
                                <input
                                    type="text"
                                    id="contact"
                                    value={data.contact}
                                    onChange={(e) => setData('contact', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {errors.contact && <div className="text-red-500 text-sm">{errors.contact}</div>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>

                            <div>
                                <label htmlFor="website" className="block text-sm font-medium">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                                {errors.website && <div className="text-red-500 text-sm">{errors.website}</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}