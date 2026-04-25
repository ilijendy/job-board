<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'headline',
        'bio',
        'location',
        'experience_years',
        'resume',
        'linkedin_url',
        'predefined_skills',
        'custom_skills',
    ];

    protected function casts(): array
    {
        return [
            'predefined_skills' => 'array',
            'custom_skills' => 'array',
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
