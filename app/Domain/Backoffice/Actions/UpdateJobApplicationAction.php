<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\JobApplication;

class UpdateJobApplicationAction
{
    public function handle(JobApplication $application, string $status, ?string $reviewNotes, int $actorId): JobApplication
    {
        $application->status = $status;
        $application->review_notes = $reviewNotes;
        $application->reviewed_by = $actorId;
        $application->reviewed_at = now();
        $application->save();

        return $application->refresh();
    }
}
