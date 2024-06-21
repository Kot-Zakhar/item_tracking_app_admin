import { Pipe, PipeTransform } from '@angular/core';
import { Location } from '@shared/models/location.model';

@Pipe({
  name: 'location',
  standalone: true,
})
export class LocationPipe implements PipeTransform {
  transform(value: Location): string {
    return `Floor ${value.floor}, ${value.title}`
  }
}