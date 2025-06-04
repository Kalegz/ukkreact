import { Head } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import FlashMessage from '@/components/flash-message';
import Pagination from '@/components/pagination';
import { useDebounce } from '@/components/use-debounce';
import { type BreadcrumbItem, type Teacher, type PaginationData } from '@/types/custom';
import axios from 'axios'; // Pastikan axios diimpor

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Teachers', href: '/teachers' }];

interface TeachersProps {
    // Hanya menerima props yang disediakan oleh Inertia dari rute web minimal
    filters?: { search?: string };
    auth: { user: any };
    error?: string | null;
}

export default function Teachers({ filters, auth, error: initialError }: TeachersProps) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
        links: [],
    });
    const [search, setSearch] = useState(filters?.search || '');
    const [error, setError] = useState<string | null>(initialError || null);
    const [loading, setLoading] = useState(true);
    const debouncedSearch = useDebounce(search, 300);

    // Fungsi untuk fetching data guru dari API
    const fetchTeachers = useCallback(async () => {
        if (!auth.user) {
            setError('You must login to view the teacher list.');
            setTeachers([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Panggil endpoint API Anda
            const response = await axios.get('/api/teachers', {
                params: {
                    search: debouncedSearch,
                    page: pagination.current_page,
                },
                // Header mungkin tidak diperlukan jika Sanctum menangani cookies secara otomatis
                // Tapi jika Anda menggunakan API Token, sertakan di sini:
                // headers: { 'Authorization': `Bearer ${auth.user.api_token}` } // Contoh jika Anda menyimpan api_token di user object
            });

            if (response.data.status === 200) {
                const apiResponse = response.data.teachers; // Ini adalah objek paginated lengkap dari API
                setTeachers(apiResponse.data); // Data guru ada di `data` properti
                setPagination({
                    current_page: apiResponse.current_page,
                    last_page: apiResponse.last_page,
                    per_page: apiResponse.per_page,
                    total: apiResponse.total,
                    from: apiResponse.from,
                    to: apiResponse.to,
                    links: apiResponse.links.map((link: any) => ({
                        url: link.url,
                        label: link.label,
                        active: link.active,
                    })),
                });
            } else {
                setError('Failed to fetch teachers: ' + (response.data.message || 'Unknown error'));
            }
        } catch (err: any) {
            console.error('Error fetching teachers:', err);
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401 || err.response.status === 403) {
                    setError('Authentication required or unauthorized to view teachers.');
                } else {
                    setError('Failed to load teachers. Please try again. Status: ' + err.response.status);
                }
            } else {
                setError('An unexpected error occurred.');
            }
            setTeachers([]);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, pagination.current_page, auth.user]);

    useEffect(() => {
        fetchTeachers(); // Panggil fungsi fetching saat komponen di-mount atau dependensi berubah
    }, [fetchTeachers]);

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teachers" />
            <div className="p-4 sm:p-6 mt-4 rounded-lg shadow-md bg-white dark:bg-gray-900">
                <FlashMessage />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Teacher List</h1>
                    <input
                        type="text"
                        placeholder="Search teacher name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full sm:w-72 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        disabled={!auth.user || loading}
                    />
                </div>

                <div className="p-4 sm:p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-lg sm:text-xl mb-4 text-gray-900 dark:text-gray-100">Teacher List</h2>
                    {error ? (
                        <p className="text-red-500 text-center">{error}</p>
                    ) : loading ? (
                        <p className="text-gray-600 dark:text-gray-400 text-center">Loading teachers...</p>
                    ) : teachers.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400 text-center">No teachers found.</p>
                    ) : (
                        <>
                            <table className="hidden sm:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                        {['Name', 'NIP', 'Gender', 'Email', 'Contact', 'Address', 'Photo'].map((header) => (
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
                                    {teachers.map((teacher) => (
                                        <tr key={teacher.id}>
                                            <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-100">
                                                {teacher.name}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-100">
                                                {teacher.nip}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-100">
                                                {teacher.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-100">
                                                {teacher.email}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-100">
                                                {teacher.contact || '-'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-gray-100">
                                                {teacher.address || '-'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-left text-gray-900 dark:text-gray-100">
                                                {teacher.photo ? (
                                                    <img src={`/storage/${teacher.photo}`} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="sm:hidden space-y-4">
                                {teachers.map((teacher) => (
                                    <div key={teacher.id} className="p-4 border rounded-md bg-white dark:bg-gray-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Name:</span> {teacher.name}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">NIP:</span> {teacher.nip}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Gender:</span> {teacher.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Email:</span> {teacher.email}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Contact:</span> {teacher.contact || '-'}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Address:</span> {teacher.address || '-'}
                                        </p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">Photo:</span>{' '}
                                            {teacher.photo ? <img src={`/storage/${teacher.photo}`} alt={teacher.name} className="w-10 h-10 rounded-full object-cover" /> : '-'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {!error && !loading && teachers.length > 0 && (
                    <Pagination
                        currentPage={pagination.current_page}
                        lastPage={pagination.last_page}
                        onPageChange={handlePageChange}
                        disabled={!auth.user || loading}
                    />
                )}
            </div>
        </AppLayout>
    );
}