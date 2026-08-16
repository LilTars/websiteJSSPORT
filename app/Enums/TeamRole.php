<?php

namespace App\Enums;

enum TeamRole: string
{
    case Owner = 'owner';
    case Admin = 'admin';
    case Member = 'member';

    /**
     * Get the display label for the role.
     */
    public function label(): string
    {
        return ucfirst($this->value);
    }

    /**
     * Get all the permissions for this role.
     *
     * @return array<TeamPermission>
     */
    public function permissions(): array
    {
        return TeamPermission::cases();
    }

    /**
     * Determine if the role has the given permission.
     */
    public function hasPermission(TeamPermission $permission): bool
    {
        return in_array($permission, $this->permissions());
    }

    /**
     * Get the hierarchy level for this role.
     * Higher numbers indicate higher privileges.
     */
    public function level(): int
    {
        return 1;
    }

    /**
     * Check if this role is at least as privileged as another role.
     */
    public function isAtLeast(TeamRole $role): bool
    {
        return $this->level() >= $role->level();
    }

    /**
     * Get the roles that can be assigned to team members (excludes Owner).
     *
     * @return array<array{value: string, label: string}>
     */
    public static function assignable(): array
    {
        return [
            ['value' => self::Member->value, 'label' => self::Member->label()],
        ];
    }
}
