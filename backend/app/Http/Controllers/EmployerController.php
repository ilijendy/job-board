<?php

namespace App\Http\Controllers;

use App\Http\Requests\Employer\StoreJobRequest;
use App\Http\Requests\Employer\UpdateJobRequest;
use App\Http\Requests\Employer\UpdateProfileRequest;
use App\Models\Job;

class EmployerController extends Controller
{
    public function showProfile()
    {
        $profile = auth()->user()->employerProfile;

        return response()->json([
            'profile' => $profile,
        ]);
    }

    // تحديث الـ Profile
    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = auth()->user();

        $data = $request->validated();

        if ($request->hasFile('company_logo')) {
            $path = $request->file('company_logo')->store('logos', 'public');
            $data['company_logo'] = $path;
        }

        $profile = $user->employerProfile()->updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile,
        ]);
    }

    // عرض كل Jobs بتاعته
    public function myJobs()
    {
        $jobs = auth()->user()->jobs()->latest()->get();

        return response()->json([
            'jobs' => $jobs,
        ]);
    }

    // إنشاء Job جديدة
    public function Store(StoreJobRequest $request)
    {
        $job = auth()->user()->jobs()->create($request->validated());

        return response()->json([
            'message' => 'Job created successfully',
            'job'     => $job,
        ], 201);
    }

    // تعديل Job
    public function updateJob(UpdateJobRequest $request, Job $job)
    {
        if ($job->employer_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $job->update($request->validated());

        return response()->json([
            'message' => 'Job updated successfully',
            'job'     => $job,
        ]);
    }

    public function deleteJob(Job $job)
    {
        if ($job->employer_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $job->delete();

        return response()->json([
            'message' => 'Job deleted successfully',
        ]);
    }

    // عرض Applications على Jobs بتاعته
    public function jobApplications(Job $job)
    {
        if ($job->employer_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $applications = $job->applications()->with('candidate')->get();

        return response()->json([
            'applications' => $applications,
        ]);
    }

    // قبول أو رفض Application
    public function updateApplicationStatus(Job $job, $applicationId)
    {
        if ($job->employer_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $application = $job->applications()->findOrFail($applicationId);

        request()->validate([
            'status' => 'required|in:accepted,rejected,reviewed',
        ]);

        $application->update([
            'status' => request('status'),
        ]);

        return response()->json([
            'message'     => 'Application status updated',
            'application' => $application,
        ]);
    }
}
