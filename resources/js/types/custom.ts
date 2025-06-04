export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type Student = {
    id: number;
    name: string;
    nis: string;
    gender: 'L' | 'P';
    address: string;
    contact: string;
    email: string;
    photo?: string | null;
};

export type Teacher = {
    id: number;
    name: string;
    nip?: string;
    gender?: string;
    address?: string;
    contact?: string;
    email?: string;
    photo?: string | null;
};

export type Industry = {
    id: number;
    name: string;
    business_field?: string;
    address?: string;
    contact?: string;
    email?: string;
    website?: string;
};

export type PKLAssignment = {
    id: number;
    student?: Student;
    teacher?: Teacher;
    industry?: Industry;
    start_date: string;
    end_date: string;
};

export type PaginationData = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type PklReportProps = {
    pklAssignments: PKLAssignment[];
    students: Student[];
    teachers: Teacher[];
    industries: Industry[];
    pagination: PaginationData;
    filters?: { search: string };
    authStudent?: Student | null;
};

export type IndustriesProps = {
    industries: Industry[];
    pagination: PaginationData;
    filters?: { search: string };
    authStudent?: Student | null;
};

export type User = {
    name: string;
    nis: string | null;
    gender: string | null;
    address: string | null;
    email: string | null;
    photo: string | null;
    pkl_assignment?: PKLAssignment | null;
};

export type NavItem = {
    title: string;
    href: string;
    icon: any;
};