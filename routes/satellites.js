var express = require('express');
var router = express.Router();
var satellite = require('satellite.js');

var cors = require('cors');

const request = require("request-promise");

const n2yoApiKey = 'HDZLMD-8VNLCL-BWBRLX-47UL';
const nasa_norads = [42775,43600,41785,36798,43152,28890,41787,40014,29108,28649,29710,32783,36795,41599,41948,43111,40336,42769,41899,33434,37930,43690,29107,36744,27640,29047,29048,29050,29051,29052,31598,32376,37216,36508,41887,41886,41891,41885,41884,41889,41890,41888,39766,35681,40013,43678,25757,40715,40716,40717,24753,25991,28054,35951,41617,41612,41608,41614,41609,41618,41611,41616,41606,41615,41613,41610,42995,42998,42996,42997,41967,41962,41957,41955,41966,41950,41959,41958,41956,41964,41961,41963,41960,41968,41953,41965,41971,41952,41969,41970,41951,39419,44047,37344,41105,38010,38008,38007,38009,25994,28376,27424,40932,33463,38049,43491,37214,39260,41882,42920,43585,40118,41727,41194,40701,40894,43259,43260,43262,43461,43484,43065,41579,33331,43823,41602,38337,29155,35491,36411,41866,43226,43672,39574,43476,43477,33492,43609,37781,43655,40267,41836,33320,33321,38997,40299,40015,43719,43613,43114,39216,41752,28051,33105,41240,43946,41914,43022,43023,43024,43943,37839,27525,42825,43180,43181,43876,43877,39731,40010,43676,29268,38338,40536,39227,43118,43767,25682,39084,41603,29709,40933,40934,40932,40935,42838,41873,43125,43697,43882,43889,43126,42842,42840,42837,43885,43182,43184,42774,42780,42773,42779,43123,42782,42839,43887,42841,43124,43884,42781,43888,42771,41872,43185,43883,43183,41874,41871,42772,42845,43886,43695,43944,43034,43080,43146,40958,43485,37838,40069,38552,40732,27509,28912,29499,38771,43689,43128,43015,43717,28937,37789,25338,28654,33591,43013,43619,37849,41557,41558,43195,43204,40059,26702,39650,43440,43530,43215,41770,43132,38012,39019,44072,26958,43529,40301,32382,33314,33312,33315,33316,33313,37791,37387,41877,39186,40360,41386,38248,34807,39769,43641,39086,31118,41790,22491,25504,27858,43437,39634,41456,40697,42063,41335,42969,43175,36596,28220,33433,39455,28893,39418,42990,42989,42988,42987,40072,41601,41771,41772,41773,41774,42992,42991,40376,36036,39768,33496,41900,41901,38755,40053,37841,38011,43618,41907,41908,43099,43100,39452,39451,39453,36605,41898,33396,36985,38256,40988,35683,39767,42901,39160,38782,42954,39423,42835,32060,35946,40115,43944,37389,36834,37165,37875,37941,38257,38354,39011,39012,39013,39239,39240,39241,39363,40109,40110,40111,40143,40275,40305,40310,40338,40339,40340,40362,40878,41026,41038,41473,43277,33446,34839,36110,36121,36413,36414,36415,43275,43276,41857,43909,43910,43911,43912,43913,43915,28470,43194,43439,43441,43442,43443,52761,52759,43440,38038,38046,41556];

router.get('/above/:lat/:lng/:searchRadius', cors(), (req, res) => {
  const lat = parseFloat(req.params.lat);
  const lng = parseFloat(req.params.lng);
  const searchRadius = parseFloat(req.params.searchRadius);

  const satelliteDataCollection = global.collection;

  let cursor = satelliteDataCollection.find({
    satlat: {
      $gte: lat - searchRadius,
      $lte: lat + searchRadius
    },
    satlng: {
      $gte: lng - searchRadius,
      $lte: lng + searchRadius
    }
  });
  cursor.toArray((err, result) => {
    if (err) {
      console.error(err);
    }
    res.send(result);
  });
});

/* GET users listing. */
// router.get('/above/:lat/:lng/:searchRadius', cors(), (req, res) => {
//   const lat = req.params.lat;
//   const lng = req.params.lng;
//   const searchRadius = req.params.searchRadius;
//   const altitude = 0;
//   const satelliteDataCollection = global.collection;

//   // category = space + earth science
//   request(`https://www.n2yo.com/rest/v1/satellite/above/${lat}/${lng}/${altitude}/${searchRadius}/26/&apiKey=${n2yoApiKey}`, { json: true }).then(result => {

//     const above = result['above'];
//     let nasaSatellites = above.filter(el => {
//       for (let i = 0; i < nasa_norads.length; i++) {
//           if (el.satid == nasa_norads[i]) {
//               return true;
//           }
//       }
//       return false;
//     });

//     let totalToReturn = nasaSatellites.length;
//     let satellitesWithTLEs = [];
//     for (let i = 0; i < nasaSatellites.length; i++) {
//       let s = nasaSatellites[i];
//       satelliteDataCollection.findOne({
//         satelliteId: s['satid']
//       }, function(err, doc) {
//         if (err) {
//           console.log(err);
//         }
//         if (doc) {
//           // merge `doc` with `s`
//           s = Object.assign(s, doc);

//           satellitesWithTLEs.push(s);
//         } else {
//           // FIXME: no results - skip empty results - do not return this satellite even know it might be above us.
//           totalToReturn -= 1;
//         }

//         if (satellitesWithTLEs.length >= totalToReturn) {
//           res.send(satellitesWithTLEs);
//         }
//       });
//     }
//   });

// })
module.exports = router;
