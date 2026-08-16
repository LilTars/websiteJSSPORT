<?php

namespace App\Domain\Backoffice\Actions;

use App\Models\User;

class UpsertMemberAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function handle(array $data, ?User $member = null): User
    {
        $member ??= new User();

        $firstName = trim((string) ($data['first_name'] ?? ''));
        $lastName = trim((string) ($data['last_name'] ?? ''));
        $position = trim((string) ($data['position'] ?? ''));
        $username = trim((string) ($data['username'] ?? ''));

        $fullName = trim($firstName.' '.$lastName);
        $email = $this->resolveEmailFromUsername($username);

        if (isset($data['password']) && is_string($data['password']) && $data['password'] !== '') {
            $member->password = $data['password'];
        }

        $member->fill([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'position' => $position,
            'username' => $username,
            'name' => $fullName,
            'email' => $email,
            'phone' => $member->phone,
            'is_active' => $data['is_active'] ?? true,
            'current_team_id' => $data['current_team_id'] ?? null,
        ]);

        $member->save();

        return $member->refresh();
    }

    private function resolveEmailFromUsername(string $username): string
    {
        if (filter_var($username, FILTER_VALIDATE_EMAIL) !== false) {
            return $username;
        }

        return strtolower($username).'@local.user';
    }
}
