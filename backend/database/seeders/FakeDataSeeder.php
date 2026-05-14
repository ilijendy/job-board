<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Category;
use App\Models\EmployerProfile;
use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class FakeDataSeeder extends Seeder
{
    private const DEMO_PASSWORD = 'password';

    public function run(): void
    {
        $password = Hash::make(self::DEMO_PASSWORD);

        $categoryNames = [
            'Software Development',
            'Data Analytics',
            'Product UX',
            'DevOps Cloud',
            'Sales Marketing',
        ];

        $categories = collect($categoryNames)->map(
            fn (string $name) => Category::query()->firstOrCreate(
                ['name' => $name],
                ['icon' => null],
            ),
        );

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@demo.test'],
            [
                'name' => 'Demo Admin',
                'password' => $password,
                'role' => 'admin',
                'phone' => '+201000000001',
                'is_active' => true,
            ],
        );

        $employerUsers = collect([
            ['name' => 'Nile Software', 'email' => 'hr@nilesoftware.demo'],
            ['name' => 'Cairo FinTech', 'email' => 'talent@cairofintech.demo'],
            ['name' => 'Alexandria Cloud', 'email' => 'people@alexcloud.demo'],
        ])->map(function (array $row) use ($password) {
            $user = User::query()->updateOrCreate(
                ['email' => $row['email']],
                [
                    'name' => $row['name'],
                    'password' => $password,
                    'role' => 'employer',
                    'phone' => '+2010' . random_int(10000000, 99999999),
                    'is_active' => true,
                ],
            );

            EmployerProfile::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'company_name' => $row['name'],
                    'company_description' => 'Growing technology company hiring across Egypt and remote.',
                    'website' => 'https://example.com',
                    'location' => 'Cairo, Egypt',
                    'industry' => 'Technology',
                ],
            );

            return $user;
        });

        $candidateUsers = collect([
            ['name' => 'Sara Hassan', 'email' => 'sara.candidate@demo.test'],
            ['name' => 'Omar El-Masry', 'email' => 'omar.candidate@demo.test'],
        ])->map(function (array $row) use ($password) {
            $user = User::query()->updateOrCreate(
                ['email' => $row['email']],
                [
                    'name' => $row['name'],
                    'password' => $password,
                    'role' => 'candidate',
                    'phone' => '+2011' . random_int(10000000, 99999999),
                    'is_active' => true,
                ],
            );

            DB::table('candidate_profiles')->updateOrInsert(
                ['user_id' => $user->id],
                [
                    'headline' => 'Full-stack developer',
                    'bio' => 'Passionate about Laravel, React, and clean APIs.',
                    'location' => 'Giza, Egypt',
                    'experience_years' => 3,
                    'resume_url' => null,
                    'linkedin_url' => 'https://linkedin.com/in/example',
                    'predefined_skills' => json_encode(['PHP', 'Laravel', 'JavaScript', 'React']),
                    'custom_skills' => json_encode(['REST APIs', 'MySQL']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            );

            return $user;
        });

        $catDev = $categories->firstWhere('name', 'Software Development');
        $catData = $categories->firstWhere('name', 'Data Analytics');
        $catProduct = $categories->firstWhere('name', 'Product UX');
        $catDevOps = $categories->firstWhere('name', 'DevOps Cloud');

        $employerA = $employerUsers[0];
        $employerB = $employerUsers[1];
        $employerC = $employerUsers[2];

        $jobSeeds = [
            [
                'employer_id' => $employerA->id,
                'category_id' => $catDev->id,
                'title' => 'Senior Laravel Backend Engineer',
                'description' => "Design and build REST APIs, collaborate with frontend engineers, and improve reliability of our hiring platform.\n\nYou will work in a small product team with code reviews and CI/CD.",
                'requirements' => '4+ years PHP/Laravel, SQL, Git, testing experience.',
                'responsibilities' => 'Own features end-to-end, mentor juniors, improve performance.',
                'location' => 'Cairo · Hybrid',
                'salary' => 35000,
                'type' => 'full-time',
                'experience_level' => 'senior',
            ],
            [
                'employer_id' => $employerA->id,
                'category_id' => $catDev->id,
                'title' => 'Mid-Level React Frontend Developer',
                'description' => "Ship accessible UI for job seekers and employers. Work with design system and REST APIs.",
                'requirements' => 'React, TypeScript or JavaScript, HTML/CSS, 2+ years experience.',
                'responsibilities' => 'Implement screens, fix bugs, write tests.',
                'location' => 'Remote · Egypt',
                'salary' => 22000,
                'type' => 'full-time',
                'experience_level' => 'mid',
            ],
            [
                'employer_id' => $employerB->id,
                'category_id' => $catData->id,
                'title' => 'Data Analyst — Risk & Reporting',
                'description' => "Build dashboards and ad-hoc analyses for leadership. Partner with engineering on data quality.",
                'requirements' => 'SQL, Excel/Sheets, BI tool (Looker/Power BI) a plus.',
                'responsibilities' => 'Weekly metrics, cohort studies, documentation.',
                'location' => 'Cairo · On-site',
                'salary' => 18000,
                'type' => 'full-time',
                'experience_level' => 'entry',
            ],
            [
                'employer_id' => $employerB->id,
                'category_id' => $catProduct->id,
                'title' => 'Product Designer (B2B)',
                'description' => "Own flows for employer onboarding and job posting. Conduct usability tests with local SMEs.",
                'requirements' => 'Portfolio, Figma, Arabic/English UX copy awareness.',
                'responsibilities' => 'Wireframes, prototypes, handoff to engineering.',
                'location' => 'Cairo · Hybrid',
                'salary' => 24000,
                'type' => 'full-time',
                'experience_level' => 'mid',
            ],
            [
                'employer_id' => $employerC->id,
                'category_id' => $catDevOps->id,
                'title' => 'DevOps Engineer — AWS',
                'description' => "Maintain Terraform stacks, CI pipelines, and observability. On-call rotation shared across team.",
                'requirements' => 'AWS, Docker, Linux, CI/CD; scripting in Bash or Python.',
                'responsibilities' => 'Infra changes, incident response, cost reviews.',
                'location' => 'Alexandria · Hybrid',
                'salary' => 28000,
                'type' => 'full-time',
                'experience_level' => 'senior',
            ],
            [
                'employer_id' => $employerC->id,
                'category_id' => $catDev->id,
                'title' => 'Software Engineering Intern — Summer',
                'description' => "Learn Laravel and React by pairing with engineers on internal tools. 3-month paid internship.",
                'requirements' => 'CS student or bootcamp grad, basic Git, eager to learn.',
                'responsibilities' => 'Tickets with supervision, demos every two weeks.',
                'location' => 'Alexandria · On-site',
                'salary' => 4000,
                'type' => 'internship',
                'experience_level' => 'entry',
            ],
            [
                'employer_id' => $employerA->id,
                'category_id' => $catDev->id,
                'title' => 'Part-Time QA Tester (Manual)',
                'description' => "Test releases on staging, write clear bug reports in English. Flexible hours for students.",
                'requirements' => 'Attention to detail, basic HTTP/API understanding helpful.',
                'responsibilities' => 'Regression checklists, exploratory testing.',
                'location' => 'Remote',
                'salary' => 6000,
                'type' => 'part-time',
                'experience_level' => 'entry',
            ],
            [
                'employer_id' => $employerB->id,
                'category_id' => $catDev->id,
                'title' => 'Contract API Integrations Developer',
                'description' => "3-month contract to integrate payment and KYC providers. Clear scope and milestones.",
                'requirements' => 'Strong PHP or Node, REST, webhooks, documentation.',
                'responsibilities' => 'Integrations, tests, rollout support.',
                'location' => 'Remote · MENA',
                'salary' => 45000,
                'type' => 'contract',
                'experience_level' => 'senior',
            ],
        ];

        $deadline = now()->addMonths(2)->toDateString();

        foreach ($jobSeeds as $row) {
            Job::query()->updateOrCreate(
                ['slug' => strtolower(str_replace(' ', '-', $row['title']))],
                array_merge($row, [
                    'status' => 'approved',
                    'application_deadline' => $deadline,
                ]),
            );
        }

        $firstJobs = Job::query()->where('status', 'approved')->orderBy('id')->take(3)->get();
        $sara = $candidateUsers->firstWhere('email', 'sara.candidate@demo.test');

        foreach ($firstJobs as $index => $job) {
            Application::query()->updateOrCreate(
                [
                    'job_id' => $job->id,
                    'candidate_id' => $sara->id,
                ],
                [
                    'resume' => 'demo-resumes/sara-hassan.pdf',
                    'cover_letter' => $index === 0
                        ? 'I am excited about this role and your product mission.'
                        : 'Quick note: happy to discuss my Laravel and React experience.',
                    'status' => $index === 0 ? 'pending' : 'reviewed',
                ],
            );
        }

        $this->command?->info('Fake data seeded. Log in with password: ' . self::DEMO_PASSWORD);
        $this->command?->table(
            ['Account', 'Email'],
            [
                ['Admin', 'admin@demo.test'],
                ['Employer (Nile Software)', 'hr@nilesoftware.demo'],
                ['Candidate (Sara)', 'sara.candidate@demo.test'],
            ],
        );
    }
}
