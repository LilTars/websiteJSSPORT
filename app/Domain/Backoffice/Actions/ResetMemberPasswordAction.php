<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\User;

class ResetMemberPasswordAction
{
    public function handle(User $member, string $newPassword): User
    {
        $member->password = $newPassword;
        $member->last_password_reset_at = now();
        $member->save();

        return $member->refresh();
    }
}
