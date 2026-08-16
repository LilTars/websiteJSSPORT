<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\JobPosting;
use Illuminate\Support\Str;

class UpsertJobPostingAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function handle(array $data, int $actorId, ?JobPosting $jobPosting = null): JobPosting
    {
        $jobPosting ??= new JobPosting();

        $title = trim((string) ($data['title'] ?? ''));
        $description = trim((string) ($data['description'] ?? ''));
        $positionsCount = (int) ($data['positions_count'] ?? 1);

        $resolvedSlug = Str::slug($title);

        if ($resolvedSlug === '') {
            $resolvedSlug = 'job-posting';
        }

        $baseSlug = $resolvedSlug;
        $suffix = 2;

        while (JobPosting::query()
            ->where('slug', $resolvedSlug)
            ->when($jobPosting->exists, fn ($query) => $query->whereKeyNot($jobPosting->id))
            ->withTrashed()
            ->exists()) {
            $resolvedSlug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        $jobPosting->fill([
            'title' => $title,
            'positions_count' => $positionsCount,
            'slug' => $resolvedSlug,
            'summary' => $description,
            'description' => $description,
            'team' => null,
            'location' => null,
            'employment_type' => null,
            'workplace_type' => null,
            'requirements' => null,
            'benefits' => null,
            'salary_min' => null,
            'salary_max' => null,
            'salary_currency' => 'THB',
            'is_active' => array_key_exists('is_active', $data)
                ? (bool) $data['is_active']
                : ($jobPosting->exists ? (bool) $jobPosting->is_active : true),
            'sort_order' => 0,
            'published_at' => $jobPosting->published_at ?? now(),
            'expired_at' => null,
        ]);
        $jobPosting->updated_by = $actorId;

        if (! $jobPosting->exists) {
            $jobPosting->created_by = $actorId;
        }

        $jobPosting->save();

        return $jobPosting->refresh();
    }
}
