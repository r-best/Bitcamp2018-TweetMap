import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;

import { TwitterService } from '../shared/services/twitter.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: esri.Map;
  layers: esri.FeatureLayer[];
  inputs: string[];

  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(private twitter: TwitterService, private toast: ToastService) { }

  public ngOnInit() {
    loadModules([
      'esri/Map',
      "esri/layers/FeatureLayer",
      "esri/views/SceneView",
    ]).then(([Map, FeatureLayer, SceneView]) => {
      this.map = new Map({
        basemap: `hybrid`,
        ground: `world-elevation`
      });
      let view: esri.SceneView = new SceneView({
        container: this.mapViewEl.nativeElement,
        map: this.map,            // Reference to the map object created before the scene
        scale: 50000000,          // Sets the initial scale to 1:50,000,000
        center: [-101.17, 21.78]  // Sets the center point of view with lon/lat
      });

      // view.when(() => {
      //   // All the resources in the MapView and the map have loaded. Now execute additional processes
      //   this.mapLoaded.emit(true);
      // }, err => {
      //   console.error(err);
      // });
    })
    .catch(err => {
      console.error(err);
    });
  }

  addLayer(query: string){
    this.twitter.getData(query).then(
      res => {
        console.log(res)
      },
      err => this.toast.showToast(`alert-danger`, err)
    )
  }
}
