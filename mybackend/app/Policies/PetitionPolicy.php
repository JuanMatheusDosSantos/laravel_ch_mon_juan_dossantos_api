<?php

namespace App\Policies;

use App\Models\Petition;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PetitionPolicy
{
    public function before(User $user, string $ability)
    {
        if ($user->role == "admin") {
            return true;
        }
        return null;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Petition $peticione): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Petition $peticione): bool
    {
        if ($user->role == "user" && $peticione->user_id == $user->id) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Petition $peticione): bool
    {
        if ($user->role_id == "user" && $peticione->user_id == $user->id) {
            return true;
        }
        return false;
    }
}

