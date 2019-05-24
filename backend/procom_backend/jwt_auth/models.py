from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache
from django.contrib.postgres.fields import JSONField
from random import choice
from string import ascii_letters, digits
from django.conf import settings


def address_field():
    return {'address_name':'', 'address_line1': '', 'address_line2': '', 'state': '', 'pincode': '', 'country': 'INDIA'}


class MainProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # gstin should be unique but it will
    gstin = models.CharField(max_length=20, blank=True, null=True, unique=True)
    mobile = models.CharField(max_length=10, blank=False, null=False)
    business_name = models.CharField(max_length=200, blank=False, null=False)
    address = JSONField(default=address_field)
    procom_secret = models.CharField(max_length=32)
    is_mail_verified = models.BooleanField(default=False)

    def __str__(self):
        return str(self.user)+ '_' + str(self.user.email) + '_main'


class MetaProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    meta_info = JSONField()

    def __str__(self):
        return str(self.user)+ '_' + str(self.user.email) + '_meta' 


def send_verification_mail(username, email_id):
    """
    creates a random key of 32 characters and persists it in redis against username+"MAIL_VERIFICATION_KEY"
    """
    mail_verification_key = ''.join([choice(ascii_letters+digits) for i in range(32)])
    cache.set(username+'MAIL_VERIFICATION_KEY', mail_verification_key, timeout=7*86400)
    site = f"http://{settings.HOSTNAME}:8000/auth/verify-email/{mail_verification_key}/{username}"
    # write logic to send the site to mail

    # Currently returning True further the response will be T/F based on mail_api response
    return site


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # perform authentication of mail and mobile
        send_verification_mail(instance.username, instance.email)
    else:
        if not instance.is_superuser:
            instance.metaprofile.save()
            instance.mainprofile.save()
