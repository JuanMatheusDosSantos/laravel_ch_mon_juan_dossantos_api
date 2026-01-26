<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        "name",
        "file_path",
        "petition_id"
    ];
    protected $hidden = [
        "petition_id"
    ];

    function petition()
    {
        return $this->belongsTo(Petition::class);
    }
}
