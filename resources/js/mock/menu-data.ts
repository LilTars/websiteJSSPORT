export type UtilityItem = {
    label: string;
    href: string;
};

export type MenuItem = {
    label: string;
    href: string;
};

export type ProductSubItem = {
    label: string;
    href: string;
};

export type ProductCategoryGroup = {
    title: string;
    items: ProductSubItem[];
};

export const utilityItemsMock: UtilityItem[] = [
    { label: 'ช่วยเหลือ', href: '/help' },
];

export const menuItemsMock: MenuItem[] = [
    { label: 'หน้าแรก', href: '/' },
    { label: 'สินค้า', href: '/products' },
    { label: 'เกี่ยวกับเรา', href: '/about' },
    { label: 'ร่วมงานกับเรา', href: '/careers' },
    { label: 'ติดต่อเรา', href: '/contact' },
];

export const productCategoryGroupsMock: ProductCategoryGroup[] = [
    {
        title: 'รองเท้า',
        items: [
            { label: 'ทั้งหมด', href: '/products/shoes/all' },
            { label: 'WingZ', href: '/products/shoes/wingz' },
            { label: 'Pan', href: '/products/shoes/pan' },
            { label: 'Zeta', href: '/products/shoes/zeta' },
        ],
    },
    {
        title: 'ชุดแข่ง',
        items: [
            { label: 'ทั้งหมด', href: '/products/jersey/all' },
            { label: 'FBT', href: '/products/jersey/fbt' },
            { label: 'GarnSport', href: '/products/jersey/garnsport' },
        ],
    },
    {
        title: 'MESPORT',
        items: [
            { label: 'ทั้งหมด', href: '/products/mesport/all' },
            { label: 'เสื้อ', href: '/products/mesport/shirts' },
            { label: 'ชุดรำลอง', href: '/products/mesport/casual-set' },
        ],
    },
    {
        title: 'สโมสรพิชญ',
        items: [
            { label: 'ทั้งหมด', href: '/products/pitchaya/all' },
            { label: '2026-2027', href: '/products/pitchaya/2026-2027' },
            { label: '2025-2026', href: '/products/pitchaya/2025-2026' },
        ],
    },
    {
        title: 'เสื้อพิมพ์ลาย',
        items: [
            { label: 'ทั้งหมด', href: '/products/printed/all' },
            { label: 'เสื้อ', href: '/products/printed/shirts' },
            { label: 'กางเกง', href: '/products/printed/pants' },
        ],
    },
    {
        title: 'อุปกรณ์กีฬา',
        items: [
            { label: 'ทั้งหมด', href: '/products/equipment/all' },
            { label: 'ลูกฟุตบอล', href: '/products/equipment/football' },
            { label: 'ลูกวอลเลย์บอล', href: '/products/equipment/volleyball' },
        ],
    },
    {
        title: 'ชุดพละ',
        items: [{ label: 'ชุดพละ', href: '/products/pe-uniform' }],
    },
];

export type AboutFeature = {
    title: string;
    detail: string;
};

export type AboutService = {
    title: string;
    detail: string;
    accent: string;
};

export type AboutCapability = {
    step: string;
    title: string;
    detail: string;
};

export const legacyFeaturesMock: AboutFeature[] = [
    {
        title: '40+ YEARS',
        detail: 'ประสบการณ์ยาวนานด้านชุดกีฬา พร้อมความเข้าใจงานโรงเรียน องค์กร และทีมกีฬาอย่างลึกซึ้ง',
    },
    {
        title: 'MODERN MACHINERY',
        detail: 'เครื่องจักรทันสมัยช่วยให้การผลิตมีความแม่นยำ คงคุณภาพ และรองรับงานจำนวนมากได้ต่อเนื่อง',
    },
    {
        title: 'TRUSTED PRODUCTION',
        detail: 'ได้รับความไว้วางใจจากโรงเรียน หน่วยงานราชการ องค์กร ร้านค้า และบริษัทต่าง ๆ อย่างต่อเนื่อง',
    },
];

