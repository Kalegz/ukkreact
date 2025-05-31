import { usePage } from '@inertiajs/react';
import { type ReactElement } from 'react';

export default function FlashMessage(): ReactElement | null {
    const { flash } = usePage().props as { flash: { success?: string; error?: string } };

    if (flash.success) {
        return (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                {flash.success}
            </div>
        );
    }

    if (flash.error) {
        return (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                {flash.error}
            </div>
        );
    }

    return null;
}