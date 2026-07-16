import { Head } from '@inertiajs/react';
import type { ReactElement, ReactNode } from 'react';
import HomePageContent from '@/components/home/home-page-content';
import PublicLayout from '@/layouts/public-layout';

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const Home: PageWithLayout = () => (
    <>
        <Head title="หน้าแรก" />
        <HomePageContent />
    </>
);

Home.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Home;
