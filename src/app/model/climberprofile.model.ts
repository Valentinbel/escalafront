export class ClimberProfile {
    constructor(
        public id?: number,
        public userName?: string,
        public avatarId?: number,
        public genderId?: number,
        public languageId?:number,
        public isNotified?: boolean,
        public climberProfileDescription?: string, /// text
        public climberUserId?: number
    ) {}
}