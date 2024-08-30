export class ClimberProfile {
    constructor(
        public id?: number,
        public createdAt?: string,
        public updatedAt?: string,
        public avatar?: string,
        public genderId?: number,
        public languageId?:number,
        public climberUserId?: number,
        public isNotified?: boolean,
        public climberProfileDescription?: string
    ) {}
}