export const serviceGroupsMock: AboutService[] = [
    {
        title: 'ผลิตและจำหน่ายชุดกีฬาครบวงจร',
        detail:
            'ชุดพละ เสื้อกีฬาสี เสื้อทีม เสื้อโฆษณา เสื้อพนักงาน และชุดกีฬาทุกรูปแบบ พร้อมงานโลโก้และเฟล็กซ์พรินต์สำหรับอัดรีดลงบนตัวเสื้อ',
        accent: 'from-pink-500 to-red-600',
    },
    {
        title: 'ตัวแทนจำหน่ายแบรนด์และอุปกรณ์กีฬา',
        detail:
            'คัดสรรชุดกีฬาแบรนด์ชั้นนำและอุปกรณ์กีฬาทุกประเภท เพื่อตอบโจทย์ทั้งงานสถาบัน งานทีม และการใช้งานเชิงพาณิชย์',
        accent: 'from-red-500 to-rose-600',
    },
    {
        title: 'บริการงานตกแต่งและพิมพ์ครบระบบ',
        detail:
            'งานปักด้วยเครื่องปักคอมพิวเตอร์ งานสกรีนทุกประเภท งานอัดรีดเฟล็กซ์ เบอร์-ชื่อ และพิมพ์ระบบซับลิเมชั่นลงบนผ้าอย่างครบถ้วน',
        accent: 'from-rose-500 to-pink-600',
    },
];

export const productionCapabilitiesMock: AboutCapability[] = [
    {
        step: '01',
        title: 'วิเคราะห์ความต้องการ',
        detail: 'เริ่มจากการเข้าใจบริบทของลูกค้า จำนวนการใช้งาน โทนแบรนด์ และลักษณะกิจกรรมเพื่อกำหนดรูปแบบที่เหมาะสม',
    },
    {
        step: '02',
        title: 'ออกแบบและเลือกวัสดุ',
        detail: 'เลือกเนื้อผ้า เทคนิคพิมพ์ และงานตกแต่งให้สอดคล้องกับงบประมาณ ภาพลักษณ์ และความทนทานของงานจริง',
    },
    {
        step: '03',
        title: 'ผลิตอย่างประณีต',
        detail: 'ดำเนินการด้วยทีมที่มีประสบการณ์และเครื่องจักรที่ทันสมัย เพื่อให้ได้งานที่ละเอียด เนี้ยบ และส่งมอบได้ตรงเวลา',
    },
];

export type CareerBenefit = {
    title: string;
    detail: string;
};

export type CareerPosition = {
    title: string;
    team: string;
    location: string;
    type: string;
    description: string;
};

export type CareerHiringStep = {
    number: string;
    title: string;
    detail: string;
};

export const careerBenefitsMock: CareerBenefit[] = [
    {
        title: 'ทีมงานเป็นมิตรและเติบโตไปด้วยกัน',
        detail: 'เราทำงานแบบร่วมมือกันจริงจัง เปิดรับไอเดียใหม่ และสนับสนุนการพัฒนาทักษะของทุกคน',
    },
    {
        title: 'ได้ทำงานกับโปรดักชันจริง',
        detail: 'ตั้งแต่การออกแบบ การผลิต ไปจนถึงการส่งมอบงานให้ลูกค้าองค์กร โรงเรียน และทีมกีฬา',
    },
    {
        title: 'เส้นทางเติบโตชัดเจน',
        detail: 'มีโอกาสขยับบทบาทตามความสามารถ พร้อม mentoring จากทีมที่มีประสบการณ์ยาวนาน',
    },
];

