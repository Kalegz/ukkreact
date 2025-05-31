import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { props } = usePage();
    const appName = props.name || 'ERROR JIR'; 

    return (
        <div className="flex items-center">
            <div className=" mr-2 flex items-center justify-center rounded-md overflow-hidden">
                <AppLogoIcon className="w-8 h-8 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm min-w-0">
                <span className="truncate font-semibold">{appName}</span>
            </div>
        </div>
    );
}