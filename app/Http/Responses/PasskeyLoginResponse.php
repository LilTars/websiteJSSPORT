<?php

namespace App\Http\Responses;

use App\Http\Responses\Concerns\RedirectsToCurrentTeam;
use Illuminate\Http\JsonResponse;
use Laravel\Passkeys\Contracts\PasskeyLoginResponse as PasskeyLoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class PasskeyLoginResponse implements PasskeyLoginResponseContract
{
    use RedirectsToCurrentTeam;

    public function toResponse($request): Response
    {
        $redirect = $this->dashboardRouteForCurrentTeam($request);

        return $request->wantsJson()
            ? new JsonResponse(['redirect' => $redirect], 200)
            : redirect($redirect);
    }
}
