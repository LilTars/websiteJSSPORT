type LookbookItem = {
    title: string;
    kicker: string;
    imageUrl: string;
    layoutClass: string;
};

const lookbookItems: LookbookItem[] = [
    {
        title: 'ชุดพละนักเรียน',
        kicker: 'LOOKBOOK / 01',
        imageUrl: '/images/logos/Pd02.png',
        layoutClass: 'md:col-span-7 md:row-span-2 min-h-[560px] md:min-h-[760px]',
    },
    {
        title: 'ชุดกีฬา',
        kicker: 'CAMPAIGN / 02',
        imageUrl:
            'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/49cc0423-c8f5-4c6c-8c85-e382de0b11b8/NIKE+X+LEGO+COL+AEROFIT+F+JSY.png',
        layoutClass: 'md:col-span-5 min-h-[340px] md:min-h-[370px]',
    },
    {
        title: 'รองเท้ากีฬา',
        kicker: 'CAMPAIGN / 03',
        imageUrl: '/images/logos/Pd03.jpg',
        layoutClass: 'md:col-span-5 min-h-[340px] md:min-h-[370px]',
    },
];

export default function LookbookGrid() {
    return (
        <section className="py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-8 md:mb-10">
                    <p className="text-xs font-semibold uppercase text-pink-500">
                        แคตตาล็อกแฟชั่น
                    </p>
                    <h2 className="mt-2 text-3xl font-black uppercase leading-[1.25] md:text-6xl">
                        <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                            หมวดหมู่ และแคมเปญ
                        </span>
                    </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-12 md:grid-rows-2">
                    {lookbookItems.map((item) => (
                        <article
                            key={item.title}
                            className={`group relative overflow-hidden ${item.layoutClass}`}
                            style={{
                                clipPath:
                                    'polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)',
                            }}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/35 to-pink-800/45 transition duration-700 group-hover:from-black/70 group-hover:via-pink-900/40 group-hover:to-pink-500/40" />

                            <div className="relative flex h-full flex-col justify-end p-6 text-white md:p-8">
                                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-pink-200">
                                    {item.kicker}
                                </p>
                                <h3 className="mt-3 -skew-x-12 text-4xl font-black uppercase leading-[1.25] md:text-6xl lg:text-7xl">
                                    <span className="block skew-x-12">{item.title}</span>
                                </h3>
                                <span className="mt-5 block h-[3px] w-16 bg-white transition-all duration-700 group-hover:w-52 group-hover:bg-pink-500" />
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
