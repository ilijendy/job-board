<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployerProfile extends Model
{
    protected $fillable=[
        'user_id',
        'company_name',
        'company_logo',
        'company_description',
        'website',
        'location',
        'industry',
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function jobs(){
        return $this->hasMany(Job::class, 'employer_id', 'user_id');
    }
    use HasFactory;
}

