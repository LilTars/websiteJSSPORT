<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\JobApplicationStoreRequest;
use App\Models\JobApplication;
use Illuminate\Http\RedirectResponse;

class JobApplicationController extends Controller
{
    public function store(JobApplicationStoreRequest $request): RedirectResponse
    {
        JobApplication::create([
            ...$request->validated(),
            'status' => 'new',
            'applied_at' => now(),
        ]);

        return back()->with('success', 'ส่งใบสมัครเรียบร้อยแล้ว');
    }
}
