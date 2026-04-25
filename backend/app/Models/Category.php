<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable=[
        'name',
        'slug',
        'icon',
    ];
    public function jobs(){
        return $this->hasmany(Job::class);
    }
    public function setNameAttribute($value){
        $this->attributes['name']=$value;
        $this->attributes['slug']=strtolower(str_replace(' ', '-', $value));
    }
    use HasFactory;
}
