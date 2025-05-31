import { ImgHTMLAttributes } from 'react';

import CustomLogo from '/public/assets/appLogo.jpg'; 

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src={CustomLogo} 
            alt="App Logo"
            className={props.className}
        />
    );
}