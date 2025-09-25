import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse',
})
export class ReversePipe implements PipeTransform {
  transform<T>(value: T): T {
    if (Array.isArray(value)) {
      const arr = value as Array<unknown>;
      return [...arr].reverse() as T;
    }
    return value;
  }
}
