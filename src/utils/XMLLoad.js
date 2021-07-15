	//将字符串转化成dom对象;string转换为xml
	function stringToXml(xmlString) {
	  var xmlDoc;
	  if (typeof xmlString == "string") {
	    //FF
	    if (document.implementation.createDocument) {
	      var parser = new DOMParser();
	      xmlDoc = parser.parseFromString(xmlString, "text/xml");
	    } else if (window.ActiveXObject) {
	      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	      xmlDoc.async = false;
	      xmlDoc.loadXML(xmlString);
	    }
	  } else {
	    xmlDoc = xmlString;
	  }
	  return xmlDoc;
	}

	function getWFSData(url, callback) {
	  var xhr = new XMLHttpRequest();
	  xhr.open("GET", url, true);
	  xhr.onload = function () {
	    if (xhr.status == 200) {
	      if (xhr.response) {
	        callback(xhr.response);
	      } else {
	        callback(xhr.statusText);
	      }
	    } else {
	      callback(xhr.statusText);
	    }
	  };
	  xhr.onerror = function () {
	    callback(xhr.statusText);
	  };
	  xhr.send(null);
	}
	export function addLineByWFS(url, map, id) {
	  getWFSData(url, function (res) {
	    //console.log(res)
	    let xml = stringToXml(res);
	    let lines = xml.getElementsByTagName("gml:LineString");
	    let lineStrings = []
	    for (let i = 0; i < lines.length; i++) {
	      let _nodeString = lines[i].childNodes[0].firstChild.nodeValue;
	      let _lineCoordinates = _nodeString.split(" ");
	      let points = [];
	      for (let j = 0; j < _lineCoordinates.length; j++) {
	        let _point = _lineCoordinates[j].split(",");
	        _point[0] = Number(_point[0]);
	        _point[1] = Number(_point[1]);
	        points.push(_point);
	      }
	      let _line = turf.lineString(points, {
	        valueColor: "#0000ff"
	      });
	      lineStrings.push(_line);
	    }
	    let geojson = turf.featureCollection(lineStrings)
	    // console.log(geojson);

	    map.addWFSLineLayer(geojson, id);

	  })
	}
