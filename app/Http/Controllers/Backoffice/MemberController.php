<?php

namespace App\Http\Controllers\Backoffice;

use App\Domain\Backoffice\Actions\UpsertMemberAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\MemberStoreRequest;
use App\Http\Requests\Backoffice\MemberUpdateRequest;
use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $sortBy = $request->string('sort_by')->toString();
        $sortDir = $request->string('sort_dir')->toString() === 'asc' ? 'asc' : 'desc';
        $allowedSorts = ['name', 'username', 'position', 'created_at'];
        $effectiveSort = in_array($sortBy, $allowedSorts, true) ? $sortBy : 'created_at';

        $members = User::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(fn ($memberQuery) => $memberQuery
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('position', 'like', "%{$search}%"));
            })
            ->orderBy($effectiveSort, $sortDir)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('backoffice/members/index', [
            'filters' => [
                'search' => $search,
                'sort_by' => $effectiveSort,
                'sort_dir' => $sortDir,
            ],
            'items' => $members->through(fn (User $member) => [
                'id' => $member->id,
                'first_name' => $member->first_name,
                'last_name' => $member->last_name,
                'name' => $member->name,
                'position' => $member->position,
                'username' => $member->username,
                'is_active' => $member->is_active,
                'current_team_id' => $member->current_team_id,
                'updated_at' => $member->updated_at?->toDateTimeString(),
            ]),
        ]);
    }

    public function store(MemberStoreRequest $request, UpsertMemberAction $upsertMember): RedirectResponse
    {
        $team = $request->user()?->currentTeam;

        abort_if(! $team instanceof Team, 403);

        DB::transaction(function () use ($request, $team, $upsertMember) {
            $member = $upsertMember->handle($request->validated());

            $member->forceFill([
                'current_team_id' => $team->id,
            ])->save();

            $team->memberships()->firstOrCreate(
                ['user_id' => $member->id],
                ['role' => TeamRole::Member],
            );
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'สร้างสมาชิกเรียบร้อยแล้ว']);

        return back();
    }

    public function update(MemberUpdateRequest $request, string $current_team, string $member, UpsertMemberAction $upsertMember): RedirectResponse
    {
        $resolvedMember = $this->resolveMember($member);

        $upsertMember->handle($request->validated(), $resolvedMember);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'อัปเดตสมาชิกเรียบร้อยแล้ว']);

        return back();
    }

    public function destroy(string $current_team, string $member): RedirectResponse
    {
        $resolvedMember = $this->resolveMember($member);

        $resolvedMember->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'ลบสมาชิกเรียบร้อยแล้ว']);

        return back();
    }

    public function toggleActive(string $current_team, string $member): RedirectResponse
    {
        $resolvedMember = $this->resolveMember($member);

        $resolvedMember->is_active = ! $resolvedMember->is_active;
        $resolvedMember->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $resolvedMember->is_active ? 'เปิดใช้งานผู้ใช้เรียบร้อยแล้ว' : 'ปิดใช้งานผู้ใช้เรียบร้อยแล้ว',
        ]);

        return back();
    }

    private function resolveMember(string $member): User
    {
        return User::query()->findOrFail($member);
    }
}
