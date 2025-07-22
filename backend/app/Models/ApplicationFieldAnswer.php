<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApplicationFieldAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'job_application_field_id',
        'value',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function field()
    {
        return $this->belongsTo(JobApplicationField::class, 'job_application_field_id');
    }
}
