<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'name', 
        'email', 
        'phone', 
        'membership_type', 
        'join_date',
        'dob',
        'status',
    ];
}