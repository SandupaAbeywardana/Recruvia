<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'job_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'resume_path'
    ];

    public function job()
    {
        return $this->belongsTo(JobPost::class, 'job_id');
    }

    public function candidate()
    {
        return $this->belongsTo(User::class, 'candidate_id');
    }

    public function answers()
    {
        return $this->hasMany(ApplicationFieldAnswer::class);
    }
}
