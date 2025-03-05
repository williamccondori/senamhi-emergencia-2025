import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-index',
  standalone: true, // Si usas standalone components
  imports: [MenubarModule, DropdownModule, FormsModule, CardModule, TabsModule],
  templateUrl: './index.component.html',
})
export class IndexComponent implements AfterViewInit {
  menuItems: MenuItem[] = []; // Puedes agregar ítems al menú si lo necesitas

  departamentos = [
    { nombre: 'Lima', codigo: '01' },
    { nombre: 'Arequipa', codigo: '02' },
    { nombre: 'Cusco', codigo: '03' },
    { nombre: 'Piura', codigo: '04' },
  ];

  selectedDepartamento: any;

  // Mapas como propiedades para controlarlos
  private maps: { [key: string]: L.Map } = {};

  ngAfterViewInit(): void {
    // Inicializamos solo el mapa de la pestaña activa inicial (valor 0)
    this.initializeMap('map-aviso-meteorologico-1');
    this.initializeMap('map-nowcasting-1');
  }

  // Método para inicializar un mapa dado un ID
  private initializeMap(mapId: string): void {
    const mapContainer = document.getElementById(mapId);
    if (mapContainer && !this.maps[mapId]) {
      const mapaBase = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      const map = L.map(mapId, {
        scrollWheelZoom: false,
      }).setView([-12.0464, -77.0428], 13);
      map.addLayer(mapaBase);
      this.maps[mapId] = map;

      // Corrige problemas de renderizado al cambiar de pestaña
      setTimeout(() => map.invalidateSize(), 0);
    }
  }

  // Método para manejar el cambio de pestañas
  onTabChange(event: any, section: 'meteorologico' | 'nowcasting'): void {
    console.log(section);

    const mapIdsMeteorologico = [
      'map-aviso-meteorologico-1',
      'map-aviso-meteorologico-2',
      'map-aviso-meteorologico-3',
    ];
    const mapIdsNowcasting = [
      'map-nowcasting-1',
      'map-nowcasting-2',
      'map-nowcasting-3',
    ];

    const mapIds = section === 'meteorologico' ? mapIdsMeteorologico : mapIdsNowcasting;
    const activeMapId = mapIds[event.index];

    // Inicializamos el mapa de la pestaña activa si no está ya inicializado
    if (activeMapId) {
      this.initializeMap(activeMapId);
    }
  }
}