export const openPositionsMock: CareerPosition[] = [
    {
        title: 'Graphic Designer (Sportswear)',
        team: 'Creative Team',
        location: 'หนองบัวลำภู',
        type: 'Full-time',
        description: 'ออกแบบเสื้อทีม งานพิมพ์ และงานสื่อสารแบรนด์ให้ตอบโจทย์ลูกค้าและกระบวนการผลิตจริง',
    },
    {
        title: 'Sales Executive (B2B / Schools)',
        team: 'Sales Team',
        location: 'หนองบัวลำภู / Hybrid',
        type: 'Full-time',
        description: 'ดูแลลูกค้าองค์กร โรงเรียน และหน่วยงานราชการ ตั้งแต่รับบรีฟไปจนถึงปิดงานและติดตามผล',
    },
    {
        title: 'Production Coordinator',
        team: 'Production Team',
        location: 'หนองบัวลำภู',
        type: 'Full-time',
        description: 'ประสานงานฝ่ายผลิต คุมไทม์ไลน์ และตรวจสอบความเรียบร้อยของงานก่อนส่งมอบลูกค้า',
    },
    {
        title: 'Digital Marketing Content Creator',
        team: 'Marketing Team',
        location: 'หนองบัวลำภู / Remote',
        type: 'Contract',
        description: 'สร้างคอนเทนต์สำหรับ TikTok, Facebook และแคมเปญออนไลน์ เพื่อเพิ่มการรับรู้และยอดขาย',
    },
];

export const hiringStepsMock: CareerHiringStep[] = [
    {
        number: '01',
        title: 'ส่งโปรไฟล์และผลงาน',
        detail: 'ส่งประวัติ ผลงาน และตำแหน่งที่สนใจผ่าน Line หรือโทรติดต่อทีมงาน',
    },
    {
        number: '02',
        title: 'สัมภาษณ์กับหัวหน้าทีม',
        detail: 'พูดคุยบทบาทงาน แนวทางการทำงาน และความคาดหวังร่วมกันอย่างชัดเจน',
    },
    {
        number: '03',
        title: 'เริ่มงานและ onboarding',
        detail: 'เริ่มงานจริงพร้อมคู่มือ การแนะนำทีม และแผนการพัฒนาที่เหมาะกับตำแหน่ง',
    },
];

export const quoteBranchesMock = ['JS SPORT', 'ME SPORT'] as const;
export type QuoteBranch = (typeof quoteBranchesMock)[number];

export const quoteCategoriesMock = [
    { value: 'Jerseys', label: 'เสื้อแข่ง' },
    { value: 'PE kits', label: 'ชุดพละ' },
    { value: 'Office uniforms', label: 'ยูนิฟอร์มองค์กร' },
    { value: 'Gear', label: 'อุปกรณ์กีฬา' },
    { value: 'Shoes', label: 'รองเท้า' },
] as const;

export type QuoteCategory = (typeof quoteCategoriesMock)[number]['value'];

export type ProductCategory =
    | 'All'
    | 'Pan'
    | 'Zeta'
    | 'Winz'
    | 'Mesport'
    | 'Pitchaya'
    | 'PEUniform';

export type ProductCard = {
    id: number;
    name: string;
    category: Exclude<ProductCategory, 'All'>;
    price: number;
    imageUrl: string;
    hidePriceOnCard?: boolean;
};

export const productCategoriesMock: ProductCategory[] = [
    'All',
    'Pan',
    'Zeta',
    'Winz',
    'Mesport',
    'Pitchaya',
    'PEUniform',
];

export const productCategoryLabelsMock: Record<ProductCategory, string> = {
    All: 'ทั้งหมด',
    Pan: 'Pan',
    Zeta: 'Zeta',
    Winz: 'Winz',
    Mesport: 'Mesport',
    Pitchaya: 'พิชญ',
    PEUniform: 'ชุดพละ',
};

