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
import { Collection, Feature, Overlay } from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Modify, Select, Snap, } from 'ol/interaction';
import Icon from 'ol/style/Icon';
import { PointService } from '../../services/point.service';

import { ModalComponent } from '../point/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription, every } from 'rxjs';
import { AddPointService } from '../../services/add-point.service';

import { ModifyPointModalComponent } from '../point/modify-point-modal/modify-point-modal.component';
import { ModifyPointService } from '../../services/modify-point.service';
import { DeletePointService } from '../../services/delete-point.service';

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
  public vectorSource = new VectorSource();
  public vectorLayer = new VectorLayer()
  collection = new Collection()
  modifyInteraction: Modify
  private addPointButton: Subscription;
  private modifyPointButton: Subscription;
  private deletePointButton: Subscription;


  point: Point = new Point();
  modifyPoint: Point | null = null;
  points: Point[] = []


  public clickedCoordinate: Coordinate;
  public cordinate: string



  @ViewChild('popup') popupElement: ElementRef;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('popupContent') popupContentElement: ElementRef;

  constructor(
    private pointService: PointService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private addPointService: AddPointService,
    private deletePointService: DeletePointService,
    private modifyPointService: ModifyPointService


  ) {
    this.addPointButton = this.addPointService.buttonClick$.subscribe(() => {

      this.toggleDrawingMode()
    })

    this.modifyPointButton = this.modifyPointService.buttonClick$.subscribe(() => {
      this.modifyCoordinate()
    })

    this.deletePointButton = this.deletePointService.buttonClick$.subscribe(() => {
      this.deletePointFeature()
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





    // this.map.on('click', (evt) => {
    //   const coordinate = evt.coordinate;
    //   this.clickedCoordinate = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
    //   this.cordinate = toStringHDMS(this.clickedCoordinate);
    //   const content = this.popupContentElement.nativeElement;

    //   if (!this.isDrawingModeActive) {
    //     content.innerHTML = '<p>Current coordinates are :</p><code>' + this.cordinate + '</code>';
    //     this.overlay.setPosition(coordinate);
    //   }


    // });
  }

  getPoints(): void {
    
    this.pointService.getPoints().subscribe(response => {
      this.points = response.data;

      const vectorSource = this.vectorSource

      const style = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'assets/point-2.png',
          scale: 0.04
        })
      })

      this.points.forEach(point => {
        const features = new Feature({
          geometry: new OlPoint(fromLonLat([point.latitude, point.longitude]))

        });

        vectorSource.addFeature(features)
        features.setStyle(style)
      });


      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style:style
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
      this.toggleDrawingMode() /// Burasıda sorulacak!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if (result==='save') {
      
        console.log("dsfsfd");
      }else{
        this.vectorSource.clear()
        this.map.removeInteraction(this.draw)
        this.getPoints()
      }

     

    });

  }


  enableDrawingTool() {




    const source = this.vectorSource;

    // const vectorLayer = new VectorLayer({
    //   source: source,

    //   style: new Style({
    //     fill: new Fill({
    //       color: 'rgba(255, 255, 255, 0.2)',
    //     }),
    //     stroke: new Stroke({
    //       color: '#ffcc33',
    //       width: 2,
    //     }),
    //     image: new Icon({
    //       anchor: [0.5, 1],
    //       src: 'assets/point-2.png',
    //       scale: 0.04
    //     }),
    //   }),
    // });

    //this.map.addLayer(this.vectorLayer); //Burasu sorulacak!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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

  modifyCoordinate() {

    this.modifyPointService.currentPoint.subscribe(point => {

      if (point) {

        this.initModifyInteraction(point);
      }
    })


  }




  initModifyInteraction(point: Point): void {
    
    const latitude = point.latitude; // Varsayılan olarak latitude ve longitude olduğunu varsayalım
    const longitude = point.longitude;
    const transformedCoordinates = fromLonLat([latitude, longitude]);;

    
  
    const featureToRemove = new Feature({
      geometry: new OlPoint(transformedCoordinates),
    });

    // Vektör kaynağına eklenen özellikleri döngü ile dolaşarak aranan noktayı bul
    this.vectorSource.getFeatures().forEach((feature) => {

      const featureGeometry = feature.getGeometry();
      if (featureGeometry instanceof OlPoint) {

        const featureCoordinates = featureGeometry.getCoordinates();
        // Eğer koordinatlar parametre olarak gelen koordinatlara eşitse bu özelliği ve simgesini kaldır
        if (featureCoordinates[0] === transformedCoordinates[0] && featureCoordinates[1] === transformedCoordinates[1]) {

          this.vectorSource.removeFeature(feature);

          this.map.removeInteraction(this.modifyInteraction);

          return;
        }
      }
    });


    // Düzenlemek istediğimiz noktanın özelliğini alıyoruz
    const feature = new Feature({
      geometry: new OlPoint(transformedCoordinates),

    });


    this.vectorSource.addFeature(feature);

    // Modify etkileşimini oluşturup belirlediğimiz özellikle kullanıyoruz
    this.modifyInteraction = new Modify({
      features: new Collection([feature]),

    });


    
    this.map.addInteraction(this.modifyInteraction);

    
    
    // Modify işlemi tamamlandığında, değiştirilen koordinatları servise gönderiyoruz
    this.modifyInteraction.on('modifyend', (event) => {
      this.vectorSource.removeFeature(feature);
      this.map.removeInteraction(this.modifyInteraction);

      const modifiedFeature = event.features.getArray()[0] as Feature<OlPoint>;
      const modifiedGeometry = modifiedFeature.getGeometry();

      if (modifiedGeometry) {
        const modifiedCoordinates = modifiedGeometry.getCoordinates();
        // Koordinatları alıp servise iletiyoruz
        const transformodifiedCoordinates = transform(modifiedCoordinates, 'EPSG:3857', 'EPSG:4326');


        // Güncellenmiş latitude ve longitude değerlerini al
        const modifiedLatitude = transformodifiedCoordinates[0];
        const modifiedLongitude = transformodifiedCoordinates[1];

        const updatePoint = point
        updatePoint.latitude = modifiedLatitude
        updatePoint.longitude = modifiedLongitude


   
        this.openModifyPointModal(updatePoint)
        //this.coordinateService.changeCoordinate(modifiedLatitude, modifiedLongitude);

      } else {
        console.error('Modified geometry is undefined.');
      }

    });
  }

  openModifyPointModal(point: Point) {

    
   
    const dialogRef = this.dialog.open(ModifyPointModalComponent, {

      width: '400px',
      height: '530px',

      
      data: { point,statusModifyButton:true }

    });



    dialogRef.afterClosed().subscribe(result => {
      
      if (result !== 'save') {
        
        // Noktanın eski konumunu geri al
        this.vectorSource.clear(); // Vektör kaynağını temizle
        this.map.removeInteraction(this.modifyInteraction); // ModifyInteraction'ı kaldır
        this.getPoints(); // Noktaları tekrar yükle
      } 
    });




  }

  deletePointFeature() {
    this.deletePointService.currentPoint.subscribe(deletePoint => {
      if (deletePoint) {
        // Haritadaki simgeyi ve noktayı kaldır
        const features = this.vectorSource.getFeatures();
        features.forEach(feature => {
          const geometry = feature.getGeometry();
          if (geometry instanceof OlPoint) {
            const coordinates = geometry.getCoordinates();
            const lonLat = transform(coordinates, 'EPSG:3857', 'EPSG:4326');
            if (lonLat[0] === deletePoint.latitude && lonLat[1] === deletePoint.longitude) {
              this.vectorSource.removeFeature(feature);
              return;
            }
          }
        });

        // Eğer harita üzerindeki noktaların sayısı sıfırsa, vektör katmanını da kaldır
        if (this.vectorSource.getFeatures().length === 0) {
          this.map.removeLayer(this.vectorLayer);
        }
      }
    })
  }

}