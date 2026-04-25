<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable=[
        'job_id',
        'candidate_id',
        'cover_letter',
        'resume',
        'status',
    ];
    public function job(){
        return $this->belongsTo(Job::class);
    }
    public function candidate(){
        return $this->belongsTo(User::class, 'candidate_id');
    }
   protected function casts():array
    {
        return [
            'contact_shared' => 'boolean',
        ];
    }
    public function isPending():bool{
        return $this->status==='pending';
    }
    public function isReviewed():bool{
        return $this->status==='reviewed';
    }
    public function isAccepted():bool{
        return $this->status==='accepted';
    }
    public function isRejected():bool{
        return $this->status==='rejected';
    }
    public function isCancelled():bool{
        return $this->status==='cancelled';
    }
    use HasFactory;
}
