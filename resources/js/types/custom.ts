export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type Student = {
    id: number;
    name: string;
};

export type Teacher = {
    id: number;
    name: string;
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
};

export type IndustriesProps = {
    industries: Industry[];
    pagination: PaginationData;
    filters?: { search: string };
};