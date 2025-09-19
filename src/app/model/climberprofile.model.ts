export class ClimberProfile {
    constructor(
        public id?: number,
        public avatar?: string,
        public genderId?: number,
        public languageId?:number,
        public notified?: boolean, // Pourquoi c'est pas isNotified qui fonctionne? 
        public climberProfileDescription?: string, /// text
        public climberUserId?: number
    ) {}
}