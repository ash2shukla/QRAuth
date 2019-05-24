export class SigninModel {
    id_field: string;
    password: string;
}


export class SigninResponseModel {
    token: string;
    refresh_token: string;
    session_key: string;
}


export class SigninProcessedResponseModel {
    code: number;
    message: string;
}

