<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataPelanggan extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'data_pelanggan';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'unitupi',
        'nm_unitupi',
        'unitap',
        'nama_ap',
        'unitup',
        'nama_up',
        'idpel',
        'nama',
        'nik',
        'ktp',
        'email',
        'alamat',
        'koordinat_x',
        'koordinat_y',
        'tarif',
        'daya',
        'kode_golongan',
        'nomor_meter',
        'nama_update',
        'alamat_update',
        'status_lapangan',
        'ket_lapangan',
        'ket_lapangan_lainnya',
        'ket_pemadanan',
        'ket_pemadanan_lainnya',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'daya' => 'integer',
    ];
}
