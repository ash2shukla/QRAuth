from django.urls import path, re_path
from .views import (Signup,
                    Signout,
                    Signin,
                    VerifyOTP,
                    VerifyEmail,
                    ResendVerifyEmail,
                    RefreshToken,
                    Profile,
                    ChangePassword,
                    ChangeMobile,
                    ChangeEmail,
                    HandleSessions,
                    VerifyToken,
                    DoesEmailExist,
                    DoesMobileExist)


urlpatterns = [
    path('signup/', Signup.as_view()),
    path('verify-otp/', VerifyOTP.as_view()),

    re_path('verify-email/(?P<key>[0-9A-Za-z]{32})/(?P<username>[0-9A-Za-z]{6})', VerifyEmail.as_view()),
    path('resend-verify-email/', ResendVerifyEmail.as_view()),

    path('profile/', Profile.as_view()),
    path('change-password/', ChangePassword.as_view()),
    re_path('change-mobile/(?P<mobile>[0-9]{10})', ChangeMobile.as_view()),
    path('change-email/', ChangeEmail.as_view()),

    path('signin/', Signin.as_view()),
    path('refresh/', RefreshToken.as_view()),
    path('signout/', Signout.as_view()),
    path('verify-token/', VerifyToken.as_view()),

    path('does-mobile-exist/', DoesMobileExist.as_view()),
    path('does-email-exist/', DoesEmailExist.as_view()),

    path('handle-sessions/', HandleSessions.as_view())
]