<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Job;
use App\Models\User;

class JobFactory extends Factory
{
    protected $model = Job::class;

    public function definition(): array
    {
        $jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
        $experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'];

        return [
            'user_id' => User::factory(), // This might create too many users, better to recycle or set in seeder
            'title' => $this->faker->jobTitle,
            'description' => $this->faker->paragraphs(3, true),
            'requirements' => $this->faker->paragraphs(2, true),
            'location' => $this->faker->city . ', ' . $this->faker->stateAbbr,
            'salary_range' => '$' . $this->faker->numberBetween(50, 150) . 'k - $' . $this->faker->numberBetween(160, 250) . 'k',
            'job_type' => $this->faker->randomElement($jobTypes),
            'experience_level' => $this->faker->randomElement($experienceLevels),
            'required_skills' => $this->faker->words(5),
            'status' => 'open',
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
