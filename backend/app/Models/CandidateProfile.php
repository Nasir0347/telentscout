<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CandidateProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'headline',
        'bio',
        'resume_path',
        'skills',
        'experience',
        'education',
        'phone',
        'city',
        'profile_completeness',
    ];

    protected $casts = [
        'skills' => 'array',
        'experience' => 'array',
        'education' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
