<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobPost;
use App\Models\ApplicationFieldAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use App\Helpers\ResponseHelper;
use App\Notifications\NewJobApplication;

class JobApplicationController extends Controller
{
    public function apply(Request $request, $jobPostId)
    {
        $user = Auth::user();
        if ($user->role !== 'candidate') {
            return ResponseHelper::error('Only candidates can apply', [], 403);
        }

        $job = JobPost::with('employer', 'applicationFields')->findOrFail($jobPostId);

        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'email'      => 'required|email',
            'phone'      => 'required|string|max:20',
            'resume'     => 'required|file|mimes:pdf,doc,docx|max:5120',
            'fields'     => 'nullable|array',
            'fields.*.field_id' => 'required|exists:job_application_fields,id',
        ]);

        if (Application::where('candidate_id', $user->id)->where('job_id', $jobPostId)->exists()) {
            return ResponseHelper::error('You have already applied to this job.', [], 409);
        }

        DB::beginTransaction();

        try {
            $resumePath = $request->file('resume')->store('resumes', 'public');

            $application = Application::create([
                'candidate_id' => $user->id,
                'job_id'  => $jobPostId,
                'first_name'   => $request->first_name,
                'last_name'    => $request->last_name,
                'email'        => $request->email,
                'phone'        => $request->phone,
                'resume_path'  => $resumePath,
            ]);

            foreach ($request->fields ?? [] as $index => $field) {
                $fieldDef = $job->applicationFields->firstWhere('id', $field['field_id']);
                if (!$fieldDef) continue;

                $value = $field['value'] ?? null;

                // If it's a file-type dynamic field
                if ($fieldDef->field_type === 'file' && $request->hasFile("fields.{$index}.value")) {
                    $value = $request->file("fields.{$index}.value")->store('application_files', 'public');
                }

                $application->answers()->create([
                    'job_application_field_id' => $field['field_id'],
                    'value' => $value,
                ]);
            }

            // Notification::route('mail', $request->email)
            //     ->notify(new NewJobApplication($application, $job, true));

            // Notification::route('mail', $job->employer->email)
            //     ->notify(new NewJobApplication($application, $job, false));

            Notification::route('mail', 'sandupa.isum@gmail.com')
                ->notify(new NewJobApplication($application, $job, true));

            Notification::route('mail', 'sandupa.isum@gmail.com')
                ->notify(new NewJobApplication($application, $job, false));

            DB::commit();
            return ResponseHelper::success($application->load('answers'), 'Application submitted');
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseHelper::error('Application failed', [$e->getMessage()], 500);
        }
    }

    public function listByJob($id)
    {
        $user = Auth::user();

        if ($user->role !== 'employer') {
            return ResponseHelper::error('Only employers can view job applications', [], 403);
        }

        $job = JobPost::where('employer_id', $user->id)
            ->with(['applications.answers.field', 'applications.candidate'])
            ->findOrFail($id);

        return ResponseHelper::success($job->applications, 'Applications for this job');
    }

    public function myApplications()
    {
        $user = Auth::user();

        if ($user->role !== 'candidate') {
            return ResponseHelper::error('Only candidates can view their applications', [], 403);
        }

        $applications = $user->applications()
            ->with(['jobPost.category', 'jobPost.type', 'jobPost.location'])
            ->latest()
            ->get();

        return ResponseHelper::success($applications, 'Your job applications');
    }
}
