export class ClimberProfile {
    constructor(
        public id?: number,
        public name?: string, 
        public avatar?: string,
        public genderId?: number,
        public languageId?:number,
        public climberUser?: Object, //////////////////
        public notified?: boolean, // Pourquoi c'est pas isNotified qui fonctionne? 
        public climberProfileDescription?: string, /// text
    ) {}
}