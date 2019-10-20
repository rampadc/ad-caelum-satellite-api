var satellite = require('satellite.js');
var satelliteData;

function calculateSatelliteLocations() {
  satelliteData.find({}, {
    projection: {_id: 1, name: 1, lines: 1}
  }).toArray(function (err, tles) {
    if (err) {
      console.error(err);
    }
    if (tles) {
      for (let i = 0; i < tles.length; i++) {
        let satrec = satellite.twoline2satrec(tles[i].lines[0], tles[i].lines[1]);
        let positionAndVelocity = satellite.propagate(satrec, new Date());
        let positionEci = positionAndVelocity.position;
        
        let gmst = satellite.gstime(new Date());
        let positionGd = satellite.eciToGeodetic(positionEci, gmst);
        let longitude = satellite.radiansToDegrees(positionGd.longitude);
        let latitude = satellite.radiansToDegrees(positionGd.latitude);
        // let height = positionGd.height;

        satelliteData.updateOne({_id: tles[i]._id}, {
          $set: {
            satlat: latitude,
            satlng: longitude
          }
        }, {upsert: true});
      }
    }
  });

}

function refreshPositions() {
  let intv = setInterval(() => {
    if (global.collection != null) {
      clearInterval(intv);
  
      satelliteData = global.collection;

      let updateIntv = setInterval(() => {
        calculateSatelliteLocations();
      }, 5000);
      
    }
  }, 500);
}
module.exports = refreshPositions;