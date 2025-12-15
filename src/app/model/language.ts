export interface Language {
  id: number,
  code: string,
  label: string,
  flag: string
}

export const SUPPORTED_LANGUAGES: ReadonlyArray<Language> = [
   {id:1, code:'en', label:'English', flag:'EN' },
   {id:2, code:'fr', label:'Français', flag:'FR' }
]
