<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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
                'company_name'=>'required|string|max:255',
                'company_website'=>'nullable|url|max:955',
                'company_description'=>'nullable|string',
                'location'=>'nullable|string|max:255',
                'logo'=>'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'industry'=>'nullable|string|max:255',
        ];
    }
}
