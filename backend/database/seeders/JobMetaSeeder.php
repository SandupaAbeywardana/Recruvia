<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JobCategory;
use App\Models\JobType;
use App\Models\JobLocation;
use App\Models\JobLocationType;

class JobMetaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        JobCategory::insert([
            ['name' => 'IT'],
            ['name' => 'Marketing'],
            ['name' => 'Finance'],
            ['name' => 'Human Resources'],
            ['name' => 'Sales'],
            ['name' => 'Customer Service'],
            ['name' => 'Engineering'],
            ['name' => 'Design'],
            ['name' => 'Education'],
            ['name' => 'Healthcare'],
            ['name' => 'Legal'],
            ['name' => 'Hospitality'],
        ]);

        JobType::insert([
            ['name' => 'Full-time'],
            ['name' => 'Part-time'],
            ['name' => 'Contract'],
            ['name' => 'Internship'],
            ['name' => 'Freelance'],
            ['name' => 'Temporary'],
            ['name' => 'Volunteer'],
        ]);

        JobLocation::insert([
            ['name' => 'Colombo, Sri Lanka'],
            ['name' => 'New York, USA'],
            ['name' => 'London, UK'],
            ['name' => 'Toronto, Canada'],
            ['name' => 'Berlin, Germany'],
            ['name' => 'Tokyo, Japan'],
            ['name' => 'Melbourne, Australia'],
            ['name' => 'Singapore'],
            ['name' => 'Dubai, UAE'],
            ['name' => 'Mumbai, India'],
            ['name' => 'Cape Town, South Africa'],
            ['name' => 'São Paulo, Brazil'],
            ['name' => 'Buenos Aires, Argentina'],
        ]);

        JobLocationType::insert([
            ['name' => 'Remote'],
            ['name' => 'On-site'],
            ['name' => 'Hybrid'],
        ]);
    }
}
