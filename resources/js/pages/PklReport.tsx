import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo, type ReactElement } from 'react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import Pagination from '@/components/pagination';
import Modal from '@/components/modal';
import { useDebounce } from '@/components/use-debounce';
import { type BreadcrumbItem, type Student, type Teacher, type Industry, type PKLAssignment, type PaginationData, type PklReportProps } from '@/types/custom';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'PKL Report', href: '/pkl-report' },
];

export default function PklReport({
    pklAssignments,
    students,
    teachers,
    industries,
    pagination,
    filters,
}: PklReportProps): ReactElement {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        teacher_id: '',
        industry_id: '',
        start_date: '',
        end_date: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');
    const [formError, setFormError] = useState<string | null>(null);
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        router.get(
            route('pkl-report'),
            { search: debouncedSearch },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }, [debouncedSearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (data.start_date && data.end_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.end_date);
            const diffTime = endDate.getTime() - startDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 90) {
                setFormError('The PKL duration must be at least 90 days.');
                return;
            }
            if (isNaN(diffDays) || diffDays < 0) {
                setFormError('Invalid date range. Please ensure the end date is after the start date.');
                return;
            }
        }

        post(route('pkl-report.store'), {
            onError: () => {},
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('pkl-report'),
            { search, page },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const durationDisplay = useMemo(() => {
        if (!data.start_date || !data.end_date) return null;
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return {
            days: diffDays,
            isValid: diffDays >= 90,
        };
    }, [data.start_date, data.end_date]);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PKL Report" />
            <div className="p-4 sm:p-6 mt-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
                <FlashMessage />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">PKL Report</h1>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Search Student's name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full sm:w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            aria-label="Search PKL reports"
                        />
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto cursor-pointer"
                        >
                            + Create PKL Report
                        </button>
                    </div>
                </div>

                <div className="p-4 sm:p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-lg sm:text-xl mb-4 text-gray-900 dark:text-gray-100">PKL Reports</h2>
                    {pklAssignments.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400 text-center">No PKL reports found.</p>
                    ) : (
                        <>
                            <table className="hidden sm:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        {['Student', 'Teacher', 'Industry', 'Start Date', 'End Date'].map((header) => (
                                            <th
                                                key={header}
                                                className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {pklAssignments.map((assignment) => (
                                        <tr key={assignment.id}>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {assignment.student?.name || 'N/A'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {assignment.teacher?.name || 'N/A'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {assignment.industry?.name || 'N/A'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {formatDate(assignment.start_date)}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {formatDate(assignment.end_date)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="sm:hidden space-y-4">
                                {pklAssignments.map((assignment) => (
                                    <div key={assignment.id} className="p-4 border rounded-md bg-white dark:bg-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Student:</span> {assignment.student?. SAE || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Teacher:</span> {assignment.teacher?.name || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Industry:</span> {assignment.industry?.name || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Start Date:</span> {formatDate(assignment.start_date)}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">End Date:</span> {formatDate(assignment.end_date)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <Pagination
                    currentPage={pagination.current_page}
                    lastPage={pagination.last_page}
                    onPageChange={handlePageChange}
                />

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create PKL Report">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {formError && (
                            <div className="p-2 bg-red-100 border-l-4 border-red-500 text-red-700">{formError}</div>
                        )}
                        <div>
                            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Student*
                            </label>
                            <select
                                id="student_id"
                                value={data.student_id}
                                onChange={(e) => setData('student_id', e.target.value)}
                                className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-[#171717] text-gray-900 dark:text-gray-100"
                                required
                                aria-describedby={errors.student_id ? 'student_id-error' : undefined}
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                            {errors.student_id && (
                                <div id="student_id-error" className="text-red-500 text-sm mt-1">
                                    {errors.student_id}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Teacher*
                            </label>
                            <select
                                id="teacher_id"
                                value={data.teacher_id}
                                onChange={(e) => setData('teacher_id', e.target.value)}
                                className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-[#171717] text-gray-900 dark:text-gray-100"
                                required
                                aria-describedby={errors.teacher_id ? 'teacher_id-error' : undefined}
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                            {errors.teacher_id && (
                                <div id="teacher_id-error" className="text-red-500 text-sm mt-1">
                                    {errors.teacher_id}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="industry_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Industry*
                            </label>
                            <select
                                id="industry_id"
                                value={data.industry_id}
                                onChange={(e) => setData('industry_id', e.target.value)}
                                className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-[#171717] text-gray-900 dark:text-gray-100"
                                required
                                aria-describedby={errors.industry_id ? 'industry_id-error' : undefined}
                            >
                                <option value="">Select Industry</option>
                                {industries.map((industry) => (
                                    <option key={industry.id} value={industry.id}>
                                        {industry.name}
                                    </option>
                                ))}
                            </select>
                            {errors.industry_id && (
                                <div id="industry_id-error" className="text-red-500 text-sm mt-1">
                                    {errors.industry_id}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Start Date*
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="start_date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-[#171717] text-gray-900 dark:text-gray-100 [&::-webkit-calendar-picker-indicator]:invert-[0.8] dark:[&::-webkit-calendar-picker-indicator]:invert"
                                    required
                                    aria-describedby={errors.start_date ? 'start_date-error' : undefined}
                                />
                            </div>
                            {errors.start_date && (
                                <div id="start_date-error" className="text-red-500 text-sm mt-1">
                                    {errors.start_date}
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                End Date*
                            </label>
                            <input
                                type="date"
                                id="end_date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-[#171717] text-gray-900 dark:text-gray-100 [&::-webkit-calendar-picker-indicator]:invert-[0.8] dark:[&::-webkit-calendar-picker-indicator]:invert"
                                required
                                aria-describedby={errors.end_date || durationDisplay ? 'end_date-info' : undefined}
                            />
                            {errors.end_date && (
                                <div id="end_date-error" className="text-red-500 text-sm mt-1">
                                    {errors.end_date}
                                </div>
                            )}
                            {durationDisplay && (
                                <div id="end_date-info" className="text-sm mt-1">
                                    <span className="text-gray-500 dark:text-gray-400">Duration: </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {durationDisplay.days} days
                                    </span>
                                    {!durationDisplay.isValid && (
                                        <span className="text-red-500 ml-1">(Minimum 90 days required)</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto disabled:opacity-50 cursor-pointer"
                        >
                            Create PKL Report
                        </button>
                    </form>
                </Modal>
            </div>
        </AppLayout>
    );
}