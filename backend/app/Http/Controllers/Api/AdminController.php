<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Job;
use App\Models\RecruiterProfile;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private function checkAdmin($user) {
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized Access');
        }
    }

    public function getAllUsers(Request $request)
    {
        $this->checkAdmin($request->user());
        $users = User::with(['candidateProfile', 'recruiterProfile'])->paginate(20);
        return response()->json($users);
    }

    public function verifyRecruiter(Request $request, $id)
    {
        $this->checkAdmin($request->user());
        $profile = RecruiterProfile::findOrFail($id);
        $profile->is_verified = true;
        $profile->save();

        return response()->json(['message' => 'Recruiter verified successfully']);
    }

    public function moderateJob(Request $request, $id)
    {
        $this->checkAdmin($request->user());
        $job = Job::findOrFail($id);
        
        $request->validate(['status' => 'required|in:open,closed']);
        $job->status = $request->status;
        $job->save();

        return response()->json(['message' => 'Job status updated']);
    }
    
    public function stats(Request $request)
    {
        $this->checkAdmin($request->user());
        return response()->json([
            'total_users' => User::count(),
            'total_jobs' => Job::count(),
            'total_applications' => \App\Models\Application::count(),
        ]);
    }
}
