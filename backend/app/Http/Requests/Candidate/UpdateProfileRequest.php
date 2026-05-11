<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;


class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->IsCandidate();
    }

    public function rules(): array
    {
        return [
            'headline'          => 'nullable|string|max:255',
            'bio'               => 'nullable|string',
            'location'          => 'nullable|string|max:255',
            'experience_years'  => 'nullable|integer|min:0|max:50',
            'linkedin_url'      => 'nullable|url',
            'predefined_skills' => 'nullable|array',
            'predefined_skills.*'=> 'string',
            'custom_skills'     => 'nullable|array',
            'custom_skills.*'   => 'string',
        ];
    }
}
