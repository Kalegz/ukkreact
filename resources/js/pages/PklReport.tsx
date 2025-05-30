import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, type ReactElement } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PKL Report',
        href: '/pkl-report',
    },
];

export default function PklReport({
    pklAssignments,
    students,
    teachers,
    industries,
}: {
    pklAssignments: any[];
    students: any[];
    teachers: any[];
    industries: any[];
}): ReactElement {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        teacher_id: '',
        industry_id: '',
        start_date: '',
        end_date: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation for 90-day minimum duration
        if (data.start_date && data.end_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.end_date);
            const diffTime = endDate.getTime() - startDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 90) {
                alert('The PKL duration must be at least 90 days.');
                return;
            }
            if (isNaN(diffDays) || diffDays < 0) {
                alert('Invalid date range. Please ensure the end date is after the start date.');
                return;
            }
        }

        // Submit the form data as-is (dates in YYYY-MM-DD format)
        post(route('pkl-report.store'), {
            onError: (errors) => {
                console.log('Submission errors:', errors);
            },
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PKL Report" />
            <div className="p-6 mt-4 rounded-lg shadow-md relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">PKL Report</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        + Create PKL Report
                    </button>
                </div>

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

                {/* Daftar PKL Report */}
                <div className="p-6 rounded-lg shadow-md">
                    <h2 className="text-xl mb-4">PKL Reports</h2>
                    {pklAssignments.length === 0 ? (
                        <p>No PKL reports found.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Teacher
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Industry
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        End Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {pklAssignments.map((assignment) => (
                                    <tr key={assignment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{assignment.student?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{assignment.teacher?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{assignment.industry?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(assignment.start_date).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(assignment.end_date).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg relative">
                            <h2 className="text-xl font-semibold mb-4">Create PKL Report</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                ✖
                            </button>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="student_id" className="block text-sm font-medium">
                                        Student*
                                    </label>
                                    <select
                                        id="student_id"
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value)}
                                        className="dark:bg-gray-800 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select Student</option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.student_id && (
                                        <div className="text-red-500 text-sm mt-1">{errors.student_id}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="teacher_id" className="block text-sm font-medium">
                                        Teacher*
                                    </label>
                                    <select
                                        id="teacher_id"
                                        value={data.teacher_id}
                                        onChange={(e) => setData('teacher_id', e.target.value)}
                                        className="dark:bg-gray-800 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select Teacher</option>
                                        {teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.teacher_id && (
                                        <div className="text-red-500 text-sm mt-1">{errors.teacher_id}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="industry_id" className="block text-sm font-medium">
                                        Industry*
                                    </label>
                                    <select
                                        id="industry_id"
                                        value={data.industry_id}
                                        onChange={(e) => setData('industry_id', e.target.value)}
                                        className="dark:bg-gray-800 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select Industry</option>
                                        {industries.map((industry) => (
                                            <option key={industry.id} value={industry.id}>
                                                {industry.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.industry_id && (
                                        <div className="text-red-500 text-sm mt-1">{errors.industry_id}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="start_date" className="block text-sm font-medium">
                                        Start Date*
                                    </label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="dark:bg-gray-800 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.start_date && (
                                        <div className="text-red-500 text-sm mt-1">{errors.start_date}</div>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="end_date" className="block text-sm font-medium">
                                        End Date*
                                    </label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="dark:bg-gray-800 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.end_date && <div className="text-red-500 text-sm mt-1">{errors.end_date}</div>}
                                    {data.start_date && data.end_date && (
                                        <div className="text-sm mt-1">
                                            <span className="text-gray-500">Duration: </span>
                                            <span className="font-medium">
                                                {Math.ceil(
                                                    (new Date(data.end_date).getTime() -
                                                        new Date(data.start_date).getTime()) /
                                                        (1000 * 60 * 60 * 24)
                                                )}{' '}
                                                days
                                            </span>
                                            {Math.ceil(
                                                (new Date(data.end_date).getTime() -
                                                    new Date(data.start_date).getTime()) /
                                                    (1000 * 60 * 60 * 24)
                                            ) < 90 && (
                                                <span className="text-red-500 ml-1">
                                                    (Minimum 90 days required)
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Create PKL Report
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}