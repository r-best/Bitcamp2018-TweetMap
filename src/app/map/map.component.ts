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
  layers: { [query: string]: {} };

  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(private twitter: TwitterService, private toast: ToastService) { }

  public ngOnInit() {
    this.layers = {};
    loadModules([
      'esri/Map',
      "esri/views/SceneView",
    ]).then(([Map, SceneView]) => {
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
    if(query === `` || query === undefined || query === null)
      return;
    if(Object.keys(this.layers).includes(query)){
      this.toast.showToast(`alert-info`, `This query is already on the map`);
      return;
    }
    this.twitter.getData(query).then(
      res => {
        console.log(res)
        loadModules(["esri/layers/FeatureLayer"]).then(([FeatureLayer]) => {
          let color = this._genRandomColor();
          let outline = this._genRandomColor();
          // Construct the new FeatureLayer
          let newLayer: esri.FeatureLayer = new FeatureLayer({
            geometryType: "point",
            fields: [{
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            },{
                name: "size",
                alias: "size",
                type: "int"
            }],
            objectIdField: "ObjectID",
            source: res,
            renderer: {
              type: "simple",  // autocasts as new SimpleRenderer()
              symbol: {
                  type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
                  color: color,
                  outline: {  // autocasts as new SimpleLineSymbol()
                      width: 0.5,
                      color: outline
                  }
              },
              visualVariables: [{
                  type: "size",
                  field: "size",
                  valueUnit: "feet",
                  valueRepresentation: "diameter"
              }]
            }
          });
          // Add the FeatureLayer to the layers array and the map
          this.layers[query] = {
            layer: newLayer,
            color: color
          };
          this.map.add(this.layers[query][`layer`]);
        });
      },
      err => this.toast.showToast(`alert-danger`, err)
    );
  }

  removeLayer(name: string){
    this.map.remove(this.layers[name][`layer`]);
    delete this.layers[name];
  }

  _genRandomColor(): string{
    let hexVals = `0123456789ABCDEF`;
    let color = `#`;
    for(let i = 0; i < 6; i++){
      color += hexVals[Math.floor(Math.random()*hexVals.length)];
    }
    return color;
  }
}