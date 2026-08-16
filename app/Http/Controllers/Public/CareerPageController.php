<?php

namespace App\Http\Controllers\Public;

use App\Domain\Catalog\Actions\GetPublicCareersAction;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CareerPageController extends Controller
{
    public function __invoke(GetPublicCareersAction $getPublicCareers): Response
    {
        $data = $getPublicCareers->handle();

        return Inertia::render('Careers', [
            'benefits' => $data['benefits']->map(fn ($benefit) => [
                'title' => $benefit->title,
                'detail' => $benefit->detail,
            ])->values(),
            'hiringSteps' => $data['steps']->map(fn ($step) => [
                'number' => str_pad((string) $step->step_number, 2, '0', STR_PAD_LEFT),
                'title' => $step->title,
                'detail' => $step->detail,
            ])->values(),
            'openPositions' => $data['positions']->map(fn ($position) => [
                'id' => $position->id,
                'title' => $position->title,
                'team' => $position->team,
                'location' => $position->location,
                'type' => $position->employment_type,
                'description' => $position->summary,
            ])->values(),
        ]);
    }
}
