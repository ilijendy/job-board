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

    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('show_deleted') && $request->show_deleted === 'true') {
            $query->withTrashed();
        }

        if ($request->has('role') && $request->role !== '') {
            $query->where('role', $request->role);
        }

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate(10);
        return response()->json($users);
    }

    public function deleteUser(User $user)
    {
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete an admin user'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function jobs(Request $request)
    {
        $query = Job::with(['employer' => function($q){ $q->withTrashed(); }, 'category']);

        if ($request->has('show_deleted') && $request->show_deleted === 'true') {
            $query->withTrashed();
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%");
        }

        $jobs = $query->latest()->paginate(10);
        return response()->json($jobs);
    }

    public function deleteJob(Job $job)
    {
        $job->delete();
        return response()->json(['message' => 'Job deleted successfully']);
    }

    public function restoreUser($id)
    {
        $user = User::withTrashed()->findOrFail($id);
        $user->restore();
        return response()->json(['message' => 'User restored successfully']);
    }

    public function restoreJob($id)
    {
        $job = Job::withTrashed()->findOrFail($id);
        $job->restore();
        return response()->json(['message' => 'Job restored successfully']);
    }
}
