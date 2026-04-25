<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isEmployer();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'title'=>'required|string|max:255',
            'description'=>'required|string',
            'location'=>'required|string|max:255',
            'salary'=>'nullable|numeric',
            'type'=>'required|in:full-time,part-time,contract,internship',
            'responsibilities'=>'nullable|string',
            'qualifications'=>'nullable|string',
            'experience_level'=>'nullable|in:entry,mid,senior',
            'application_deadline'=>'nullable|date|after:today',
        ];
    }
}
