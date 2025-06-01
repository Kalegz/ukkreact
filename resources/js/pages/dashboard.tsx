import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head } from '@inertiajs/react';
import { Briefcase, MapPin, User as UserIcon, Mail, Phone, Globe } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardProps = {
    user: User | null;
};

export default function Dashboard({ user }: DashboardProps) {
    const safeUser = user ?? {
        role: 'unknown',
        name: 'Unknown User',
        email: 'N/A',
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border flex flex-col items-start p-4 bg-gray-800">
                        <h2 className="text-xl font-bold text-white mb-2">Profile</h2>
                        <div className="flex items-start w-full space-x-4">
                            {safeUser.photo ? (
                                <img
                                    src={safeUser.photo}
                                    alt={`${safeUser.name}'s photo`}
                                    className="w-24 h-24 rounded-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/user-placeholder.png';
                                    }}
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                                    <UserIcon className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            <div className="text-left text-sm text-white space-y-2">
                                <p className="flex items-center">
                                    <UserIcon className="w-4 h-4 mr-2 text-indigo-600" />
                                    {safeUser.name || 'Not provided'}
                                </p>
                                <p className="flex items-center">
                                    <UserIcon className="w-4 h-4 mr-2 text-indigo-600" />
                                    {safeUser.nis || safeUser.nip || 'Not provided'}
                                </p>
                                <p className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
                                    {safeUser.address || 'Not provided'}
                                </p>
                                <p className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                                    {safeUser.contact || 'Not provided'}
                                </p>
                                <p className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                                    {safeUser.email || 'Not provided'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {safeUser.role === 'student' && (
                        <>
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border flex flex-col items-start p-4 bg-gray-800">
                                <h2 className="text-xl font-bold text-white mb-2">PKL Location</h2>
                                {safeUser.pkl_assignment?.industry ? (
                                    <div className="flex items-start w-full space-x-4">
                                        <div className="text-left text-sm text-white space-y-2">
                                            <p className="flex items-center">
                                                <Briefcase className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.industry.name || 'N/A'}
                                            </p>
                                            <p className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.industry.address || 'N/A'}
                                            </p>
                                            <p className="flex items-center">
                                                <Briefcase className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.industry.business_field || 'N/A'}
                                            </p>
                                            <p className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.industry.contact || 'N/A'}
                                            </p>
                                            <p className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.industry.email || 'N/A'}
                                            </p>
                                            <p className="flex items-center">
                                                <Globe className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.industry.website ? (
                                                    <a
                                                        href={safeUser.pkl_assignment.industry.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-indigo-400 hover:underline ml-1"
                                                    >
                                                        {safeUser.pkl_assignment.industry.website}
                                                    </a>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-left text-sm text-white">No PKL assignment available</p>
                                )}
                            </div>

                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border flex flex-col items-start p-4 bg-gray-800">
                                <h2 className="text-xl font-bold text-white mb-2">Mentor</h2>
                                {safeUser.pkl_assignment?.teacher ? (
                                    <div className="flex items-start w-full space-x-4">
                                        {safeUser.pkl_assignment.teacher.photo ? (
                                            <img
                                                src={safeUser.pkl_assignment.teacher.photo}
                                                alt={`${safeUser.pkl_assignment.teacher.name}'s photo`}
                                                className="w-24 h-24 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/images/teacher-placeholder.png';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                                                <UserIcon className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="text-left text-sm text-white space-y-2">
                                            <p className="flex items-center">
                                                <UserIcon className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.teacher.name || 'N/A'}
                                            </p>
                                            <p className="flex items-center">
                                                <UserIcon className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.teacher.nip || 'N/A'}
                                            </p>
                                            <p className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.teacher.address || 'N/A'}
                                            </p>
                                            <p className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.teacher.contact || 'N/A'}
                                            </p>
                                            <p className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                                                {safeUser.pkl_assignment.teacher.email || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-left text-sm text-white">No teacher assigned</p>
                                )}
                            </div>
                        </>
                    )}

                    {safeUser.role === 'teacher' && (
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border flex flex-col items-start p-4 bg-gray-800">
                            <h2 className="text-xl font-bold text-white mb-2">Welcome, {user.name}!</h2>
                            <p className="text-left text-sm text-white">
                                READY TO MENTOR SOME BRAT?
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}