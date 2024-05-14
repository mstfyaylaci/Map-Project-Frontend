import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { Point } from '../../models/point';
import { Point as OlPoint, Polygon as OlPolygon } from 'ol/geom';
import OlFormatWKT from 'ol/format/WKT';
import { fromLonLat, transform } from 'ol/proj';
import { Coordinate, toStringHDMS } from 'ol/coordinate';
import { Collection, Feature, Overlay } from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import WKT from 'ol/format/WKT.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Modify, Select, Snap, } from 'ol/interaction';
import Icon from 'ol/style/Icon';
import { PointService } from '../../services/point.service';

import { ModalComponent } from '../point/add-point-modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription, every } from 'rxjs';
import { AddPointService } from '../../services/add-point.service';

import { ModifyPointModalComponent } from '../point/modify-point-modal/modify-point-modal.component';
import { ModifyPointService } from '../../services/modify-point.service';
import { DeletePointService } from '../../services/delete-point.service';

import { PolygonService } from '../../services/polygon/polygon.service';
import { Polygon } from '../../models/polygon';
import { AddPolygonModalComponent } from '../point/polygon/add-polygon-modal/add-polygon-modal.component';
import { ModifyPolygonModalComponent } from '../point/polygon/modify-polygon-modal/modify-polygon-modal.component';

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

  modifyInteraction: Modify

  private addPointButton: Subscription;
  private modifyPointButton: Subscription;
  private deletePointButton: Subscription;
  private deletePolygonButton: Subscription
  private modifyPolygonButton: Subscription

  selectedGeometry: string | null = null;

  point: Point = new Point();
  modifyPoint: Point | null = null;
  points: Point[] = []

  polygons: Polygon[] = []
  polygon: Polygon

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
    private modifyPointService: ModifyPointService,
    private polygonService: PolygonService



  ) {
    this.addPointButton = this.addPointService.buttonClick$.subscribe((geometry) => {

      this.selectedGeometry = geometry
      this.toggleDrawingMode()
    })

    this.modifyPointButton = this.modifyPointService.buttonClick$.subscribe(() => {
      this.modifyPointCoordinate()
    })

    this.deletePointButton = this.deletePointService.buttonClick$.subscribe(() => {

      this.deletePointFeature()
    })
    this.deletePolygonButton = this.deletePointService.buttonClick$.subscribe(() => {
      this.deletePolygonFeature()
    })
    this.modifyPolygonButton = this.modifyPointService.buttonClick$.subscribe(() => {
      this.modifyPolygon()
    })


  }




  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.getMap();
    this.initOverlay();
    this.getPoints();
    this.getPolygons()

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
        style: style
      });



      this.map.addLayer(vectorLayer);
    });
  }

  getPolygons() {
    const vectorSource = this.vectorSource


    this.polygonService.getPolygons().subscribe(response => {
      this.polygons = response.data

      // Veritabanından alınan polygonları işle
      this.polygons.forEach(polygonData => {

        const format = new WKT();
        const feature = format.readFeature(polygonData.wkt, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        vectorSource.addFeature(feature);
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource
      });
      this.map.addLayer(vectorLayer);

      // Haritayı güncelle
      //this.map.getView().fit(vectorSource.getExtent(), {padding: [50, 50, 50, 50]});
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

  openAddPointModal(coordinates: number[]) {



    const dialogRef = this.dialog.open(ModalComponent, {

      width: '400px',
      height: '470px',

      data: { clickedCoordinate: coordinates }

    });




    dialogRef.afterClosed().subscribe(result => {
      //this.toggleDrawingMode() /// Burasıda sorulacak!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      //this.isDrawingModeActive==false

      this.vectorSource.clear()
      this.map.removeInteraction(this.draw)
      this.getPoints()

    });

  }

  openAddPolygonModal(wktGeometry: string) {

    const dialogRef = this.dialog.open(AddPolygonModalComponent, {

      width: '600px',
      height: '370px',

      data: { wkt: wktGeometry }

    });

    dialogRef.afterClosed().subscribe(result => {


      this.vectorSource.clear()
      this.map.removeInteraction(this.draw)
      this.getPoints()
      this.getPolygons()



    });
  }


  enablePointDrawingTool() {

    const source = this.vectorSource;


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

  enablePolygonDrawingTool() {

    const source = this.vectorSource;

    const vectorLayer = new VectorLayer({
      source: source
    });
    this.map.addLayer(vectorLayer);

    this.draw = new Draw({
      source: source,
      type: 'Polygon', // Burada çizim aracının türünü belirtebilirsiniz, örneğin 'LineString', 'Polygon' vb.

    });

    this.draw.on('drawend', (event) => {
      const feature = event.feature;
      const geometry = feature.getGeometry();
      if (geometry !== undefined) {

        const transformGeometry = geometry.clone().transform('EPSG:3857', 'EPSG:4326')

        const format = new WKT();
        const wktGeometry = format.writeGeometry(transformGeometry);
        this.openAddPolygonModal(wktGeometry)
      }
    });

    this.map.addInteraction(this.draw)

    // this.modifyInteraction = new Modify({ source: this.vectorSource });
    // this.map.addInteraction(this.modifyInteraction);

    // const snap = new Snap({ source: this.vectorSource });
    // this.map.addInteraction(snap);

  }


  toggleDrawingMode() {

    if (this.draw) {
      this.map.removeInteraction(this.draw);
    }

    if (this.selectedGeometry === "Point") {
      this.toastrService.success(this.selectedGeometry + " added is active")
      this.enablePointDrawingTool()
      this.isDrawingModeActive = false
    }
    else if (this.selectedGeometry === "Polygon") {
      this.toastrService.success(this.selectedGeometry + " added is active")
      this.enablePolygonDrawingTool()
      this.isDrawingModeActive = false
    }




  }

  modifyPointCoordinate() {

    this.modifyPointService.currentPoint.subscribe(point => {

      if (point) {

        this.modifyPointInteraction(point);
      }
    })


  }




  modifyPointInteraction(point: Point): void {

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


      data: { point, statusModifyButton: true }

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

  modifyPolygon() {
    this.modifyPointService.currentPolygon.subscribe(polygon => {
      if (polygon) {
        this.modifyPolygonInteraction(polygon)
      }
    })
  }

  modifyPolygonInteraction(polygon: Polygon) {


    if (!polygon.wkt) {
      console.error('WKT özelliği bulunamadı.');
      return;
    }

    // WKT özelliğini kullanarak geometriyi oluştur
    const format = new OlFormatWKT();
    const targetWKT = polygon.wkt;

    // Vektör katmanındaki hedef poligonu bulun
    let targetFeature: Feature | undefined; ;
    const features = this.vectorSource.getFeatures();
    features.forEach(feature => {
      const geometry = feature.getGeometry();

      if (geometry instanceof OlPolygon) {

        const featureWKT = format.writeGeometry(geometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });

        if (targetWKT === featureWKT) {
          targetFeature = feature;
          return; // Döngüyü sonlandırın
        }
        else {
          // Diğer poligonları geçici olarak kaldırın
          this.vectorSource.removeFeature(feature);
        }
      }


    });

    if (!targetFeature) {
      console.error('Hedef poligon bulunamadı.');
      return;
    }
    // Modify etkileşimini oluşturun ve hedef poligonu belirtin
    const modifyInteraction = new Modify({
      features: new Collection([targetFeature])

    });

    // Etkileşimi haritaya ekleyin
    this.map.addInteraction(modifyInteraction);

    let updatePolygonWkt:string;

    // Düzenleme işlemi tamamlandığında, değişiklikleri işlemek için bir olay dinleyici ekleyin
    modifyInteraction.on('modifyend', (event) => {
      const modifiedFeatures = event.features.getArray();
      const modifiedGeometry = modifiedFeatures[0].getGeometry();
      if (modifiedGeometry) {
        const modifiedWKT = format.writeGeometry(modifiedGeometry, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        
        // Değiştirilmiş WKT'yi kullanarak yapılan değişiklikleri işleyebilirsiniz
        console.log('Modified WKT:', modifiedWKT);
        updatePolygonWkt=modifiedWKT
      }


    });

    this.map.on('click', (event) => {
      
      // Tıklanan noktanın koordinatlarını alın
      const clickedCoordinate = event.coordinate;

      // Tıklanan noktanın hangi poligonun içinde olduğunu kontrol edin
      const clickedPolygon = this.vectorSource.getFeaturesAtCoordinate(clickedCoordinate).find(feature => {
        const geometry = feature.getGeometry();
        if (geometry instanceof OlPolygon) {
          return geometry.intersectsCoordinate(clickedCoordinate);
        }
        return false;
      });
      if (clickedPolygon === targetFeature) {
        console.log('Düzenleme işlemi sonlandırıldı.');
        this.map.removeInteraction(modifyInteraction);

        const updatePolygon=polygon
        updatePolygon.wkt=updatePolygonWkt
        
        this.openModifyPolygonModal(updatePolygon)
        //this.getPolygons()
      }


    });
  }

  openModifyPolygonModal(polygon:Polygon){
    const dialogRef = this.dialog.open(ModifyPolygonModalComponent, {

      width: '600px',
      height: '370px',


      data: { polygon, statusModifyButton: true}

    });

    dialogRef.afterClosed().subscribe(result => {
      this.vectorSource.clear();
      this.getPolygons()
      this.getPoints()

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

  deletePolygonFeature() {
    this.deletePointService.currentPolygon.subscribe(deletePolygon => {
      if (deletePolygon && deletePolygon.wkt) {
        // WKT özelliğini kullanarak geometriyi oluştur
        const format = new WKT();
        // const geometry = format.readGeometry(deletePolygon.wkt, {
        //   dataProjection: 'EPSG:4326',
        //   featureProjection: 'EPSG:3857'
        // });

        // Vektör katmanındaki poligonları kontrol et ve kaldır
        const features = this.vectorSource.getFeatures();
        features.forEach(feature => {
          const geometry = feature.getGeometry();
          if (geometry instanceof OlPolygon) {
            // Poligonların WKT formatına dönüştürülmesi gerekir

            const wkt = format.writeGeometry(geometry, {
              dataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857'
            });

            // Karşılaştırma için WKT'yi kullan
            if (wkt === deletePolygon.wkt) {

              this.vectorSource.removeFeature(feature);
              return;
            }
          }
        });

        // Eğer harita üzerindeki poligonların sayısı sıfırsa, vektör katmanını da kaldır
        if (this.vectorSource.getFeatures().length === 0) {
          this.map.removeLayer(this.vectorLayer);
        }
      }
    });
  }
}