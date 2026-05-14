<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;


class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->IsCandidate();
    }

    protected function prepareForValidation(): void
    {
        // Skills may arrive as a JSON string (multipart form) — decode them
        foreach (['predefined_skills', 'custom_skills'] as $key) {
            $val = $this->input($key);
            if (is_string($val)) {
                $decoded = json_decode($val, true);
                if (is_array($decoded)) {
                    $this->merge([$key => $decoded]);
                }
            }
        }
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
