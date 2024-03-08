import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { PointService } from '../../services/point.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../point/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit{


  overlay: Overlay;
  public map!: Map

  point: Point = new Point();
  points: Point[] = []
  pointAddForm: FormGroup

  public clickedCoordinate: Coordinate;
  public cordinate: string
  public coordinates: any[] = []


  @ViewChild('popup') popupElement: ElementRef;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('popupContent') popupContentElement: ElementRef;

  constructor(
    private pointService: PointService,
    public dialog: MatDialog,
    private toastrService:ToastrService
    

  ) { }
  

  ngOnInit(): void {
    this.getPoints();
  }

  ngAfterViewInit(): void {
    this.getMap();
    this.initOverlay();
    
    

  }

  getMap(): void {
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


    this.map.on('click', (evt) => {
      const coordinate = evt.coordinate;
      this.clickedCoordinate = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
      this.cordinate = toStringHDMS(this.clickedCoordinate);
      const content = this.popupContentElement.nativeElement;
      content.innerHTML = '<p>Current coordinates are :</p><code>' + this.cordinate + '</code>';
      this.overlay.setPosition(coordinate);

    });
  }

  getPoints() {
    this.pointService.getPoints().subscribe(response => {
      this.points = response.data
      
       // Vektör katmanı oluştur
       const vectorSource = new VectorSource();

      this.points.forEach(point=>{
        
        const feature= new Feature({
          geometry:new OlPoint(fromLonLat([point.latitude,point.longitude]))
        })
        vectorSource.addFeature(feature);

        const vectorLayer=new VectorLayer({
          source: vectorSource,
          style: new Style({
            image: new Icon({
              anchor:[0.5,1],
              src:'assets/point-2.png',
              scale:0.04
            }),
          }),
        });

        this.map.addLayer(vectorLayer)

        
       
      })
    })
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

  openAddPointModal() {
    
    const dialogRef = this.dialog.open(ModalComponent, {
      
      width: '400px',
      height:'470px',
      
      data: { clickedCoordinate: this.clickedCoordinate}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

 

}