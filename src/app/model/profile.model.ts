export class Profile {
    constructor(
        public id?: number,
        public userName?: string,
        public genderId?: number,
        public isNotified?: boolean,
        public profileDescription?: string, /// text
        public userId?: number
    ) {}
}
