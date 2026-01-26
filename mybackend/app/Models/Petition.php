<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Petition extends Model
{
    protected $fillable = [
        'title',
        'description',
        'destinatary',
        'signers',
        'status',
        "user_id",
        "category_id"
    ];
    protected $hidden = [

    ];

    function category()
    {
        return $this->belongsTo(Category::class);
    }

    function user()
    {
        return $this->belongsTo(User::class);
    }

    function userSigners()
    {
        return $this->belongsToMany(User::class, "petition_user");
    }

    function file()
    {
        return $this->hasOne(File::class);
    }
}
