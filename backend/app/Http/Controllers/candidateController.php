<?php

namespace App\Http\Controllers;

use App\Http\Requests\Candidate\ApplyJobRequest;
use App\Http\Requests\Candidate\UpdateProfileRequest;
use App\Http\Requests\Candidate\UploadResumeRequest;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Support\Facades\Auth;

class CandidateController extends Controller
{
    // Show candidate profile
    public function showProfile()
    {
        $profile = auth()->user()->candidateProfile;

        return response()->json([
            'profile' => $profile,
        ]);
    }

    // Update candidate profile
    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = auth()->user();
        $data = $request->validated();

        $profile = $user->candidateProfile()->updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile,
        ]);
    }

    // Upload resume
    public function uploadResume(UploadResumeRequest $request)
    {
        $user = auth()->user();
        $path = $request->file('resume')->store('resumes', 'public');

        $profile = $user->candidateProfile()->updateOrCreate(
            ['user_id' => $user->id],
            ['resume_url' => $path]
        );

        return response()->json([
            'message'    => 'Resume uploaded successfully',
            'resume_url' => $path,
        ]);
    }

    // Apply to a job
    public function apply(ApplyJobRequest $request, Job $job)
    {
        if (!$job->isApproved()) {
            return response()->json(['message' => 'This job is not available'], 422);
        }

        $alreadyApplied = Application::where('job_id', $job->id)
            ->where('candidate_id', auth()->id())
            ->exists();

        if ($alreadyApplied) {
            return response()->json(['message' => 'You already applied for this job'], 422);
        }

        $resumePath = $request->file('resume')->store('resumes', 'public');

        $application = Application::create([
            'job_id'       => $job->id,
            'candidate_id' => auth()->id(),
            'cover_letter' => $request->cover_letter,
            'resume'       => $resumePath,
            'status'       => 'pending',
        ]);

        return response()->json([
            'message'     => 'Application submitted successfully',
            'application' => $application,
        ], 201);
    }

    // List my applications
    public function myApplications()
    {
        $user = auth()->user();

        $applications = Application::where('candidate_id', $user->id)
            ->with(['job', 'job.employer', 'job.category'])
            ->latest()
            ->get();

        return response()->json([
            'applications' => $applications,
        ]);
    }

    // Cancel an application
    public function cancelApplication(Application $application)
    {
        $user = auth()->user();

        if ($application->candidate_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$application->isPending()) {
            return response()->json(['message' => 'Cannot cancel this application'], 422);
        }

        $application->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Application cancelled successfully',
        ]);
    }
}
