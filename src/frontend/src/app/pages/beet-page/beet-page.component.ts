import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BeetService } from '../../services/beet.service';
import { PlantSelectorComponent } from '../../components/plant-selector/plant-selector.component';
import { Plant } from '../../models/plant';

@Component({
  selector: 'app-beet-page',
  imports: [PlantSelectorComponent],
  templateUrl: './beet-page.component.html',
})
export class BeetPageComponent {
  activatedRoute = inject(ActivatedRoute);
  beetService = inject(BeetService);

  plant = computed(() => this.beetService.currentPlant());

  constructor() {
    this.activatedRoute.params.subscribe((p) => this.beetService.currentBeetId.set(p['id']));
  }

  selectPlant(plant: Plant) {
    this.beetService.setCurrentPlant(plant);
  }
}
