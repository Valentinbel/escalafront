export class LoginResponse {
    constructor(
        public id: number,
        public userName: string,
        public email: string,
        public accessToken: string,
        public refreshRoken: string,
        public tokenType: string,
        public roles: string[] //TODO mettre un enum
    ){}
}
