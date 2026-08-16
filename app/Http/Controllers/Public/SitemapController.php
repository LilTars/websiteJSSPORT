<?php

namespace App\Http\Controllers\Public;

use App\Domain\Catalog\Actions\GetSitemapUrlsAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(GetSitemapUrlsAction $getSitemapUrls): Response
    {
        $urls = $getSitemapUrls->handle();

        $xml = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ];

        foreach ($urls as $url) {
            $xml[] = '    <url>';
            $xml[] = '        <loc>'.e($url['loc']).'</loc>';
            $xml[] = '        <lastmod>'.e($url['lastmod']).'</lastmod>';
            $xml[] = '        <changefreq>'.e($url['changefreq']).'</changefreq>';
            $xml[] = '        <priority>'.e($url['priority']).'</priority>';
            $xml[] = '    </url>';
        }

        $xml[] = '</urlset>';

        return response(implode("\n", $xml), 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
