<?php

return [
    'base_url' => env('SEO_BASE_URL', 'https://jssport.co.th'),
    'site_name' => env('SEO_SITE_NAME', 'JSSPORT'),
    'default_title' => env('SEO_DEFAULT_TITLE', 'JSSPORT | ชุดกีฬาและอุปกรณ์กีฬา'),
    'default_description' => env(
        'SEO_DEFAULT_DESCRIPTION',
        'JSSPORT ศูนย์รวมชุดกีฬา เสื้อทีม และอุปกรณ์กีฬา คุณภาพสูง พร้อมผลิตตามแบบสำหรับโรงเรียน สโมสร และองค์กรทั่วไทย',
    ),
    'default_image' => env('SEO_DEFAULT_IMAGE', '/images/logos/braner1.png'),
    'twitter_site' => env('SEO_TWITTER_SITE', '@j.s.sport_shop'),
    'locale' => env('SEO_LOCALE', 'th_TH'),
    'html_lang' => env('SEO_HTML_LANG', 'th'),

    /*
    | Server-rendered fallbacks per Inertia page component. Crawlers and link
    | previews read these from the first HTML response; once the app boots,
    | each page's <SeoHead> takes over with the same tags (matched by head-key).
    | Keep the copy in step with the page components.
    */
    'pages' => [
        'Home' => [
            'title' => null,
            'description' => 'JSSPORT ร้านชุดกีฬาและอุปกรณ์กีฬา ผลิตเสื้อทีมตามแบบสำหรับทีม โรงเรียน และองค์กร ด้วยประสบการณ์กว่า 40 ปี',
        ],
        'Products/Index' => [
            'title' => 'สินค้า',
            'description' => 'เลือกซื้อเสื้อกีฬาและอุปกรณ์กีฬาคุณภาพสูงจาก JSSPORT ค้นหาตามหมวดหมู่และดูรายละเอียดสินค้าได้ทันที',
        ],
        'About' => [
            'title' => 'เกี่ยวกับเรา',
            'description' => 'รู้จัก JSSPORT ผู้เชี่ยวชาญด้านชุดกีฬาและงานผลิตครบวงจร พร้อมประสบการณ์ยาวนานกว่า 40 ปี',
        ],
        'Careers' => [
            'title' => 'ร่วมงานกับเรา',
            'description' => 'ร่วมงานกับ JSSPORT ดูตำแหน่งงานที่เปิดรับและสมัครเข้าทีมผู้เชี่ยวชาญด้านชุดกีฬา',
        ],
        'Contact' => [
            'title' => 'ติดต่อ',
            'description' => 'ติดต่อ JSSPORT เพื่อขอใบเสนอราคาชุดกีฬา เสื้อทีม และอุปกรณ์กีฬา ผ่าน Line, Facebook หรือโทรตรง',
        ],
        'Privacy' => [
            'title' => 'นโยบายความเป็นส่วนตัว',
            'description' => 'นโยบายความเป็นส่วนตัวของ jssport.co.th ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562',
        ],
    ],
];
