import { Injectable } from '@angular/core';
import { filter, map, Subject } from 'rxjs';
import { EventData } from './event.class';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private readonly subject$ = new Subject<EventData>();

  constructor() { }

  emit(event: EventData) {
    this.subject$.next(event);
    console.log("Emit event");
  }

  on(eventName: string, action: any) {
    console.log("on event");
    return this.subject$.pipe(
      filter((e: EventData) => e.name === eventName),
      map((e: EventData) => e["value"])
    ).subscribe(action);
  }
}
