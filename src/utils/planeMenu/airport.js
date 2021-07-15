import mapboxgl from 'mapbox-gl'
import api from '@/api/index.js';
import path from '@/api/path.js';
import Mapbox from '../map'
import state from '@/store/state'
export default{
    //添加航班
    addIconByairport(data,id) {
        let _this = this;
        if (Mapbox.map.hasImage('myairport')){
            if( Mapbox.map.getSource(id)){
                Mapbox.map.getSource(id).setData(data);
            }else{
                Mapbox.map.addLayer({
                    "id": id,
                    "source": {
                    "type": "geojson",
                    "data": data
                    },
                    "type": "symbol",
                    "paint": {
                    "icon-opacity": 1,
    
    
                    },
                    "layout": {
                    "icon-size": 0.5,
                    "icon-allow-overlap": true,
                    "icon-image":{
                        "type": "identity",
                        "property": "airportIcon"
                    },
                    }
                });
            }
          
        }
    },
    //在地图上显示航班
    addAirportDetails(lng,lat,pro,id) {
        let point = turf.point([lng, lat],pro);
        let geojson = turf.featureCollection([point]);
        //this.addIconByairport(geojson, id);
        Mapbox.map.setCenter([lng, lat])
        Mapbox.map.setZoom(9)
    },
    addAllIconByairport(data, id, vue) {
        let _this = this;
        this.addIconByairport(data,id)
        var fn = function (e) {
          if (e.type == "touchstart" && event.touches.length < 2) {
           _this.showInformation(e)
          } else if (e.type == "click") {
            _this.showInformation(e)
          }
        }
        Mapbox.map.on('click', id, fn)
        Mapbox.map.on('touchstart', id, fn)
    },
    showInformation(e){
        var features = e.features;
        console.log(features[0].properties);
        state.searchShow = true;
        state.airportInformation_show = true;
        state.airportInformation_by = 0;
        state.search.select_airport =features[0].properties.name;
    }
    
}