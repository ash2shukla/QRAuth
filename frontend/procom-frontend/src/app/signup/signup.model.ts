export class SignupModel {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    business_name: string;
    password: string;
}

export class SignupResponseModel {
    id: string;
}

export class SignupProcessedResponseModel {
    code: number;
    message: string;
}

export class VerifyOTPProcessedResponseModel {
    code: number;
    message: string;
}

export class AuthResponseModel {
    token: string;
    refresh_token: string;
    session_key: string;
}

export class OtpModel {
    id: string;
    otp: string;
}

export class AlreadyExistsModel {
    status: boolean;
    message: string;
}

export class MobileModel {
    mobile: string;
}

export class EmailModel {
    email: string;
}
