<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Backoffice\Actions\UpsertPlannerAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\PlannerUpsertRequest;
use App\Models\Planner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlannerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $sortDir = $request->string('sort_dir')->toString() === 'desc' ? 'desc' : 'asc';

        $planners = Planner::query()
            ->when($search !== '', fn ($query) => $query
                ->where('name', 'like', "%{$search}%")
                ->orWhere('contact_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"))
            ->orderBy('sort_order', $sortDir)
            ->orderBy('name', $sortDir)
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('backoffice/planners/index', [
            'filters' => [
                'search' => $search,
                'sort_dir' => $sortDir,
            ],
            'items' => $planners->through(fn (Planner $planner) => [
                'id' => $planner->id,
                'name' => $planner->name,
                'slug' => $planner->slug,
                'contact_name' => $planner->contact_name,
                'phone' => $planner->phone,
                'email' => $planner->email,
                'is_active' => $planner->is_active,
                'sort_order' => $planner->sort_order,
            ]),
        ]);
    }

    public function store(PlannerUpsertRequest $request, UpsertPlannerAction $upsertPlanner): RedirectResponse
    {
        $upsertPlanner->handle($request->validated(), $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'สร้างพลาสเนอร์เรียบร้อยแล้ว']);

        return back();
    }

    public function update(PlannerUpsertRequest $request, Planner $planner, UpsertPlannerAction $upsertPlanner): RedirectResponse
    {
        $upsertPlanner->handle($request->validated(), $request->user()->id, $planner);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'อัปเดตพลาสเนอร์เรียบร้อยแล้ว']);

        return back();
    }

    public function destroy(Planner $planner): RedirectResponse
    {
        $planner->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'ลบพลาสเนอร์เรียบร้อยแล้ว']);

        return back();
    }
}
