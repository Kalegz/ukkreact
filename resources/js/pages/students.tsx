import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import Pagination from '@/components/pagination';
import { useDebounce } from '@/components/use-debounce';
import { type BreadcrumbItem, type Student, type PaginationData } from '@/types/custom';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Students', href: '/students' }];

interface StudentsProps {
    students: Student[];
    pagination: PaginationData;
    filters: { search?: string };
    auth: { user: any };
    userStudent: Student | null;
    error?: string | null;
}

export default function Students({ students: initialStudents, pagination: initialPagination, filters, auth, userStudent, error: initialError }: StudentsProps) {
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [pagination, setPagination] = useState<PaginationData>(initialPagination);
    const [search, setSearch] = useState(filters?.search || '');
    const [error, setError] = useState<string | null>(initialError || null);
    const [currentUserStudent] = useState<Student | null>(userStudent);
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (auth.user) {
            router.get(
                '/students',
                { search: debouncedSearch, page: pagination.current_page },
                { preserveState: true, preserveScroll: true }
            );
        }
    }, [debouncedSearch, pagination.current_page]);

    useEffect(() => {
        setStudents(initialStudents);
        setPagination(initialPagination);
        if (!auth.user) {
            setError('You must login to view the student list.');
            setStudents([]);
        }
    }, [initialStudents, initialPagination, auth.user]);

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div className="p-4 sm:p-6 mt-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
                <FlashMessage />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Student List</h1>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Search student name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="p-2 border border-gray-300 rounded w-full sm:w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            aria-label="Search student"
                            disabled={!auth.user}
                        />
                    </div>
                </div>

                <div className="p-4 sm:p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-lg sm:text-xl mb-4 text-gray-900 dark:text-gray-100">Student List</h2>
                    {error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : students.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400 text-center">No students found.</p>
                    ) : (
                        <>
                            <table className="hidden sm:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        {['Name', 'NIS', 'Gender', 'Email', 'Contact', 'Address', 'photo'].map((header) => (
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
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {student.name}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {student.nis}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {student.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {student.email}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {student.contact || '-'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                {student.address || '-'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-left text-gray-900 dark:text-gray-100">
                                                {student.photo ? (
                                                    <img src={`/storage/${student.photo}`} alt={student.name} className="w-10 h-10 rounded-full" />
                                                ) : (
                                                    <span> </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="sm:hidden space-y-4">
                                {students.map((student) => (
                                    <div key={student.id} className="p-4 border rounded-md bg-white dark:bg-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Name:</span> {student.name}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">NIS:</span> {student.nis}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Gender:</span> {student.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Email:</span> {student.email}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Contact:</span> {student.contact || '-'}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Address:</span> {student.address || '-'}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Photo:</span> {student.photo ? <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full" /> : '-'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {currentUserStudent && (
                                <div className="mt-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Student Data</h3>
                                    <p><span className="font-semibold">Name:</span> {currentUserStudent.name}</p>
                                    <p><span className="font-semibold">NIS:</span> {currentUserStudent.nis}</p>
                                    <p><span className="font-semibold">Gender:</span> {currentUserStudent.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</p>
                                    <p><span className="font-semibold">Email:</span> {currentUserStudent.email}</p>
                                    <p><span className="font-semibold">Status PKL:</span> {currentUserStudent.pkl_report || '-'}</p>
                                    <p><span className="font-semibold">Photo:</span> {currentUserStudent.photo ? <img src={currentUserStudent.photo} alt={currentUserStudent.name} className="w-10 h-10 rounded-full" /> : '-'}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <Pagination
                    currentPage={pagination.current_page}
                    lastPage={pagination.last_page}
                    onPageChange={handlePageChange}
                    disabled={!auth.user}
                />
            </div>
        </AppLayout>
    );
}