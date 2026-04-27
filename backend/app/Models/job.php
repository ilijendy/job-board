<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable=[
        'employer_id',
        'category_id',
        'slug',
        'title',
        'description',
        'requirements',
        'responsibilities',
        'location',
        'salary',
        'type',
        'experience_level',
        'application_deadline',
        'status',
    ];

    public function casts():array
    {
       return  [
            'application_deadline'=>'date',
            'salary'=>'decimal:2',
        ];
    }
    public function setTitleAttribute($value)
    {
        $this->attributes["title"]=$value;
        $this->attributes['slug']=strtolower(str_replace(' ', '-', $value));
    }
    public function category(){
        return $this->belongsTo(Category::class);
    }
    public function employer(){
        return $this->belongsTo(User::class, 'employer_id');
    }

    public function applications(){
        return $this->hasMany(Application::class);
    }
    public function isOpen():bool{
        return $this->status==='approved'&& $this->application_deadline > now ();
    }
    public function isClosed():bool{
        return $this->status==='closed' || $this->application_deadline <= now();
    }
    public function isPaused():bool{
        return $this->status==='paused';
    }
    public function isApproved():bool{
        return $this->status==='approved';
    }
    use HasFactory;
}
