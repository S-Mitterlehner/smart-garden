import { Component, inject, model } from '@angular/core';
import { Plant } from '../../models/plant';
import { PlantService } from '../../services/plant.service';

@Component({
  selector: 'app-plant-selector',
  imports: [],
  templateUrl: './plant-selector.component.html',
})
export class PlantSelectorComponent {
  private plantService = inject(PlantService);

  selectedPlant = model<Plant | null>(null);
  plants = this.plantService.plants;
}
