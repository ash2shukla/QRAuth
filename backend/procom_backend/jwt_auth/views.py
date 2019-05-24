from .models import send_verification_mail
from .serializers import ( SignupSerializer,
                           SigninSerializer,
                           VerifyOTPSerializer,
                           RefreshTokenSerializer,
                           ProfileSerializer,
                           MobileSerializer,
                           EmailSerializer,
                           ChangePasswordSerializer,
                           ChangeMobileSerializer,
                           ChangeEmailSerializer )
from .utils import ( create_new_session, 
                     create_user_with_profile,
                     generate_username,
                     jwt_encode_handler, 
                     send_otp )

from datetime import datetime
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.cache import cache
from django.conf import settings
from jwt import decode
from logging import getLogger
from random import choice
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from string import ascii_letters, digits


logger = getLogger(__name__)


class Signup(APIView):
    """
    post:
        verify the submitted form, save form in cache, generate username and send OTP
    """
    permission_classes = [AllowAny]


    def post(self, request, format=None):
        django_client_user_agent = ''
        signup_ser = SignupSerializer(data=request.data)
        # return response 400 with errors in response
        signup_ser.is_valid(raise_exception=True)
        validated_data = signup_ser.validated_data
        username = generate_username(6)
        otp = send_otp(validated_data['mobile'])
        if otp is None:
            return Response({'detail': 'OTP send failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        validated_data['otp'] = otp
        cache.set(f"{username}SIGNUP", validated_data)

        logger.debug(cache.get(f"{username}SIGNUP"))
        if settings.DEBUG and request.META.get('user_agent') == django_client_user_agent:
            return Response({'id': username, 'otp': otp}, status=status.HTTP_200_OK)
        else:
            return Response({'id': username}, status=status.HTTP_200_OK)

    def get_serializer(self, **kwargs):
        return SignupSerializer()


class DoesMobileExist(APIView):
    """
    post:
        check if the mobile number exists in db.
    """

    permission_classes = [AllowAny]

    def post(self, request, format=None):
        mobile_ser = MobileSerializer(data=request.data)
        mobile_ser.is_valid()
        if 'mobile' in mobile_ser.errors:
            for error in mobile_ser.errors.get('mobile'):
                if error.code == 'unique':
                    return Response({'mobile': ''}, status=status.HTTP_200_OK)
        # if no exception is raised then it means mobile doesnt exist
        return Response({'mobile': 'unique'}, status=status.HTTP_200_OK)


class DoesEmailExist(APIView):
    """
    post:
        check if the mobile number exists in db.
    """

    permission_classes = [AllowAny]

    def post(self, request, format=None):
        email_ser = EmailSerializer(data=request.data)
        email_ser.is_valid()
        if 'email' in email_ser.errors:
            for error in email_ser.errors.get('email'):
                if error.code == 'unique':
                    return Response({'email': ''}, status=status.HTTP_200_OK)
        # if no exception is raised then it means mobile doesnt exist
        return Response({'email': 'unique'}, status=status.HTTP_200_OK)



class VerifyOTP(APIView):
    """
    post:
        verify the OTP corresponding to the username and create_user
    """
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        verify_otp_ser = VerifyOTPSerializer(data=request.data)
        verify_otp_ser.is_valid(raise_exception=True)
        validated_data = verify_otp_ser.validated_data
        user = create_user_with_profile(validated_data)
        if user:
            token, refresh_token, session_key = create_new_session(user.username)
            return Response({'token': token, 'refresh_token': refresh_token, 'session_key': session_key}, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    def get_serializer(self, **kwargs):
        return VerifyOTPSerializer()


class VerifyEmail(APIView):
    """
    get:
        verify the mail id corresponding to the username 
        and set is_mail_verified in meta_profile
    """
    permission_classes = [AllowAny]

    def get(self, request, key, username, format=None):
        saved_key = cache.get(f"{username}MAIL_VERIFICATION_KEY")
        cache.delete(f"{username}MAIL_VERIFICATION_KEY")
        if saved_key == key:
            # Set corresponding is_mail_verified true
            user = User.objects.get(username=username)
            user.mainprofile.is_mail_verified = True
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'non_field_errors': ['MALATTEMPT']}, status=status.HTTP_400_BAD_REQUEST)



class ResendVerifyEmail(APIView):
    """
    get:
        resend the verification link to user's associated mail
        code - PRE_VERIFIED if mail has already been verified
        just send GET on the URL when user is logged in. No params required.
    """
    def get(self, request, format=None):
        if request.user.mainprofile.is_mail_verified:
            return Response({'error': 'PRE_VERIFIED'}, status=status.HTTP_200_OK)
        else:
            sent_link = send_verification_mail(request.user.username, request.user.email)
            logger.debug(sent_link)
            if sent_link:
                if settings.DEBUG:
                    return Response({'link': sent_link}, status=status.HTTP_200_OK)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response({'error': 'SEND_FAIL'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Profile(APIView):
    """
    get:
        get the full profile of user
    put:
        updates the requested field in user profile
    """
    def get(self, request, format=None):
        return Response({
            'mobile': request.user.mainprofile.mobile,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'business_name': request.user.mainprofile.business_name,
            'gstin': request.user.mainprofile.gstin,
            'address': request.user.mainprofile.address
        }, status=status.HTTP_200_OK)

    def put(self, request, format=None):
        update_profile_ser = ProfileSerializer(data=request.data)
        update_profile_ser.is_valid(raise_exception=True)
        validated_data = update_profile_ser.validated_data
        for field, update_value in validated_data.items():
            if hasattr(request.user, field):
                setattr(request.user, field, update_value)
            elif hasattr(request.user.mainprofile, field):
                setattr(request.user.mainprofile, field, update_value)
            # meta profile fields can be added in future and same logic will apply
            # the serializer model would require being extended if metaprofile needs to be made updatable
        request.user.save()
        return Response(status=status.HTTP_200_OK)

    def get_serializer(self, **kwargs):
        return ProfileSerializer()


class ChangePassword(APIView):
    """
    get:
        get otp on registered mobile to change password
    put:
        change the password field in user profile
    """
    def get(self, request, format=None):
        otp = send_otp(request.user.mainprofile.mobile)
        logger.debug(otp)
        cache.set(f"{request.user.username}CHANGE_PASS_OTP", otp)
        if settings.DEBUG:
            return Response({'otp': otp}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_200_OK)

    def put(self, request, format=None):
        change_pass_ser = ChangePasswordSerializer(data=request.data, context={'username': request.user.username})
        change_pass_ser.is_valid(raise_exception=True)
        validated_data = change_pass_ser.validated_data
        if validated_data:
            request.user.set_password(validated_data)
            request.user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_serializer(self, **kwargs):
        return ChangePasswordSerializer()


class ChangeMobile(APIView):
    """
    get:
        get otp on mobile number to be changed, takes mobile number as URL Part
    put:
        change the mobile field in user profile -> mainprofile, takes mobile number with which OTP was generated as URL Part
    """
    def get(self, request, mobile, format=None):
        otp = send_otp(mobile)
        logger.debug(otp)
        cache.set(f"{request.user.username}CHANGE_MOBILE_OTP", {'otp': otp, 'mobile': mobile })
        if settings.DEBUG:
            return Response({'otp': otp}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_200_OK)

    def put(self, request, mobile, format=None):
        change_mobile_ser = ChangeMobileSerializer(data=request.data, context={'username': request.user.username, 'mobile': mobile})
        change_mobile_ser.is_valid(raise_exception=True)
        validated_data = change_mobile_ser.validated_data
        if validated_data:
            request.user.mainprofile.mobile = validated_data
            request.user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_serializer(self, **kwargs):
        return ChangeMobileSerializer()


class ChangeEmail(APIView):
    """
    put:
        change the email field in user model
        SEND_FAIL_BUT_SAVED means the mail was not sent but the mail has been updated in profile 
        and is_mail_verified has been set to False
    """
    def put(self, request, format=None):
        change_email_ser = ChangeEmailSerializer(data=request.data)
        change_email_ser.is_valid(raise_exception=True)
        validated_data = change_email_ser.validated_data

        email = validated_data['email']
        request.user.email = email
        request.user.mainprofile.is_mail_verified = False
        request.user.save()
        
        sent_link = send_verification_mail(request.user.username, email)
        if sent_link:
            if settings.DEBUG:
                return Response({'link': sent_link}, status=status.HTTP_200_OK) 
            else:
                return Response(status=status.HTTP_200_OK)
        else:
            return Response({'error': 'SEND_FAIL_BUT_SAVED'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)
    
    def get_serializer(self, **kwargs):
        return ChangeEmailSerializer()


class Signin(APIView):
    """
    post:
        signs the user in to server
    """
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        signin_ser = SigninSerializer(data=request.data)
        signin_ser.is_valid(raise_exception=True)
        validated_data = signin_ser.validated_data
        user = authenticate(**validated_data)
        # save this in frontend's local storage
        session_key = ''.join([choice(ascii_letters+digits) for i in range(32)])
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        else:
            token, refresh_token, session_key = create_new_session(user.username)
            return Response({'token': token, 'refresh_token': refresh_token, 'session_key': session_key}, status=status.HTTP_200_OK)
    
    def get_serializer(self, **kwargs):
        return SigninSerializer()


class RefreshToken(APIView):
    """
    post:
        update jti in redis and JWT.
        
        must be called every 15 minutes.
    """
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        refresh_token_ser = RefreshTokenSerializer(data=request.data)
        refresh_token_ser.is_valid(raise_exception=True)
        validated_data = refresh_token_ser.validated_data

        refresh_token = validated_data['refresh_token']
        token = validated_data['token']

        session_key = request.META.get('HTTP_X_SESSION_KEY')
        
        unverified_payload = decode(token, None, False)

        username = unverified_payload.get('username')
        
        refresh_token_dict = cache.get(f"{username}REFRESH_TOKEN_DICT") or {}

        if session_key in refresh_token_dict:
            token_dict = refresh_token_dict.get(session_key)
            last_jti = token_dict.get('jti')

            if unverified_payload.get('jti') != last_jti:
                return Response({'error': 'JTI mismatch.'}, status=status.HTTP_401_UNAUTHORIZED)

            if token_dict['refresh_token'] == refresh_token:
                now = datetime.utcnow().timestamp()
                jti = ''.join([choice(ascii_letters+digits) for i in range(32)])
                token_dict['refreshed_at'] = now
                token_dict['jti'] = jti
                refresh_token_dict[session_key] = token_dict
                token = jwt_encode_handler(username, jti, session_key)

                cache.set(f"{username}REFRESH_TOKEN_DICT", refresh_token_dict, timeout=None)

                logger.debug(f"REFRESH user {username} token_dict {refresh_token_dict}")
                return Response({'token': token}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Refresh token mismatch.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'detail': 'Session expired.'}, status=status.HTTP_401_UNAUTHORIZED)

    def get_serializer(self, **kwargs):
        return RefreshTokenSerializer()


class VerifyToken(APIView):
    """
    get:
        just returns a 200 OK if token is fine
    """
    def get(self, request):
        return Response(status=status.HTTP_200_OK)


class Signout(APIView):
    """
    get:
        sings the user out from server
    """
    def get(self, request, format=None):
        session_key = request.META.get('HTTP_X_SESSION_KEY')
        refresh_token_dict = cache.get(f"{request.user.username}REFRESH_TOKEN_DICT") or {}
        try:
            session = refresh_token_dict.pop(session_key)
            cache.set(f"{request.user.username}REFRESH_TOKEN_DICT", refresh_token_dict, timeout=None)
            logger.debug(f"SIGNOUT user {request.user.username} at session {session}")
            return Response(status=status.HTTP_200_OK)
        except KeyError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class HandleSessions(APIView):
    """
    Only callable by the procom-key app.

    get:
        get active sessions of the user
    post:
        end an active session of the user [if session_type is from web]
    delete:
        drop all sessions at once
    """
    def get(self, request, format=None):
        # x_procom = request.META.get('HTTP_X_PROCOM')
        # if x_procom:
            refresh_token_dict = cache.get(f"{request.user.username}REFRESH_TOKEN_DICT") or {}
            token_list = list(refresh_token_dict.keys())

            return Response({'token_list': token_list}, status=status.HTTP_200_OK)
        # else:
        #     return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, format=None):
        # x_procom = request.META.get('HTTP_X_PROCOM')
        # if x_procom:
            session_key = request.data.get('session_key')
            refresh_token_dict = cache.get(f"{request.user.username}REFRESH_TOKEN_DICT") or {}
            try:
                refresh_token_dict.pop(session_key)
                cache.set(f"{request.user.username}REFRESH_TOKEN_DICT", refresh_token_dict, timeout=None)
                logger.debug(f"SESSION ENDED user {request.user.username} by SESSION-ID : {request.META['HTTP_X_SESSION_KEY']} of SESSION-ID : {session_key}")
                return Response(status=status.HTTP_200_OK)
            except KeyError:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        # else:
        #     return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, format=None):
        # x_procom = request.META.get('HTTP_X_PROCOM')
        # if x_procom:
            cache.set(f"{request.user.username}REFRESH_TOKEN_DICT", {}, timeout=None)
            return Response(status=status.HTTP_200_OK)
        # else:
        #     return Response(status=status.HTTP_403_FORBIDDEN)
