declare module 'mapbox-gl-fontawesome-markers' {
  import { Marker } from 'mapbox-gl';

  export default class FontawesomeMarker extends Marker {
    constructor(options: { icon?: string; iconColor?: string; color?: string, className?: string });
  }
}
