<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Job extends Model
{
    use HasFactory;
    
    protected $table = 'job_posts';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'requirements',
        'location',
        'salary_range',
        'job_type',
        'status',
        'required_skills',
        'experience_level',
        'deadline'
    ];

    protected $casts = [
        'required_skills' => 'array',
        'deadline' => 'datetime',
    ];

    public function recruiter()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'job_post_id');
    }
}