export const productsMock: ProductCard[] = [
    {
        id: 1,
        name: 'PAN LEGENDA SELECT : PSFS5A2',
        category: 'Pan',
        price: 1890,
        imageUrl: '/images/pan/p1.webp',
    },
    {
        id: 13,
        name: 'Pan Supersonic รองท็อป',
        category: 'Pan',
        price: 1318,
        imageUrl: '/images/pan/ps1.webp',
    },
    {
        id: 14,
        name: 'Pan Supersonic Pro',
        category: 'Pan',
        price: 2039,
        imageUrl: '/images/pan/psp1.webp',
    },
    {
        id: 3,
        name: 'ZETA ซีต้า SUPERNOVA PRO',
        category: 'Zeta',
        price: 1690,
        imageUrl: '/images/zata/zt1.webp',
    },
    {
        id: 5,
        name: 'Wingz Vortex Pro',
        category: 'Winz',
        price: 1390,
        imageUrl: '/images/wingz/w1.jpg',
    },
    {
        id: 6,
        name: 'Wingz Vortex รองท็อป',
        category: 'Winz',
        price: 800,
        imageUrl: '/images/wingz/w6.webp',
    },
    {
        id: 11,
        name: 'WINGZ SAVE ONE & ZENO ONE',
        category: 'Winz',
        price: 407,
        imageUrl: '/images/wingz/wg1.webp',
    },
    {
        id: 12,
        name: 'WINGZ BLAZE',
        category: 'Winz',
        price: 656,
        imageUrl: '/images/wingz/wf1.webp',
    },
    {
        id: 7,
        name: 'เซตโฟมทำความสะอาดรองเท้า',
        category: 'Mesport',
        price: 199,
        imageUrl: '/images/logos/Pd07.jpg',
    },
    {
        id: 8,
        name: 'เสื้อ mesport',
        category: 'Mesport',
        price: 84,
        imageUrl: '/images/logos/Pd05.jpg',
    },
    {
        id: 17,
        name: 'เสื้อ mesport',
        category: 'Mesport',
        price: 63,
        imageUrl: '/images/logos/Pd06.jpg',
    },
    {
        id: 18,
        name: 'ชุดพละนักเรียน รุ่นพื้นฐาน',
        category: 'PEUniform',
        price: 199,
        imageUrl: '/images/logos/pd01.jpg',
        hidePriceOnCard: true,
    },
    {
        id: 15,
        name: 'เสื้อสโมสรหนองบัวพิชญ เอฟซี ฤดูกาล 2024-2025',
        category: 'Pitchaya',
        price: 299,
        imageUrl: '/images/npf/npf1.webp',
    },
    {
        id: 16,
        name: 'เสื้อสโมสรหนองบัวพิชญ เอฟซี ฤดูกาล 2025-2026',
        category: 'Pitchaya',
        price: 630,
        imageUrl: '/images/npf/npf5.webp',
    },
];

export type ProductDetail = {
    id: number;
    brandTag: string;
    name: string;
    price: string;
    description: string;
    category: string;
    material: string;
    turnaround: string;
    images: string[];
    hidePriceOnDetail?: boolean;
};

