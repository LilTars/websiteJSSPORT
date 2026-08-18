<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $path = trim($request->path(), '/');

        $isBackofficeRoute = preg_match('#(^|/)backoffice(/|$)#', $path) === 1
            || preg_match('#(^|/)dashboard$#', $path) === 1;
        $defaultAppearance = 'light';
        $appearance = $isBackofficeRoute
            ? 'light'
            : ($request->cookie('appearance') ?? $defaultAppearance);

        View::share('defaultAppearance', $defaultAppearance);
        View::share('appearance', $appearance);

        return $next($request);
    }
}
