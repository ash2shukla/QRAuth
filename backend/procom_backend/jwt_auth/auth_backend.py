from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from re import match
from django.core.cache import cache
from rest_framework import exceptions
from calendar import timegm
from datetime import datetime, timedelta
from uuid import UUID
from jwt import decode, DecodeError, ExpiredSignatureError, InvalidTokenError
from django.utils.encoding import smart_text
from django.utils.translation import ugettext as _
from django.conf import settings
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from urllib.parse import parse_qs
from django.db import close_old_connections
from logging import getLogger


logger = getLogger(__name__)


is_mobile = lambda id_field: bool(match('[0-9]{10}', id_field))


class EmailMobileBackend(ModelBackend):
    """
    Alters fetching of users using emails and mobile numbers
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # fetch corresponding username
        if username is None:
            username = kwargs.get(User.USERNAME_FIELD)
        try:
            if is_mobile(username):
                user = User.objects.get(mainprofile__mobile__exact=username)
            else:
                user = User.objects.get(email__exact=username)
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            User().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user


class JWTAuthentication(BaseAuthentication):
    """
    Custom JWT Authentication that keeps track of JTI
    """
    def jwt_decode_handler(self, token, session_key):
        """
        Return the decoded payload of JWT extracted from DRF authorization header
        """
        options = {
            'verify_exp': True,
        }
        # get user from token, BEFORE verification, to get user secret key
        unverified_payload = decode(token, None, False)

        return decode(token,
            settings.SECRET_KEY,
            options=options,
            issuer='procom-auth',
        )


    def get_jwt_value(self, request):
        """
        Get JWT value from the authorization header API of DRF request object
        """
        raw_auth = get_authorization_header(request)

        if raw_auth == b'':
            return None

        auth = raw_auth.split()
        auth_header_prefix = 'jwt'

        if smart_text(auth[0].lower()) != auth_header_prefix:
            return None

        if len(auth) == 1:
            msg = _('Invalid Authorization header. No credentials provided.')
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = _('Invalid Authorization header. Credentials string '
                    'should not contain spaces.')
            raise exceptions.AuthenticationFailed(msg)

        return auth[1]


    def authenticate(self, request):
        """
        Returns a two-tuple of `User` and token if a valid signature has been
        supplied using JWT-based authentication.  Otherwise returns `None`.
        """
        session_key = request.META.get('HTTP_X_SESSION_KEY')

        if session_key is None:
            msg = _('No X-Session-Key')
            return None

        jwt_value = self.get_jwt_value(request)

        if jwt_value is None:
            return None

        try:
            payload = self.jwt_decode_handler(jwt_value, session_key)
        except ExpiredSignatureError:
            msg = _('Signature has expired.')
            raise exceptions.AuthenticationFailed(msg)
        except DecodeError:
            msg = _('Error decoding signature.')
            raise exceptions.AuthenticationFailed(msg)
        except InvalidTokenError:
            raise exceptions.AuthenticationFailed()

        user = self.authenticate_credentials(payload)

        return (user, payload)


    def authenticate_credentials(self, payload):
        """
        Returns an active user that matches the payload's user id and email.
        """
        username = payload.get('username')

        if not username:
            msg = _('Invalid payload.')
            raise exceptions.AuthenticationFailed(msg)

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            msg = _('Invalid signature.')
            raise exceptions.AuthenticationFailed(msg)

        if not user.is_active:
            msg = _('User account is disabled.')
            raise exceptions.AuthenticationFailed(msg)

        return user


class JWTAuthChannelsMiddleware:
    """
    Custom middleware for managing JWT on channels connections.
    """
    def __init__(self, inner):
        self.inner = inner


    def __call__(self, scope):
        qs = scope['query_string'].decode()

        parsed_qs = parse_qs(qs)

        jwt_value = parsed_qs.get('token')
        session_key = parsed_qs.get('sk')

        if session_key is None:
            return self.inner(dict(scope, user=None))

        if jwt_value is None:
            return self.inner(dict(scope, user=None))
        
        jwt_value = jwt_value[0]
        session_key = session_key[0]

        try:
            payload = self.jwt_decode_handler(jwt_value, session_key)
        except (ExpiredSignatureError, DecodeError, InvalidTokenError) as e:
            return self.inner(dict(scope, user=None))


        user = self.authenticate_credentials(payload)
        logger.debug(f"WS SIGNIN user {user.username}")
        close_old_connections()
        return self.inner(dict(scope, user=user))
    
    def authenticate_credentials(self, payload):
        """
        Returns an active user that matches the payload's user id and email.
        """
        username = payload.get('username')

        if not username:
            return None

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None

        if not user.is_active:
            return None

        return user

    def jwt_decode_handler(self, token, session_key):
        """
        Return the decoded payload of JWT extracted from DRF authorization header
        """
        options = {
            'verify_exp': True,
        }
        # get user from token, BEFORE verification, to get user secret key
        unverified_payload = decode(token, None, False)

        try:
            return decode(token,
                settings.SECRET_KEY,
                options=options,
                issuer='procom-auth',
            )

        except ExpiredSignatureError:
            try:
                username = unverified_payload.get('username')
                refresh_token_dict = cache.get(f"{username}REFRESH_TOKEN_DICT") or {}
                session_dict = refresh_token_dict.get(session_key)
                last_jti = session_dict.get('jti')

                if unverified_payload.get('jti') == last_jti:
                    return unverified_payload
                else:
                    return {}
            except:
                return {}