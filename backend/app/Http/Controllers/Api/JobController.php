<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // Public: List all open jobs
    public function index(Request $request)
    {
        $query = Job::with('recruiter.recruiterProfile')->where('status', 'open');

        if ($request->has('keyword') && $request->keyword != '') {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', '%' . $keyword . '%')
                  ->orWhere('description', 'like', '%' . $keyword . '%')
                  ->orWhere('requirements', 'like', '%' . $keyword . '%')
                  ->orWhereHas('recruiter.recruiterProfile', function ($q2) use ($keyword) {
                      $q2->where('company_name', 'like', '%' . $keyword . '%');
                  });
            });
        }

        if ($request->has('location') && $request->location != '') {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('job_type') && $request->job_type != '') {
             $query->where('job_type', $request->job_type);
        }

        if ($request->has('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        if ($request->has('date_posted')) {
            $days = (int) $request->date_posted;
            // 1 = 24h, 3 = 3 days, 7 = 7 days, 14 = 14 days
            if (in_array($days, [1, 3, 7, 14])) {
                $query->where('created_at', '>=', now()->subDays($days));
            }
        }

        $jobs = $query->latest()->paginate(10);
        return response()->json($jobs);
    }

    // Public: Show single job
    public function show($id)
    {
        $job = Job::with('recruiter.recruiterProfile')->findOrFail($id);
        return response()->json($job);
    }

    // Recruiter: Create Job
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'recruiter') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'job_type' => 'required|string',
            'deadline' => 'nullable|date',
//            'required_skills' => 'required|array'
        ]);

        $job = Job::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'requirements' => $request->requirements,
            'location' => $request->location,
            'salary_range' => $request->salary_range,
            'job_type' => $request->job_type,
            'required_skills' => $request->required_skills ?? [],
            'experience_level' => $request->experience_level,
            'deadline' => $request->deadline,
            'status' => 'open'
        ]);

        return response()->json(['message' => 'Job posted successfully', 'job' => $job], 201);
    }

    // Recruiter: Update Job
    public function update(Request $request, $id)
    {
        $user = $request->user();
        $job = Job::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $job->update($request->all());

        return response()->json(['message' => 'Job updated successfully', 'job' => $job]);
    }

    // Recruiter: Delete Job
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $job = Job::where('id', $id)->where('user_id', $user->id)->firstOrFail();

        $job->delete();

        return response()->json(['message' => 'Job deleted successfully']);
    }

    // Recruiter: Get My Jobs
    public function myJobs(Request $request)
    {
        $user = $request->user();
        $jobs = Job::where('user_id', $user->id)->withCount('applications')->latest()->get();
        return response()->json($jobs);
    }
}