export const productDetailCatalogMock: ProductDetail[] = [
    {
        id: 1,
        brandTag: 'PAN PERFORMANCE',
        name: 'PAN LEGENDA SELECT : PSFS5A2',
        price: '฿1,890',
        category: 'PAN',
        material: 'PREMIUM SYNTHETIC UPPER + CONTROL SOLE',
        turnaround: 'READY STOCK',
        description:
            'รองเท้าฟุตบอล PAN LEGENDA SELECT : PSFS5A2 ออกแบบมาเพื่อการควบคุมบอลที่มั่นใจ สวมใส่กระชับ และตอบสนองดีในเกมแข่งขันจริง เหมาะกับผู้เล่นที่ต้องการความสมดุลระหว่างความคล่องตัวและความแม่นยำ',
        images: [
            '/images/pan/p1.webp',
            '/images/pan/p2.webp',
            '/images/pan/p3.webp',
            '/images/pan/p4.webp',
            '/images/pan/p5.webp',
            '/images/pan/p6.webp',
        ],
    },
    {
        id: 2,
        brandTag: 'JS SPORT EXCLUSIVE',
        name: 'ACTIVE SCHOOL PE KIT',
        price: '฿540',
        category: 'PE KITS',
        material: 'LIGHTWEIGHT MESH',
        turnaround: '5-9 DAYS',
        description:
            'ชุดพละดีไซน์ร่วมสมัยสำหรับการใช้งานทุกวัน เน้นความคล่องตัว ทนทาน และความสบายตลอดกิจกรรม รองรับการสกรีนโลโก้และชื่อโรงเรียนอย่างชัดเจน',
        images: [
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1900&q=80',
            'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1900&q=80',
            'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=1900&q=80',
            'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=1900&q=80',
        ],
    },
    {
        id: 13,
        brandTag: 'PAN PERFORMANCE',
        name: 'Pan Supersonic รองท็อป',
        price: '฿1,318',
        category: 'PAN',
        material: 'SYNTHETIC SPEED UPPER + TRACTION OUTSOLE',
        turnaround: 'READY STOCK',
        description:
            'Pan Supersonic รองท็อป ออกแบบสำหรับผู้เล่นที่ต้องการความคล่องตัวและการตอบสนองที่รวดเร็วในทุกจังหวะการเล่น ตัวรองเท้ากระชับ น้ำหนักเบา และให้การยึดเกาะที่มั่นใจทั้งในเกมซ้อมและการแข่งขัน',
        images: [
            '/images/pan/ps1.webp',
            '/images/pan/ps2.webp',
            '/images/pan/ps3.webp',
            '/images/pan/ps4.webp',
            '/images/pan/ps5.webp',
            '/images/pan/ps6.webp',
            '/images/pan/ps7.webp',
            '/images/pan/ps8.webp',
        ],
    },
    {
        id: 14,
        brandTag: 'PAN PERFORMANCE',
        name: 'Pan Supersonic Pro',
        price: '฿2,039',
        category: 'PAN',
        material: 'PRO SPEED UPPER + HIGH RESPONSE OUTSOLE',
        turnaround: 'READY STOCK',
        description:
            'Pan Supersonic Pro ถูกออกแบบสำหรับผู้เล่นที่ต้องการความเร็วและการตอบสนองระดับสูง ตัวรองเท้ากระชับ เบา และช่วยให้การเร่งสปีด การเปลี่ยนจังหวะ และการคอนโทรลบอลทำได้อย่างมั่นใจตลอดเกม',
        images: [
            '/images/pan/psp1.webp',
            '/images/pan/psp2.webp',
            '/images/pan/psp3.webp',
            '/images/pan/psp4.webp',
            '/images/pan/psp5.webp',
            '/images/pan/psp6.webp',
            '/images/pan/psp7.webp',
            '/images/pan/psp8.webp',
        ],
    },
    {
        id: 3,
        brandTag: 'ZETA PERFORMANCE',
        name: 'ZETA ซีต้า SUPERNOVA PRO',
        price: '฿1,690',
        category: 'ZETA',
        material: 'ENGINEERED MESH + TPU FRAME',
        turnaround: 'READY STOCK',
        description:
            'รองเท้าฟุตบอล ZETA รุ่น SUPERNOVA PRO เน้นความเบาและการทรงตัวขณะเปลี่ยนจังหวะเร็ว พื้นยึดเกาะดี เหมาะกับการซ้อมและการแข่งขันจริงในสนามหญ้าเทียมและสนามมาตรฐาน',
        images: [
            '/images/zata/zt1.webp',
            '/images/zata/zt2.webp',
            '/images/zata/zt3.webp',
            '/images/zata/zt4.webp',
        ],
    },
    {
        id: 5,
        brandTag: 'WINGZ PERFORMANCE',
        name: 'Wingz Vortex Pro',
        price: '฿1,390',
        category: 'WINGZ',
        material: 'ULTRA LIGHT MESH + GRIP SOLE',
        turnaround: 'READY STOCK',
        description:
            'รองเท้า Wingz Vortex Pro ออกแบบเพื่อการเคลื่อนที่เร็วและเกาะพื้นดีในจังหวะเปลี่ยนทิศทาง โครงรองเท้าน้ำหนักเบา ระบายอากาศดี เหมาะทั้งซ้อมและใช้งานแข่งขัน',
        images: [
            '/images/wingz/w1.jpg',
            '/images/wingz/w2.jpg',
            '/images/wingz/w3.jpg',
            '/images/wingz/w4.jpg',
            '/images/wingz/w5.jpg',
        ],
    },
    {
        id: 6,
        brandTag: 'WINGZ PERFORMANCE',
        name: 'Wingz Vortex รองท็อป',
        price: '฿800',
        category: 'WINGZ',
        material: 'MICROFIBER UPPER + SPEED CONTROL SOLE',
        turnaround: 'READY STOCK',
        description:
            'Wingz Vortex รุ่นรองท็อปสำหรับผู้เล่นที่ต้องการความกระชับและการควบคุมบอลที่มั่นใจมากขึ้น พร้อมพื้นรองเท้าที่ตอบสนองดีในจังหวะเร่งสปีดและเปลี่ยนทิศทางระหว่างเกม',
        images: [
            '/images/wingz/w6.webp',
            '/images/wingz/w7.webp',
            '/images/wingz/w8.webp',
            '/images/wingz/w9.webp',
        ],
    },
    {
        id: 11,
        brandTag: 'WINGZ ESSENTIAL',
        name: 'WINGZ SAVE ONE & ZENO ONE',
        price: '฿407',
        category: 'WINGZ',
        material: 'SOFT SYNTHETIC UPPER + DAILY GRIP OUTSOLE',
        turnaround: 'READY STOCK',
        description:
            'WINGZ SAVE ONE & ZENO ONE เป็นรองเท้ารุ่นใช้งานอเนกประสงค์ที่เน้นความคุ้มค่า น้ำหนักเบา ใส่สบาย และเหมาะสำหรับการซ้อมหรือใช้งานทั่วไป พร้อมพื้นยึดเกาะที่ตอบโจทย์สนามหลากหลายรูปแบบ',
        images: [
            '/images/wingz/wg1.webp',
            '/images/wingz/wg2.webp',
            '/images/wingz/wg3.webp',
            '/images/wingz/wg4.webp',
            '/images/wingz/wg5.webp',
        ],
    },
    {
        id: 12,
        brandTag: 'WINGZ PERFORMANCE',
        name: 'WINGZ BLAZE',
        price: '฿656',
        category: 'WINGZ',
        material: 'LIGHTWEIGHT TEXTURE UPPER + FLEX OUTSOLE',
        turnaround: 'READY STOCK',
        description:
            'WINGZ BLAZE เป็นรองเท้าที่ออกแบบมาเพื่อการใช้งานที่คล่องตัวและสวมใส่สบาย เหมาะสำหรับผู้เล่นที่ต้องการรองเท้าราคาคุ้มค่า พร้อมพื้นรองเท้าที่ยึดเกาะได้ดีและรองรับการใช้งานต่อเนื่องในสนามซ้อม',
        images: [
            '/images/wingz/wf1.webp',
            '/images/wingz/wf2.webp',
            '/images/wingz/wf3.webp',
            '/images/wingz/wf4.webp',
            '/images/wingz/wf6.webp',
            '/images/wingz/wf7.webp',
        ],
    },
    {
        id: 15,
        brandTag: 'NPFC OFFICIAL',
        name: 'เสื้อสโมสรหนองบัวพิชญ เอฟซี ฤดูกาล 2024-2025',
        price: '฿299',
        category: 'PITCHAYA',
        material: 'DRI-FIT PERFORMANCE FABRIC',
        turnaround: 'READY STOCK',
        description:
            'เสื้อสโมสรหนองบัวพิชญ เอฟซี ฤดูกาล 2024-2025 ออกแบบสำหรับแฟนบอลและผู้เล่นที่ต้องการความสบายระหว่างสวมใส่ เนื้อผ้าระบายอากาศดี แห้งไว และพร้อมใช้งานทั้งในสนามและการใส่ลำลอง',
        images: [
            '/images/npf/npf1.webp',
            '/images/npf/npf2.webp',
            '/images/npf/npf3.webp',
            '/images/npf/npf4.webp',
        ],
    },
    {
        id: 16,
        brandTag: 'NPFC OFFICIAL',
        name: 'เสื้อสโมสรหนองบัวพิชญ เอฟซี ฤดูกาล 2025-2026',
        price: '฿630',
        category: 'PITCHAYA',
        material: 'DRI-FIT PERFORMANCE FABRIC',
        turnaround: 'READY STOCK',
        description:
            'เสื้อสโมสรหนองบัวพิชญ เอฟซี ฤดูกาล 2024-2025 รุ่นภาพถ่ายชุดที่สอง สำหรับแฟนบอลและผู้เล่นที่ต้องการความสบายระหว่างสวมใส่ เนื้อผ้าระบายอากาศดี แห้งไว และเหมาะกับการใช้งานในชีวิตประจำวัน',
        images: [
            '/images/npf/npf5.webp',
            '/images/npf/npf6.webp',
            '/images/npf/npf7.webp',
        ],
    },
    {
        id: 7,
        brandTag: 'MESPORT CARE',
        name: 'เซตโฟมทำความสะอาดรองเท้า',
        price: '฿199',
        category: 'MESPORT',
        material: 'CLEANING FOAM KIT',
        turnaround: 'READY STOCK',
        description:
            'เซตโฟมทำความสะอาดรองเท้าสำหรับดูแลรองเท้ากีฬาให้สะอาดและพร้อมใช้งาน ช่วยลดคราบสกปรกและดูแลผิวรองเท้าให้ดูใหม่ ใช้งานง่าย เหมาะกับการดูแลรองเท้าในชีวิตประจำวัน',
        images: ['/images/logos/Pd07.jpg'],
    },
    {
        id: 8,
        brandTag: 'MESPORT APPAREL',
        name: 'เสื้อ mesport',
        price: '฿84',
        category: 'MESPORT',
        material: 'SOFT POLYESTER FABRIC',
        turnaround: 'READY STOCK',
        description:
            'เสื้อ mesport สำหรับใส่ออกกำลังกายและใช้งานทั่วไป เนื้อผ้าเบา สวมใส่สบาย ระบายอากาศได้ดี เหมาะกับการใช้งานประจำวันและการซ้อมกีฬา',
        images: ['/images/logos/Pd05.jpg', '/images/logos/Pd04.jpg'],
    },
    {
        id: 17,
        brandTag: 'MESPORT APPAREL',
        name: 'เสื้อ mesport',
        price: '฿63',
        category: 'MESPORT',
        material: 'SOFT POLYESTER FABRIC',
        turnaround: 'READY STOCK',
        description:
            'เสื้อ mesport รุ่นราคาประหยัดสำหรับใส่ลำลองและออกกำลังกายเบา ๆ สวมใส่ง่าย ระบายอากาศดี และเหมาะสำหรับการใช้งานในชีวิตประจำวัน',
        images: ['/images/logos/Pd06.jpg'],
    },
    {
        id: 18,
        brandTag: 'PE UNIFORM',
        name: 'ชุดพละนักเรียน รุ่นพื้นฐาน',
        price: '฿199',
        category: 'ชุดพละ',
        material: 'POLYESTER BLEND FABRIC',
        turnaround: 'READY STOCK',
        hidePriceOnDetail: true,
        description:
            'ชุดพละนักเรียนรุ่นพื้นฐาน เน้นความคุ้มค่า ใส่สบาย ระบายอากาศได้ดี เหมาะสำหรับใช้งานในกิจกรรมกีฬาและการเรียนประจำวัน',
        images: ['/images/logos/pd01.jpg', '/images/logos/Pd02.png'],
    },
];

export const sizeOptionsMock = ['S', 'M', 'L', 'XL', 'XXL'] as const;
