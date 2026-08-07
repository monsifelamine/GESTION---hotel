<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depense extends Model
{
    /** @use HasFactory<\Database\Factories\DepenseFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'amount',
        'category',
        'date',
        'description',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
