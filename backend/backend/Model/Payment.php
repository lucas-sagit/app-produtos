class Payment extends Model
{
    protected $fillable = ['cliente_id', 'valor', 'status', 'data_pagamento'];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}
