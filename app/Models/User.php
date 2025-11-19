<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'jabatan',
        'ul_up',
        'ui_up',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Check if user has UIDRKR role (can access all data)
     *
     * @return bool
     */
    public function isUidrkr(): bool
    {
        return $this->ul_up === 'UIDRKR';
    }

    /**
     * Check if user has UP3 role
     *
     * @return bool
     */
    public function isUp3(): bool
    {
        return strpos($this->ul_up, 'UP3') === 0;
    }

    /**
     * Check if user has ULP role
     *
     * @return bool
     */
    public function isUlp(): bool
    {
        return strpos($this->ul_up, 'ULP') === 0;
    }
}
