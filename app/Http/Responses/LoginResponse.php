<?php

namespace App\Http\Responses;

use App\Http\Responses\Concerns\RedirectsToCurrentTeam;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    use RedirectsToCurrentTeam;

    public function toResponse($request): Response
    {
        $redirect = $this->dashboardRouteForCurrentTeam($request);

        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false, 'redirect' => $redirect], 200)
            : redirect($redirect);
    }
}
