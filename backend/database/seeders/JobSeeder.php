<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\User;
use App\Models\RecruiterProfile;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        // Create a few recruiters
        $recruiters = User::factory(5)->create(['role' => 'recruiter']);
        
        foreach ($recruiters as $recruiter) {
            RecruiterProfile::create([
                'user_id' => $recruiter->id,
                'company_name' => fake()->company,
                'website' => fake()->url,
                'description' => fake()->paragraph
            ]);

            // Create 5 jobs for each recruiter
            Job::factory(5)->create([
                'user_id' => $recruiter->id
            ]);
        }
    }
}
