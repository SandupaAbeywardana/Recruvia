<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobCategory;
use App\Models\JobType;
use App\Models\JobLocation;
use App\Models\JobLocationType;
use App\Helpers\ResponseHelper;

class JobMetaController extends Controller
{

    public function categories()
    {
        return ResponseHelper::success(JobCategory::all(), 'All job categories');
    }

    public function storeCategory(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:job_categories,name']);
        $category = JobCategory::create(['name' => $request->name]);
        return ResponseHelper::success($category, 'Category created', 201);
    }

    public function deleteCategory($id)
    {
        $category = JobCategory::find($id);
        if (!$category) {
            return ResponseHelper::error('Category not found', [], 404);
        }

        $category->delete();
        return ResponseHelper::success([], 'Category deleted');
    }

    public function locations()
    {
        return ResponseHelper::success(JobLocation::all(), 'All job locations');
    }

    public function storeLocation(Request $request)
    {
        $request->validate(['name' => 'required|string|unique:job_locations,name']);
        $location = JobLocation::create(['name' => $request->name]);
        return ResponseHelper::success($location, 'Location created', 201);
    }

    public function deleteLocation($id)
    {
        $location = JobLocation::find($id);
        if (!$location) {
            return ResponseHelper::error('Location not found', [], 404);
        }

        $location->delete();
        return ResponseHelper::success([], 'Location deleted');
    }

    public function types()
    {
        return ResponseHelper::success(JobType::all(), 'All job types');
    }

    public function locationTypes()
    {
        return ResponseHelper::success(JobLocationType::all(), 'All job location types');
    }
}
