import {ClimbLevel} from "./climbLevel";

export class Search {
  constructor(
    public timeSlots: Date[],
    public climbLevels: ClimbLevel[],
    public placeId: number,
    public title: string,
    public profileId: number,
    public id?: number
  ) {
  }
}
