import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { View } from 'ol';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';

@Injectable({
  providedIn: 'root'
})
export class MapService {

   map!: Map
   

  constructor() { 
    this.getMapService()
  }


  getMapService(){
    this.map = new Map({
      
      target: "map",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([32.8597, 39.9334]),
        zoom: 6.5,
        maxZoom: 18,
      })
    });
    return this.map
  }
}
