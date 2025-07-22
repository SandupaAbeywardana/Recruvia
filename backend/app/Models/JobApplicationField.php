<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobApplicationField extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_post_id',
        'field_name',
        'field_description',
        'field_type',
        'is_required',
        'status',
        'order',
        'options'
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'status' => 'boolean',
        'options' => 'array',
    ];

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }
}
