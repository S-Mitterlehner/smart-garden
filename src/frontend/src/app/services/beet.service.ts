import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { Beet } from '../models/beet';
import { PlantService } from './plant.service';
import { Plant } from '../models/plant';

@Injectable()
export class BeetService {
  private plantService = inject(PlantService);

  currentBeetId = signal<string | null>(null);

  currentBeet = resource<Beet, { id: string | null }>({
    request: () => ({ id: this.currentBeetId() }),
    loader: ({ request }) => {
      return fetch(`http://localhost:3001/beets/${request.id}`)
        .then((response) => response.json())
        .then((data) => data as Beet);
    },
  });

  currentPlant = computed(
    () => this.plantService.plants.value().find((p) => p.id === this.currentBeet.value()?.plant.id) ?? null
  );

  setCurrentPlant(plant: Plant) {
    this.currentBeet.update((b) => {
      b!.plant.id = plant.id;
      return b;
    });
  }
}
