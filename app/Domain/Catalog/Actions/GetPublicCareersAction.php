<?php

namespace App\Domain\Catalog\Actions;

use App\Models\CareerBenefit;
use App\Models\CareerHiringStep;
use App\Models\JobPosting;
use Illuminate\Support\Collection;

class GetPublicCareersAction
{
    /**
     * @return array{benefits: Collection<int, CareerBenefit>, steps: Collection<int, CareerHiringStep>, positions: Collection<int, JobPosting>}
     */
    public function handle(): array
    {
        $benefits = CareerBenefit::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $steps = CareerHiringStep::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('step_number')
            ->get();

        $positions = JobPosting::query()
            ->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('expired_at')
                    ->orWhere('expired_at', '>=', now());
            })
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return [
            'benefits' => $benefits,
            'steps' => $steps,
            'positions' => $positions,
        ];
    }
}
