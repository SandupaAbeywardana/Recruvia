<?php

namespace App\Http\Controllers;

use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Helpers\ResponseHelper;

class JobPostController extends Controller
{
    public function index()
    {
        $jobs = JobPost::with(['employer', 'category', 'type', 'location', 'locationType'])
            ->latest()
            ->get();

        return ResponseHelper::success($jobs, 'All job posts');
    }

    public function myJobs()
    {
        $user = Auth::user();

        if ($user->role !== 'employer') {
            return ResponseHelper::error('Unauthorized', [], 403);
        }

        $jobs = $user->jobPosts()
            ->with(['category', 'type', 'location', 'locationType'])
            ->latest()
            ->get();

        return ResponseHelper::success($jobs, 'Your job posts');
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'employer') {
            return ResponseHelper::error('Only employers can post jobs', [], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'location_id' => 'required|exists:job_locations,id',
            'type_id' => 'required|exists:job_types,id',
            'category_id' => 'required|exists:job_categories,id',
            'location_type_id' => 'nullable|exists:job_location_types,id',
            'status' => 'boolean',
            'fields' => 'nullable|array',
            'fields.*.field_name' => 'required_with:fields|string|max:255',
            'fields.*.field_description' => 'nullable|string',
            'fields.*.field_type' => 'required_with:fields|in:text,textarea,number,date,file,select',
            'fields.*.is_required' => 'boolean',
            'fields.*.status' => 'boolean',
            'fields.*.order' => 'nullable|integer',
            'fields.*.options' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    $index = explode('.', $attribute)[1] ?? null;
                    $type = $request->input("fields.$index.field_type");

                    if ($type === 'select' && (!is_array($value) || empty($value))) {
                        $fail('Options must be a non-empty array when field_type is select.');
                    } elseif ($type !== 'select' && $value !== null) {
                        $fail('Options are only allowed when field_type is select.');
                    }
                }
            ],
        ]);

        $job = DB::transaction(function () use ($user, $request) {
            $job = JobPost::create([
                'employer_id' => $user->id,
                'title' => $request->title,
                'description' => $request->description,
                'location_id' => $request->location_id,
                'type_id' => $request->type_id,
                'category_id' => $request->category_id,
                'location_type_id' => $request->location_type_id,
                'status' => $request->status ?? false,
            ]);

            if ($request->has('fields')) {
                foreach ($request->fields as $field) {
                    $job->applicationFields()->create([
                        'field_name' => $field['field_name'],
                        'field_description' => $field['field_description'] ?? null,
                        'field_type' => $field['field_type'],
                        'is_required' => $field['is_required'] ?? false,
                        'status' => $field['status'] ?? true,
                        'order' => $field['order'] ?? 0,
                        'options' => $field['field_type'] === 'select' ? $field['options'] : null,
                    ]);
                }
            }

            return $job;
        });

        return ResponseHelper::success($job->load(['category', 'type', 'location', 'locationType', 'applicationFields']), 'Job post created', 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $job = JobPost::findOrFail($id);

        if ($job->employer_id !== $user->id) {
            return ResponseHelper::error('Unauthorized to update this job', [], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:100',
            'description' => 'sometimes|string',
            'location_id' => 'sometimes|exists:job_locations,id',
            'type_id' => 'sometimes|exists:job_types,id',
            'category_id' => 'sometimes|exists:job_categories,id',
            'location_type_id' => 'sometimes|exists:job_location_types,id',
            'fields' => 'nullable|array',
            'fields.*.id' => 'sometimes|exists:job_application_fields,id',
            'fields.*.field_name' => 'required_with:fields|string|max:255',
            'fields.*.field_description' => 'nullable|string',
            'fields.*.field_type' => 'required_with:fields|in:text,textarea,number,date,file,select',
            'fields.*.is_required' => 'boolean',
            'fields.*.status' => 'boolean',
            'fields.*.order' => 'nullable|integer',
            'fields.*.options' => [
                'nullable',
                function ($attribute, $value, $fail) use ($request) {
                    $index = explode('.', $attribute)[1] ?? null;
                    $type = $request->input("fields.$index.field_type");

                    if ($type === 'select' && (!is_array($value) || empty($value))) {
                        $fail('Options must be a non-empty array when field_type is select.');
                    } elseif ($type !== 'select' && $value !== null) {
                        $fail('Options are only allowed when field_type is select.');
                    }
                }
            ],
        ]);

        DB::transaction(function () use ($request, $job) {
            $job->update($request->only([
                'title', 'description', 'location_id', 'type_id', 'category_id', 'location_type_id'
            ]));

            if ($request->has('fields')) {
                $existingIds = $job->applicationFields()->pluck('id')->toArray();
                $updatedIds = [];

                foreach ($request->fields as $field) {
                    if (isset($field['id'])) {
                        $job->applicationFields()->where('id', $field['id'])->update([
                            'field_name' => $field['field_name'],
                            'field_description' => $field['field_description'] ?? null,
                            'field_type' => $field['field_type'],
                            'is_required' => $field['is_required'] ?? false,
                            'status' => $field['status'] ?? true,
                            'order' => $field['order'] ?? 0,
                            'options' => $field['field_type'] === 'select' ? $field['options'] : null,
                        ]);
                        $updatedIds[] = $field['id'];
                    } else {
                        $job->applicationFields()->create([
                            'field_name' => $field['field_name'],
                            'field_description' => $field['field_description'] ?? null,
                            'field_type' => $field['field_type'],
                            'is_required' => $field['is_required'] ?? false,
                            'status' => $field['status'] ?? true,
                            'order' => $field['order'] ?? 0,
                            'options' => $field['field_type'] === 'select' ? $field['options'] : null,
                        ]);
                    }
                }

                $deleteIds = array_diff($existingIds, $updatedIds);
                $job->applicationFields()->whereIn('id', $deleteIds)->delete();
            }
        });

        return ResponseHelper::success($job->load(['category', 'type', 'location', 'locationType', 'applicationFields']), 'Job post updated');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $job = JobPost::findOrFail($id);

        if ($job->employer_id !== $user->id) {
            return ResponseHelper::error('Unauthorized to delete this job', [], 403);
        }

        $job->delete();

        return ResponseHelper::success([], 'Job post deleted');
    }

    public function search(Request $request)
    {
        $query = JobPost::with(['employer', 'category', 'type', 'location', 'locationType'])
            ->where('status', true);

        if ($request->filled('keyword')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->keyword . '%')
                  ->orWhere('description', 'like', '%' . $request->keyword . '%');
            });
        }

        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        if ($request->filled('type_id')) {
            $query->where('type_id', $request->type_id);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('location_type_id')) {
            $query->where('location_type_id', $request->location_type_id);
        }

        return ResponseHelper::success($query->latest()->get(), 'Filtered job list');
    }

    public function show($id)
    {
        $job = JobPost::with(['employer', 'category', 'type', 'location', 'locationType', 'applicationFields'])->find($id);

        if (!$job) {
            return ResponseHelper::error('Job not found', [], 404);
        }

        return ResponseHelper::success($job, 'Job post retrieved');
    }

    public function updateStatus($id, $status)
    {
        $user = Auth::user();
        $job = JobPost::findOrFail($id);

        if ($job->employer_id !== $user->id) {
            return ResponseHelper::error('Unauthorized to update this job', [], 403);
        }

        if (!in_array($status, [0, 1, '0', '1'], true)) {
            return ResponseHelper::error('Invalid status value. Must be 0 or 1.', [], 422);
        }

        $job->update(['status' => (bool) $status]);

        return ResponseHelper::success($job, 'Job status updated');
    }
}
