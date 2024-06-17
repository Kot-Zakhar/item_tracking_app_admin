import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Location, LocationWithDetails } from '@shared/models/location.model';

@Injectable()
export class LocationsDataService {
  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl + '/locations';

  getLocations(withItemsOnly: boolean): Observable<LocationWithDetails[]> {
    const params = { withItemsOnly };
    return this.http.get<LocationWithDetails[]>(this.apiUrl, { params });
  }

  getLocationById(id: number): Observable<Location> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Location>(url);
  }

  createLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, location);
  }

  updateLocation(id: number, location: Location): Observable<Location> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Location>(url, location);
  }

  deleteLocation(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}