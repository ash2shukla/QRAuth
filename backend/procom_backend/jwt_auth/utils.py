from string import ascii_lowercase, ascii_uppercase, digits, ascii_letters
from random import choice
from django.db import IntegrityError
from django.contrib.auth.models import User
from .models import MainProfile, MetaProfile
from jwt import decode, encode
from datetime import datetime, timedelta
from django.conf import settings
from django.core.cache import cache
from logging import getLogger


logger = getLogger(__name__)


def generate_username(length:int):
    """
    Generates a unique username
    """
    choices = ascii_lowercase+digits+ascii_uppercase+digits
    usernames = [user.username for user in User.objects.all()]
    generator = lambda : ''.join([choice(choices) for i in range(length)])
    random_username = generator()
    while random_username in usernames:
        random_username = generator()
    return random_username


def send_otp(mobile):
    otp = ''.join([choice(digits) for i in range(6)])
    
    # Assuming that an API to send OTP has been called
    # return the otp to save it in validated data
    # if OTP is not received it will expire with the form data
    return otp


def create_user_with_profile(validated_data):
    """
    Creates a user with Meta and Main Profile
    """
    user = User(username=validated_data['username'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],
                email=validated_data['email'])
    user.set_password(validated_data['password'])
    user.save()
    main_profile = MainProfile(user=user,
                               mobile=validated_data['mobile'],
                               business_name=validated_data['business_name'],
                               procom_secret= ''.join([choice(ascii_letters+digits) for i in range(32)]))
    
    meta_profile = MetaProfile(user=user,
                               meta_info={})
    try:
        main_profile.save()
        meta_profile.save()
    except IntegrityError:
        user.delete()
        return None
    return user


def jwt_encode_handler(username, jti, session_key):
    """
    """
    print(datetime.utcnow())
    payload = {
        'username': username,
        'jti': jti,
        'session_key': session_key,
        'exp': datetime.utcnow() + timedelta(seconds=settings.JWT_TIMEOUT)
    }
    payload['iss'] = 'procom-auth'

    return encode(payload, settings.SECRET_KEY)


def create_new_session(username):
    session_key = ''.join([choice(ascii_lowercase+digits+ascii_uppercase) for i in range(32)])
    jti = ''.join([choice(ascii_lowercase+digits+ascii_uppercase) for i in range(32)])
    refresh_token = ''.join([choice(ascii_lowercase+digits+ascii_uppercase) for i in range(32)])
    token = jwt_encode_handler(username, jti, session_key)
    now = datetime.utcnow().timestamp()

    logger.debug(f"SIGNIN - user: {username} session: {session_key} refresh_token: {refresh_token} jti: {jti}")

    refresh_token_dict = cache.get(f"{username}REFRESH_TOKEN_DICT") or {}
    refresh_token_dict[session_key] = {'refresh_token': refresh_token, 'jti': jti, 'origin_at': now, 'refreshed_at': now}
    cache.set(f"{username}REFRESH_TOKEN_DICT", refresh_token_dict, timeout=None)

    return token.decode(), refresh_token, session_key