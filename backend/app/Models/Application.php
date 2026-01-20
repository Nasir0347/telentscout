<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_post_id',
        'candidate_id',
        'cover_letter',
        'status',
        'applied_at',
    ];

    protected $casts = [
        'applied_at' => 'date',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class, 'job_post_id');
    }

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }
}
