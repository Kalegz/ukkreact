import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type ReactElement } from 'react';

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
    const { data, setData, post, processing, errors } = useForm({
        student_id: '',
        teacher_id: '',
        industry_id: '',
        start_date: '',
        end_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pkl-report.store'));
    };

    return (
        <AppLayout>
            <Head title="PKL Report" />
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">PKL Report</h1>

                {/* Form untuk membuat PKL report */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl mb-4">Create PKL Report</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
                                Student
                            </label>
                            <select
                                id="student_id"
                                value={data.student_id}
                                onChange={(e) => setData('student_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Select Student</option>
                                {students.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                            {errors.student_id && <div className="text-red-500 text-sm mt-1">{errors.student_id}</div>}
                        </div>

                        <div>
                            <label htmlFor="teacher_id" className="block text-sm font-medium text-gray-700">
                                Teacher
                            </label>
                            <select
                                id="teacher_id"
                                value={data.teacher_id}
                                onChange={(e) => setData('teacher_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                            {errors.teacher_id && <div className="text-red-500 text-sm mt-1">{errors.teacher_id}</div>}
                        </div>

                        <div>
                            <label htmlFor="industry_id" className="block text-sm font-medium text-gray-700">
                                Industry
                            </label>
                            <select
                                id="industry_id"
                                value={data.industry_id}
                                onChange={(e) => setData('industry_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Select Industry</option>
                                {industries.map((industry) => (
                                    <option key={industry.id} value={industry.id}>
                                        {industry.name}
                                    </option>
                                ))}
                            </select>
                            {errors.industry_id && <div className="text-red-500 text-sm mt-1">{errors.industry_id}</div>}
                        </div>

                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="start_date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.start_date && <div className="text-red-500 text-sm mt-1">{errors.start_date}</div>}
                        </div>

                        <div>
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="end_date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                            {errors.end_date && <div className="text-red-500 text-sm mt-1">{errors.end_date}</div>}
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

                {/* Daftar PKL Report */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl mb-4">PKL Reports</h2>
                    {pklAssignments.length === 0 ? (
                        <p>No PK

L reports found.</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teacher
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Industry
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pklAssignments.map((assignment) => (
                                    <tr key={assignment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{assignment.student?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{assignment.teacher?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{assignment.industry?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{assignment.start_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{assignment.end_date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}