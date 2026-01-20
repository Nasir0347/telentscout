<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\JobApplied;

class ApplicationController extends Controller
{
    // Candidate: Apply for a job
    public function apply(Request $request, $id)
    {
        $user = $request->user();
        if ($user->role !== 'candidate') {
            return response()->json(['message' => 'Only candidates can apply'], 403);
        }

        $job = Job::findOrFail($id);

        if ($job->status !== 'open') {
            return response()->json(['message' => 'Job is closed'], 400);
        }

        if (Application::where('job_post_id', $id)->where('candidate_id', $user->id)->exists()) {
            return response()->json(['message' => 'You have already applied for this job'], 400);
        }

        $application = Application::create([
            'job_post_id' => $id,
            'candidate_id' => $user->id,
            'cover_letter' => $request->cover_letter,
            'status' => 'pending'
        ]);

        // Notify Recruiter
        $recruiter = $job->recruiter;
        if ($recruiter) {
            $recruiter->notify(new JobApplied($application, $job, $user));
        }

        return response()->json(['message' => 'Application submitted successfully', 'application' => $application], 201);
    }

    // Candidate: View my applications
    public function myApplications(Request $request)
    {
        $user = $request->user();
        $applications = Application::where('candidate_id', $user->id)
            ->with(['job.recruiter.recruiterProfile']) // Eager load job and company details
            ->latest()
            ->get();
        return response()->json($applications);
    }

    // Recruiter: View applications for a specific job
    public function jobApplications(Request $request, $id)
    {
        $user = $request->user();
        $job = Job::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $applications = Application::where('job_post_id', $id)
            ->with('candidate.candidateProfile')
            ->latest()
            ->get();
            
        // Add matching score to each application
        $start = microtime(true);
        $applications->transform(function ($app) use ($job) {
             $app->match_score = $this->calculateMatchScore($job, $app->candidate->candidateProfile);
             return $app;
        });
        
        // Sort by match score parsing
        $sorted = $applications->sortByDesc('match_score')->values();

        return response()->json($sorted);
    }

    // Recruiter: Update application status
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();
        // Ensure the application belongs to a job posted by this recruiter
        $application = Application::where('id', $id)->whereHas('job', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->firstOrFail();

        $request->validate([
            'status' => 'required|in:pending,shortlisted,rejected,hired'
        ]);

        $application->status = $request->status;
        $application->save();

        return response()->json(['message' => 'Application status updated', 'application' => $application]);
    }

    // AI-Ready Logic: Smart Match Score
    private function calculateMatchScore($job, $profile)
    {
        if (!$profile) return 0;

        $score = 0;
        $maxScore = 100;
        
        // 1. Skills Match (50%)
        $jobSkills = $job->required_skills ?? []; // Array of strings
        $userSkills = $profile->skills ?? []; // Array of strings
        
        if (!empty($jobSkills)) {
            $commonSkills = array_intersect(array_map('strtolower', $jobSkills), array_map('strtolower', $userSkills));
            $skillMatchRatio = count($commonSkills) / count($jobSkills);
            $score += $skillMatchRatio * 50;
        } else {
             $score += 50; // No skills required, full points
        }

        // 2. Experience Match (30%)
        // Simple string match for logic demonstration. "Senior" > "Mid" > "Junior"
        $jobExp = strtolower($job->experience_level ?? '');
        $userExp = $profile->experience ?? []; // This is detailed JSON, simplification needed
        // Assuming profile has a field or we check specific experience entries.
        // For now, let's assume we parse "Senior" from bio or verify years.
        // Fallback: Give partial points if profile is complete
        $score += ($profile->profile_completeness / 100) * 30;

        // 3. Location Match (20%)
        if (str_contains(strtolower($job->location ?? ''), strtolower($profile->city ?? ''))) {
            $score += 20;
        }

        return round($score);
    }
}
