<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\Planner;

class UpsertPlannerAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function handle(array $data, int $actorId, ?Planner $planner = null): Planner
    {
        $planner ??= new Planner();

        $planner->fill($data);
        $planner->updated_by = $actorId;

        if (! $planner->exists) {
            $planner->created_by = $actorId;
        }

        $planner->save();

        return $planner->refresh();
    }
}
