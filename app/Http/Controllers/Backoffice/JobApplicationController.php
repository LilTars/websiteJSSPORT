<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Backoffice\Actions\UpdateJobApplicationAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\JobApplicationUpdateRequest;
use App\Models\JobApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $sortDir = $request->string('sort_dir')->toString() === 'asc' ? 'asc' : 'desc';

        $applications = JobApplication::query()
            ->with('posting:id,title,slug')
            ->when($search !== '', fn ($query) => $query
                ->where('full_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%"))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->orderBy('applied_at', $sortDir)
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('backoffice/job-applications/index', [
            'filters' => [
                'search' => $search,
                'status' => $status,
                'sort_dir' => $sortDir,
            ],
            'items' => $applications->through(fn (JobApplication $application) => [
                'id' => $application->id,
                'job_posting_id' => $application->job_posting_id,
                'full_name' => $application->full_name,
                'email' => $application->email,
                'phone' => $application->phone,
                'position' => $application->posting?->title,
                'status' => $application->status,
                'applied_at' => $application->applied_at?->toDateTimeString(),
            ]),
        ]);
    }

    public function update(JobApplicationUpdateRequest $request, JobApplication $jobApplication, UpdateJobApplicationAction $updateJobApplication): RedirectResponse
    {
        $updateJobApplication->handle(
            $jobApplication,
            $request->string('status')->toString(),
            $request->input('review_notes'),
            $request->user()->id,
        );

        Inertia::flash('toast', ['type' => 'success', 'message' => 'อัปเดตสถานะผู้สมัครเรียบร้อยแล้ว']);

        return back();
    }

    public function destroy(JobApplication $jobApplication): RedirectResponse
    {
        $jobApplication->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'ลบข้อมูลผู้สมัครเรียบร้อยแล้ว']);

        return back();
    }
}
