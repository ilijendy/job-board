<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;

class UploadResumeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->IsCandidate();

    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'resume'=>'required|file|mimes:txt,pdf,doc,docx|max:2048'
        ];
    }
    public function messages():array
    {
        return[
            'resume.required'=>'please uploade the resume',
            'resume.mimes'=>'Resume must be a PDF, DOC, or DOCX file',
            'resume.max' => 'Resume must not exceed 2MB',

        ];

    }
}
