<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobPost;
use App\Helpers\ResponseHelper;
use Illuminate\Support\Facades\Auth;

class JobPostController extends Controller
{
    public function index()
    {
        $jobs = JobPost::with(['employer', 'category', 'type', 'location'])->latest()->get();
        return ResponseHelper::success($jobs, 'All job posts');
    }

    public function myJobs()
    {
        $user = Auth::user();
        if ($user->role !== 'employer') {
            return ResponseHelper::error('Unauthorized', [], 403);
        }

        $jobs = $user->jobPosts()->with(['category', 'type', 'location'])->latest()->get();
        return ResponseHelper::success($jobs, 'Your job posts');
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'employer') {
            return ResponseHelper::error('Only employers can post jobs', [], 403);
        }

        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'location_id' => 'required|exists:job_locations,id',
            'type_id' => 'required|exists:job_types,id',
            'category_id' => 'required|exists:job_categories,id',
            'status' => 'nullable|in:open,closed'
        ]);

        $job = JobPost::create([
            'employer_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'location_id' => $request->location_id,
            'type_id' => $request->type_id,
            'category_id' => $request->category_id,
            'status' => $request->status ?? 'closed',
        ]);

        return ResponseHelper::success($job->load(['category', 'type', 'location']), 'Job post created', 201);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $job = JobPost::findOrFail($id);

        if ($job->employer_id !== $user->id) {
            return ResponseHelper::error('Unauthorized to update this job', [], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:100',
            'description' => 'sometimes|string',
            'location_id' => 'sometimes|exists:job_locations,id',
            'type_id' => 'sometimes|exists:job_types,id',
            'category_id' => 'sometimes|exists:job_categories,id',
            'status' => 'sometimes|in:open,closed'
        ]);

        $job->update($request->only(['title', 'description', 'location_id', 'type_id', 'category_id']));

        return ResponseHelper::success($job->load(['category', 'type', 'location']), 'Job post updated');
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
        $query = JobPost::with(['employer', 'category', 'type', 'location']);

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

        $query->where('status', 'open');

        $jobs = $query->latest()->get();

        return ResponseHelper::success($jobs, 'Filtered job list');
    }

    public function show($id)
    {
        $job = JobPost::with(['employer', 'category', 'type', 'location'])->find($id);

        if (!$job) {
            return ResponseHelper::error('Job not found', [], 404);
        }

        return ResponseHelper::success($job, 'Job post retrieved');
    }
}
