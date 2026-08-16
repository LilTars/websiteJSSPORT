<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Backoffice\Actions\ResetMemberPasswordAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\MemberResetPasswordRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class MemberPasswordResetController extends Controller
{
    public function __invoke(MemberResetPasswordRequest $request, string $current_team, string $member, ResetMemberPasswordAction $resetPassword): RedirectResponse
    {
        $resolvedMember = User::query()->findOrFail($member);

        $resetPassword->handle($resolvedMember, $request->string('password')->toString());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'รีเซ็ตรหัสผ่านเรียบร้อยแล้ว']);

        return back();
    }
}
