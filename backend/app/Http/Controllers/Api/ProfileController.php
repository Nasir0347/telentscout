<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function updateCandidateProfile(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'candidate') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'headline' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'city' => 'nullable|string|max:100',
            'bio' => 'nullable|string',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'skills' => 'nullable|array',
            'experience' => 'nullable|array',
            'education' => 'nullable|array',
        ]);

        $profile = $user->candidateProfile;

        if ($request->hasFile('resume')) {
            if ($profile->resume_path) {
                Storage::disk('public')->delete($profile->resume_path);
            }
            $path = $request->file('resume')->store('resumes', 'public');
            $profile->resume_path = $path;
        }

        $profile->headline = $request->headline;
        $profile->phone = $request->phone;
        $profile->city = $request->city;
        $profile->bio = $request->bio;
        $profile->skills = $request->skills; // Casts handle array serialization
        $profile->experience = $request->experience;
        $profile->education = $request->education;
        
        // Calculate profile completeness (simple logic)
        $filled = 0;
        $total = 7; // headline, phone, city, bio, resume, skills, experience
        if ($profile->headline) $filled++;
        if ($profile->phone) $filled++;
        if ($profile->city) $filled++;
        if ($profile->bio) $filled++;
        if ($profile->resume_path) $filled++;
        if (!empty($profile->skills)) $filled++;
        if (!empty($profile->experience)) $filled++;
        $profile->profile_completeness = round(($filled / $total) * 100);

        $profile->save();

        return response()->json(['message' => 'Profile updated successfully', 'profile' => $profile]);
    }

    public function updateRecruiterProfile(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'recruiter') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'company_name' => 'required|string|max:255',
            'website' => 'nullable|url',
            'location' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:1024', // 1MB max
        ]);

        $profile = $user->recruiterProfile;

        if ($request->hasFile('logo')) {
            if ($profile->company_logo) {
                Storage::disk('public')->delete($profile->company_logo);
            }
            $path = $request->file('logo')->store('logos', 'public');
            $profile->company_logo = $path;
        }

        $profile->company_name = $request->company_name;
        $profile->website = $request->website;
        $profile->location = $request->location;
        $profile->description = $request->description;
        $profile->save();

        return response()->json(['message' => 'Company profile updated successfully', 'profile' => $profile]);
    }
}
