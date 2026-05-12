<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // عرض كل الوظائف المتاحة
    public function index(Request $request)
    {
        $jobs = Job::where('status', 'approved')
            ->with(['employer', 'category'])
            ->when($request->keyword, function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->keyword . '%')
                      ->orWhere('description', 'like', '%' . $request->keyword . '%');
                });
            })
            ->when($request->location, function ($query) use ($request) {
                $query->where('location', 'like', '%' . $request->keyword . '%');
            })
            ->when($request->category_id, function ($query) use ($request) {
                $query->where('category_id', $request->category_id);
            })
            ->when($request->type, function ($query) use ($request) {
                $query->where('type', $request->type);
            })
            ->when($request->experience_level, function ($query) use ($request) {
                $query->where('experience_level', $request->experience_level);
            })
            ->when($request->salary, function ($query) use ($request) {
                $query->where('salary', '>=', $request->salary);
            })
            ->latest()
            ->paginate(10);

        return response()->json($jobs);
    }

    // عرض تفاصيل وظيفة واحدة
    public function show(Job $job)
    {
        if (!$job->isApproved()) {
            return response()->json(['message' => 'Job not found'], 404);
        }

        $job->load(['employer', 'category']);

        return response()->json([
            'job' => $job,
        ]);
    }
}
