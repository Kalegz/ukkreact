import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState, type ReactElement } from 'react';

export default function Industries({ industries }: { industries: any[] }): ReactElement {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
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
        <AppLayout>
            <Head title="Industries" />

            <div className="p-6 bg-white rounded-lg shadow-md relative">
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                        <h2 className="text-xl font-semibold mb-4">Create Industry</h2>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✖
                        </button>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
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
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
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
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
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
