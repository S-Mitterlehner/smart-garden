import { Injectable, resource } from '@angular/core';
import { Plant } from '../models/plant';

@Injectable({
  providedIn: 'root',
})
export class PlantService {
  plants = resource<Plant[], any>({
    loader: () => {
      return fetch('http://localhost:3001/plants')
        .then((response) => response.json())
        .then((data) => data as Plant[]);
    },
    defaultValue: [],
  });
}
