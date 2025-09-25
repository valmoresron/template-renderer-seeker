import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LegacyService {
  private messageDisplayDataFromJson = 'Displaying from data.json';
  private messageDisplayFromSampleData = 'Displaying from template.json';
  private messageEndSlide = 'END OF SLIDE';
  private messageEndTemplate = 'END OF TEMPLATE';
  private messageEngagisComplete = 'engagis.complete';

  private parentMessageEvent!: MessageEvent;

  constructor() {
    this.addEventListener();
  }

  hasParentEvent(): boolean {
    return Boolean(this.parentMessageEvent);
  }

  private addEventListener(): void {
    window.addEventListener('message', (event: MessageEvent) => {
      const typedEvent = event as { data: { event: string } };
      if (
        typedEvent.data.event &&
        typedEvent.data.event === 'engagis.display'
      ) {
        this.setParentMessageEvent(event);
      }
    });
  }

  logInitMessage(fromDataJson: boolean): void {
    const message = fromDataJson
      ? this.messageDisplayDataFromJson
      : this.messageDisplayFromSampleData;
    console.log(message);
  }

  logEndSlideMessage(): void {
    console.log(this.messageEndSlide);
  }

  logEndTemplateMessage(): void {
    console.log(this.messageEndTemplate);

    if (this.parentMessageEvent) {
      const { source, origin } = this.parentMessageEvent;
      if (source && origin) {
        (
          source.postMessage as (
            arg1: string,
            arg2: { [key: string]: string },
          ) => void
        )(this.messageEngagisComplete, {
          targetOrigin: origin,
        });
      }
    }
  }

  private setParentMessageEvent(event: MessageEvent): void {
    this.parentMessageEvent = event;
  }
}
