<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'location_id', 'type_id', 'category_id', 'employer_id', 'status', 'location_type_id'];
    protected $hidden = ['category_id', 'type_id', 'location_id', 'employer_id', 'location_type_id'];
    protected $casts = [
        'status' => 'boolean',
    ];

    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'job_id');
    }

    public function category() { return $this->belongsTo(JobCategory::class); }
    public function type()     { return $this->belongsTo(JobType::class); }
    public function location() { return $this->belongsTo(JobLocation::class); }
    public function locationType() { return $this->belongsTo(JobLocationType::class); }
}

