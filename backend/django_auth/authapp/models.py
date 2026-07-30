from django.db import models

class BrandedProduct(models.Model):
    product_id = models.CharField(max_length=64, unique=True, db_index=True)
    brand = models.CharField(max_length=128)
    model_name = models.CharField(max_length=128)
    category = models.CharField(max_length=64)
    origin = models.CharField(max_length=128)
    mint_date = models.DateField()
    nfc_chip = models.CharField(max_length=128)
    blockchain_hash = models.CharField(max_length=128)
    block_number = models.BigIntegerField(default=1894204)
    smart_contract = models.CharField(max_length=128, default='0x71C7656EC7ab88b098defB751B7401B5f6d8976F')
    warranty = models.CharField(max_length=256)
    is_valid = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.brand} — {self.product_id}"


class VerificationLog(models.Model):
    product_id_queried = models.CharField(max_length=64)
    is_authentic = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    blockchain_hash = models.CharField(max_length=128, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "AUTHENTIC" if self.is_authentic else "FRAUD"
        return f"[{status}] {self.product_id_queried} at {self.timestamp}"
