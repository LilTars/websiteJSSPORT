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
];
