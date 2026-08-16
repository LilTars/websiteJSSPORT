<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Backoffice\Actions\UpsertJobPostingAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\JobPostingUpsertRequest;
use App\Models\JobPosting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class JobPostingController extends Controller
{
    public function index(): Response
    {
        $jobPostings = JobPosting::query()
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('backoffice/job-postings/index', [
            'items' => $jobPostings->through(fn (JobPosting $posting) => [
                'id' => $posting->id,
                'title' => $posting->title,
                'description' => $posting->description,
                'positions_count' => $posting->positions_count,
                'is_active' => $posting->is_active,
                'published_at' => $posting->published_at?->toDateString() ?? $posting->created_at?->toDateString(),
            ]),
        ]);
    }

    public function store(JobPostingUpsertRequest $request, UpsertJobPostingAction $upsertJobPosting): RedirectResponse
    {
        $upsertJobPosting->handle($request->validated(), $request->user()->id);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'สร้างประกาศงานเรียบร้อยแล้ว']);

        return back();
    }

    public function update(JobPostingUpsertRequest $request, string $current_team, string $jobPosting, UpsertJobPostingAction $upsertJobPosting): RedirectResponse
    {
        $jobPostingModel = JobPosting::query()->findOrFail((int) $jobPosting);

        $upsertJobPosting->handle($request->validated(), $request->user()->id, $jobPostingModel);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'อัปเดตประกาศงานเรียบร้อยแล้ว']);

        return back();
    }

    public function destroy(string $current_team, string $jobPosting): RedirectResponse
    {
        $jobPostingModel = JobPosting::query()->findOrFail((int) $jobPosting);
        $jobPostingModel->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'ลบประกาศงานเรียบร้อยแล้ว']);

        return back();
    }

    public function toggleActive(string $current_team, string $jobPosting): RedirectResponse
    {
        $jobPostingModel = JobPosting::query()->findOrFail((int) $jobPosting);
        $jobPostingModel->is_active = ! $jobPostingModel->is_active;
        $jobPostingModel->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $jobPostingModel->is_active ? 'เปิดใช้งานประกาศเรียบร้อยแล้ว' : 'ปิดใช้งานประกาศเรียบร้อยแล้ว',
        ]);

        return back();
    }
}
