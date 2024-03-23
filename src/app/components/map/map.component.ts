import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { Point } from '../../models/point';
import { Point as OlPoint } from 'ol/geom';
import { fromLonLat, transform } from 'ol/proj';
import { Coordinate, toStringHDMS } from 'ol/coordinate';
import { Feature, Overlay } from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw,   } from 'ol/interaction';
import Icon from 'ol/style/Icon';
import { PointService } from '../../services/point.service';

import { ModalComponent } from '../point/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription, every } from 'rxjs';
import { AddPointService } from '../../services/add-point.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, AfterViewInit {



  overlay: Overlay;
  public map!: Map
  draw: Draw
  isDrawingModeActive: boolean = false;
  private addPointButton: Subscription;
 


  point: Point = new Point();
  points: Point[] = []
  

  public clickedCoordinate: Coordinate;
  public cordinate: string
  public coordinates: any[] = []


  @ViewChild('popup') popupElement: ElementRef;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('popupContent') popupContentElement: ElementRef;

  constructor(
    private pointService: PointService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private addPointService: AddPointService


  ) {
    this.addPointButton = this.addPointService.buttonClick$.subscribe(() => {
      
      this.toggleDrawingMode()
    })
  }



  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.getMap();
    this.initOverlay();
    this.getPoints();


  }

  getMap(): void {

    this.map = new Map({

      target: this.mapElement.nativeElement,
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


    this.map.on('click', (evt) => {
      const coordinate = evt.coordinate;
      this.clickedCoordinate = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
      this.cordinate = toStringHDMS(this.clickedCoordinate);
      const content = this.popupContentElement.nativeElement;

      if (!this.isDrawingModeActive) {
        content.innerHTML = '<p>Current coordinates are :</p><code>' + this.cordinate + '</code>';
        this.overlay.setPosition(coordinate);
      }


    });
  }

  getPoints(): void {
    this.pointService.getPoints().subscribe(response => {
      this.points = response.data;

      const features = this.points.map(point => {
        return new Feature({
          geometry: new OlPoint(fromLonLat([point.latitude, point.longitude]))
        });
      });

      const vectorSource = new VectorSource({
        features: features
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'assets/point-2.png',
            scale: 0.04
          })
        })
      });

      this.map.addLayer(vectorLayer);
    });
  }

  initOverlay(): void {
    this.overlay = new Overlay({
      element: this.popupElement.nativeElement,
      autoPan: true,
    });
    this.map.addOverlay(this.overlay);
  }

  closePopup(): void {
    this.overlay.setPosition(undefined);
  }

  openAddPointModal(coordinates: number[]) {
    
    

    const dialogRef = this.dialog.open(ModalComponent, {

      width: '400px',
      height: '470px',

      data: { clickedCoordinate: coordinates }

    });

    

    dialogRef.afterClosed().subscribe(result => {

      this.getPoints();
      this.toggleDrawingMode() /// Burasıda sorulacak!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      

    });

  }


  enableDrawingTool() {



    const source = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: source,

      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new Icon({
          anchor: [0.5, 1],
          src: 'assets/point-2.png',
          scale: 0.04
        }),
      }),
    });

    //this.map.addLayer(vectorLayer); //Burasu sorulacak!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    this.draw = new Draw({
      source: source,
      type: 'Point', // Burada çizim aracının türünü belirtebilirsiniz, örneğin 'LineString', 'Polygon' vb.
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'assets/point-2.png',
          scale: 0.04
        })
      })
    });


    

    this.draw.on('drawend', (event) => {
      
      const feature = event.feature;
      if (feature) {
        const geometry = feature.getGeometry();
        if (geometry && geometry.getType() === 'Point') {
          const coordinates = (geometry as OlPoint).getCoordinates();
          const transformCoordinates = transform(coordinates, 'EPSG:3857', 'EPSG:4326');
          this.openAddPointModal(transformCoordinates);
          
          
        }
        
      }
      
    });
    
    this.map.addInteraction(this.draw);



  }



  toggleDrawingMode() {

    this.isDrawingModeActive = !this.isDrawingModeActive;

    if (this.isDrawingModeActive) {
      this.toastrService.success("Çizim aracı aktif")

      this.enableDrawingTool()

     

    } else {

      this.toastrService.warning("Çizim aracı devre dışı")
      
      this.map.removeInteraction(this.draw);

    }

  }





}