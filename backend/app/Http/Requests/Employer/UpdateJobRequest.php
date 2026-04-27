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
            'salary'           => 'nullable|numeric|min:0',
            'location'         => 'sometimes|string',
            'type'             => 'sometimes|in:full-time,part-time,contract,internship',
            'experience_level' => 'sometimes|in:entry,mid,senior',
            'application_deadline' => 'nullable|date|after:today',
        ];
    }
}
