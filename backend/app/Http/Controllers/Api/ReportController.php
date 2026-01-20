<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    public function exportUsers(Request $request)
    {
        $filename = "users_export_" . date('Ymd') . ".csv";
        $users = User::all();

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() use ($users) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Name', 'Email', 'Role', 'Created At']);

            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->role,
                    $user->created_at
                ]);
            }
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    public function exportApplications(Request $request)
    {
        $filename = "applications_export_" . date('Ymd') . ".csv";
        // Recruiter exports their job applications
        $user = $request->user();
        if ($user->role === 'recruiter') {
            $applications = Application::whereHas('job', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->with('candidate', 'job')->get();
        } elseif ($user->role === 'admin') {
            $applications = Application::with('candidate', 'job')->get();
        } else {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function() use ($applications) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Job Title', 'Candidate Name', 'Status', 'Applied At']);

            foreach ($applications as $app) {
                fputcsv($file, [
                    $app->id,
                    $app->job->title ?? 'N/A',
                    $app->candidate->name ?? 'N/A',
                    $app->status,
                    $app->applied_at
                ]);
            }
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
