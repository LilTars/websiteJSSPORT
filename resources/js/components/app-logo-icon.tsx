import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props} src="/images/logos/logojs.png" alt={props.alt ?? 'JS SPORT logo'} />
    );
}
