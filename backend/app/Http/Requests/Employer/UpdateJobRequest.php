<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isEmployer();
    }

    public function rules(): array
    {
        return [
            'category_id'      => 'sometimes|exists:categories,id',
            'title'            => 'sometimes|string|max:255',
            'description'      => 'sometimes|string',
            'responsibilities' => 'sometimes|string',
            'requirements'     => 'sometimes|string',
            'benefits'         => 'nullable|string',
            'salary_min'       => 'nullable|numeric|min:0',
            'salary_max'       => 'nullable|numeric|min:0|gte:salary_min',
            'location'         => 'sometimes|string',
            'work_type'        => 'sometimes|in:remote,onsite,hybrid',
            'experience_level' => 'sometimes|in:junior,mid,senior',
            'deadline'         => 'nullable|date|after:today',
        ];
    }
}
