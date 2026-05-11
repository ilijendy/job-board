<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Job;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function pendingJobs(){
        $jobs=Job::where('status', 'open')->
        with(['employer', 'category'])->latest()->get();
                return response()->json([
            'jobs' => $jobs,
        ]);
    }
    public function approveJob(Job $job){
        $job->update(['status' => 'approved']);
        return response()->json([
            'message' => 'Job approved successfully',
            'job'     => $job,
        ]);
    }
     public function rejectJob(Job $job)
    {
        $job->update(['status' => 'closed']);

        return response()->json([
            'message' => 'Job rejected successfully',
            'job'     => $job,
        ]);
    }

    // إحصائيات عامة
    public function stats()
    {
        return response()->json([
            'total_users'        => User::count(),
            'total_employers'    => User::where('role', 'employer')->count(),
            'total_candidates'   => User::where('role', 'candidate')->count(),
            'total_jobs'         => Job::count(),
            'pending_jobs'       => Job::where('status', 'open')->count(),
            'approved_jobs'      => Job::where('status', 'approved')->count(),
            'total_applications' => Application::count(),
        ]);
    }
}
