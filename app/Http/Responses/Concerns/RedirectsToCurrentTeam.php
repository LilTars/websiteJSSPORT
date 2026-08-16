<?php

namespace App\Http\Responses\Concerns;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

trait RedirectsToCurrentTeam
{
    protected function dashboardRouteForCurrentTeam(Request $request): string
    {
        $team = $this->currentTeam($request);

        if (! $team) {
            return route('home');
        }

        URL::defaults(['current_team' => $team->slug]);

        return route('dashboard', ['current_team' => $team->slug]);
    }

    protected function redirectPathForCurrentTeam(Request $request, string $redirect): string
    {
        $team = $this->currentTeam($request);

        if (! $team) {
            return route('home');
        }

        URL::defaults(['current_team' => $team->slug]);

        return "/{$team->slug}{$redirect}";
    }

    protected function currentTeam(Request $request): ?Team
    {
        $user = $request->user();

        abort_if(! $user, 403);

        $team = $user->currentTeam;

        if ($team && $user->belongsToTeam($team)) {
            return $team;
        }

        $team = $user->personalTeam() ?? $user->fallbackTeam();

        if ($team) {
            if ($user->belongsToTeam($team)) {
                $user->switchTeam($team);

                return $team;
            }
        }

        return null;
    }
}
