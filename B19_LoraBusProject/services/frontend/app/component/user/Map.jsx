"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker,InfoWindow,Polyline } from '@react-google-maps/api';
<div className="w-full h-full"></div>
const mapContainerStyle = {
  
  width: '100%',
  height: '100%',
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 10, 
};

const center = {
  lat: 14.036821455947925,
  lng: 100.72790101019959,
};



  const bounds = {
  north: center.lat + 0.009,
  south: center.lat - 0.013,
  east: center.lng + 0.009,
  west: center.lng - 0.011,
};

const rectangleBounds = {
  north: 14.0424,
  south: 14.0276,
  east: 100.733,
  west: 100.720,
};

const pathCoordinates = [
  { lat: 14.036058173285717, lng: 100.73149667663105 },
  { lat: 14.03628976247286, lng: 100.73149131221311 },
  { lat: 14.03652849997334, lng: 100.73149303563393 },
  { lat: 14.036771798220611, lng: 100.73149169452945 },
  { lat:14.036958184835976 , lng:100.73149021395172  }, 
  { lat:14.037033646213144 , lng:100.73149423726532  },
  { lat:14.037122118137924 , lng:100.73150094278778  },
  { lat:14.037195093938262 , lng:100.73150547936218  },
  { lat:14.037278361574455 , lng:100.73151218488462  },
  { lat:14.037375940801516 , lng:100.73151956095982  },
  { lat:14.037446197816106 , lng:100.73152425482554  },
  { lat:14.037559389627653 , lng:100.73153028979571  },
  { lat:14.037642657135338 , lng:100.73153632476583  },
  { lat:14.0377285267201 ,   lng:100.7315403480795  },
  { lat:14.03782805733127 ,  lng:100.73154370084073  },
  { lat:14.037934093163603 , lng:100.73154638304968  },
  { lat:14.038038827899536 , lng:100.731545041945  },
  { lat:14.038141611006354 , lng:100.73154705360207  },
  { lat:14.038256216994975 , lng:100.73154962287221  },
  { lat:14.038372010507743 , lng:100.73155163452934  },
  { lat:14.038462433490613 , lng:100.7315509639771  },
  { lat:14.038572319933644 , lng:100.73155291420113  },
  { lat:14.038675102799962 , lng:100.73155023199223  },
  { lat:14.038766826711576 , lng:100.73154889088826  },
  { lat:14.038973693276754 , lng:100.73154553812684  },
  { lat:14.039172753379654 , lng:100.73154218536571  },
  { lat:14.039358152334483 , lng:100.73153682094778  },
  { lat:14.039559163668867 , lng:100.73153547984273  },
  { lat:14.039709434158777 , lng:100.73153346818602  },
  { lat:14.039756922215169 , lng:100.73153145652928  },
  { lat:14.039761475864198 , lng:100.73146037799191  },
  { lat:14.03976271806698 ,  lng:100.73133680743318  },
  { lat:14.03976490615088 ,  lng:100.7312398226571  },
  { lat:14.03976490615088 ,  lng:100.7311293051216  },
  { lat:14.039766000192813 , lng:100.7310007439068  },
  { lat:14.039768188279146 , lng:100.73087443815321  },
  { lat:14.039766000194314 , lng:100.73072332233059  },
  { lat:14.039766000194314 , lng:100.7305733342467  },
  { lat:14.039763812110438 , lng:100.73046394444113  },
  { lat:14.039710204048781 , lng:100.73036808739501  },
  { lat:14.039619398527952 , lng:100.73033989414616  },
  { lat:14.039521733050128 , lng:100.73033737879219  },
  { lat:14.03941133579275 ,  lng:100.7303326372718  },
  { lat:14.0393062361994 ,   lng:100.73032996959674  },
  { lat:14.039206055707448 , lng:100.73032795794002  },
  { lat:14.039089876769681 , lng:100.73032467404697  },
  { lat:14.038984491995635 , lng:100.73032333294248  },
  { lat:14.038867398044143 , lng:100.730322640141451  },
  { lat:14.03872210432596 ,  lng:100.73032367403542  },
  { lat:14.038610864662282 , lng:100.73032233293092  },
  { lat:14.038493770217434 , lng:100.73032233293064  },
  { lat:14.038370820986563 , lng:100.73032166237813  },
  { lat:14.038235511705523 , lng:100.73032099182582  },
  { lat:14.038109309709702 , lng:100.7303189801691  },
  { lat:14.03799546763879 ,  lng:100.73031965072121  },
  { lat:14.037860808664657 , lng:100.73031898016897  },
  { lat:14.037859090806247 , lng:100.73005742667918  },
  { lat:14.037857139226025 , lng:100.72984419106315  },
  { lat:14.03785778975219 ,  lng:100.72960748611685  },
  { lat:14.037856488698601 , lng:100.72939357994694  },
  { lat:14.037859090805219 , lng:100.72911395965824  },
  { lat:14.037857139225808 , lng:100.72885982035352  },
  { lat:14.03785844028025 ,  lng:100.72864457307898  },
  { lat:14.037857789753614 , lng:100.72851381539165  },
  { lat:14.037859090806895 , lng:100.72837568162966  },
  { lat:14.038037572495025 , lng:100.72837613055717  },
  { lat:14.038178369527733 , lng:100.72837692798267  },
  { lat:14.038329997009798 , lng:100.72837772540765  },
  { lat:14.03847698273352 ,  lng:100.72837852283315  },
  { lat:14.038626289193898 , lng:100.72837932025817  },
  { lat:14.038794162137865 , lng:100.72838250996016  },
  { lat:14.038972091857293 , lng:100.7283817125341  },
  { lat:14.039042594981247 , lng:100.72838338064653  },
  { lat:14.039044546551086 , lng:100.72830358492965  },
  { lat:14.039041659389623 , lng:100.72810435654544  },
  { lat:14.039041659389623 , lng:100.72793406932236  },
  { lat:14.03904056534423 ,  lng:100.72780550810758  },
  { lat:14.039044065166134 , lng:100.72767177900943  },
  { lat:14.039042113597016 , lng:100.72743976792805  },
  { lat:14.039042764120305 , lng:100.72725268385234  },
  { lat:14.039040812550462 , lng:100.72703140160782  },
  { lat:14.039037898620068 , lng:100.72658574401488  },
  { lat:14.039043922354 ,    lng:100.72625268671852  },
  { lat:14.039040319792154 , lng:100.7259172220144  },
  { lat:14.039037067175224 , lng:100.72557859312643  },
  { lat:14.039034465082258 , lng:100.72529494952235  },
  { lat:14.039035115605573 , lng:100.72513736974531  },
  { lat:14.038876387863096 , lng:100.7251393814015  },
  { lat:14.03875213779007 ,  lng:100.72514005195308  },
  { lat:14.038609022439056 , lng:100.72513871084819  },
  { lat:14.038488675368642 , lng:100.72513871084786  },
  { lat:14.038359149950155 , lng:100.72513881591445  },
  { lat:14.038224854271267 , lng:100.7251380066059  },
  { lat:14.038101904899372 , lng:100.72513867715816  },
  { lat:14.037983710943147,  lng:100.72513873231533  },
  { lat:14.037828235107739 , lng:100.72513739121084  },
  { lat:14.037827584579945 , lng:100.72496774148931  },
  { lat:14.037827584579945 , lng:100.72480546784656  },
  { lat:14.037826283526433 , lng:100.72463179481134  },
  { lat:14.037826934053438 , lng:100.72447622668719  },
  { lat:14.037827584580034 , lng:100.72431931745915  },
  { lat:14.037823681419628 , lng:100.72418587756287  },
  { lat:14.037817826678868 , lng:100.72407389533834  },
  { lat:14.037804816142721 , lng:100.72397398305023  },
  { lat:14.037774241380687 , lng:100.72389955174906  },
  { lat:14.037726752912299 , lng:100.7238251204489  },
  { lat:14.037661049672609 , lng:100.72376208853726  },
  { lat:14.03758688955943 ,  lng:100.72372051429821  },
  { lat:14.037504923087203 , lng:100.72369033944608  },
  { lat:14.037442472424635 , lng:100.72368028116244  },
  { lat:14.037349446922937 , lng:100.72368028116279  },
  { lat: 14.037246012929025, lng: 100.72368028116256 },
  { lat: 14.037132820962686, lng: 100.72368028116256 },
  { lat: 14.037028105681532, lng: 100.72368213229325 },
  { lat: 14.036922719959296, lng: 100.72368816726343 },
  { lat: 14.036810828892534, lng: 100.72368883781567 },
  { lat: 14.036702840946218, lng: 100.72369017892004 },
  { lat: 14.036570132803455, lng: 100.72369152002452 },
  { lat: 14.036424413965298, lng: 100.72369487278517 },
  { lat: 14.036302764689566, lng: 100.72369554333743 },
  { lat: 14.036184368001136, lng: 100.7236962138896 },
  { lat: 14.036064019656733, lng: 100.72369688444121 },
  { lat: 14.035967740939487, lng: 100.72369554333675 },
  { lat: 14.035891611773083, lng: 100.72369585069502 },
  { lat: 14.035809608297924, lng: 100.72369425584401 },
  { lat: 14.035716774139706, lng: 100.72369266099302 },
  { lat: 14.035613882903759, lng: 100.72369345841852 },
  { lat: 14.035611562048263, lng: 100.72369266099302 },
  { lat: 14.03552878485415,  lng: 100.72369266099302 },
  { lat: 14.035456064670678, lng: 100.72369345841777 },
  { lat: 14.03537096656248,  lng: 100.72369106614126 },
  { lat: 14.03528818927668,  lng: 100.72369026871549 },
  { lat: 14.035152805808714, lng: 100.72369106614099 },
  { lat: 14.034999833558869, lng: 100.72369099561784 },
  { lat: 14.034842788531034, lng: 100.72369099561784 },
  { lat: 14.034695800476463, lng: 100.72369179304336 },
  { lat: 14.034574234490224, lng: 100.7236900073165 },
  { lat: 14.034429567127667, lng: 100.72368841246629 },
  { lat: 14.034298051267237, lng: 100.72368841246629 },
  { lat: 14.03418432866605,  lng: 100.72368681761539 },
  { lat: 14.03402805669984,  lng: 100.7236820330619 },
  { lat: 14.033929032826714, lng: 100.7236812356364 },
  { lat: 14.03392671195337,  lng: 100.72351138400253 },
  { lat: 14.033920721831791, lng: 100.72334197883667 },
  { lat: 14.03391336183641,  lng: 100.72316938749488 },
  { lat: 14.033911521837524, lng: 100.72302903849165 },
  { lat: 14.0339078418336,   lng: 100.72288679287246 },
  { lat: 14.0339078418336,   lng: 100.72273885743662 },
  { lat: 14.033905249807521, lng: 100.7226123244488 },
  { lat: 14.03390403489147,  lng: 100.72257294068893 },
  { lat: 14.03380346371559,  lng: 100.72256975098695 },
  { lat: 14.033728422117136, lng: 100.72257054841243 },
  { lat: 14.033594720774138, lng: 100.72257139778338 },
  { lat: 14.033396672610738, lng: 100.72257299263437 },
  { lat: 14.033154527548144, lng: 100.72257219520776 },
  { lat: 14.03297890858291,  lng: 100.72257205209961 },
  { lat: 14.032844297378851, lng: 100.72257205209961 },
  { lat: 14.032792464307933, lng: 100.72268050196735 },
  { lat: 14.032754556532241, lng: 100.72272834749721 },
  { lat: 14.032655532105329, lng: 100.72280809005015 },
  { lat: 14.03258358464599,  lng: 100.72284716389956 } , 
  { lat: 14.032513484331627, lng: 100.72287230000727 },
  { lat: 14.032562784476148, lng: 100.72285799945368 },
  { lat: 14.03262848917575,  lng: 100.72282648349723 },
  { lat: 14.032690290608686, lng: 100.72278759146585 },
  { lat: 14.03276835555278,  lng: 100.72271383071669 },
  { lat: 14.03282181591898,  lng: 100.72262724361623 },
  { lat: 14.032862799994433, lng: 100.72256890556913 },
  { lat: 14.033229338669086, lng: 100.72257085049502 },
  { lat: 14.033416694049702, lng: 100.72257219159954 },
  { lat: 14.033633696523161, lng: 100.72257342597823 },
  { lat: 14.033801535435856, lng: 100.7225734259781 },
  { lat: 14.033908223668947, lng: 100.72257208487356 },
  { lat: 14.033912470940207, lng: 100.72294524329092 },
  { lat: 14.033924372787393, lng: 100.72341105697785 },
  { lat: 14.033932179241832, lng: 100.72368397174593 },
  { lat: 14.033931235751735, lng: 100.72418602164534 },
  { lat: 14.033929284139198, lng: 100.72452733274433 },
  { lat: 14.033937741130385, lng: 100.72467686589945 },
  { lat: 14.033969107192657, lng: 100.72475926854341 },
  { lat: 14.034010741600556, lng: 100.72481827714276 },
  { lat: 14.034064604046307, lng: 100.7248591917701 },
  { lat: 14.034120550256862, lng: 100.7248819905471 },
  { lat: 14.034198674731535, lng: 100.72489595289001 },
  { lat: 14.034439373309299, lng: 100.72489394123302 },
  { lat: 14.034792109165616, lng: 100.72489056263053 },
  { lat: 14.03511561247429,  lng: 100.72489366705213 },
  { lat: 14.03541414490027,  lng: 100.72489698268815 },
  { lat: 14.035690957125743, lng: 100.72490297553502 },
  { lat: 14.035774875841023, lng: 100.72490699884861 },
  { lat: 14.035782057354288, lng: 100.72517527397268 },
  { lat: 14.03578862482904,  lng: 100.72540950729154 },
  { lat: 14.03580133110951,  lng: 100.72569279369432 },
  { lat: 14.03581548693634,  lng: 100.72601108666969 },
  { lat: 14.035823943857935, lng: 100.72613715049553 },
  { lat: 14.035881190704993, lng: 100.72618677136165 },
  { lat: 14.035921523701287, lng: 100.7262397449906 },
  { lat: 14.035961206159904, lng: 100.72631149408082 },
  { lat: 14.035969292932503, lng: 100.72658469650723 },
  { lat: 14.035983641526645, lng: 100.72767856036441 },
  { lat: 14.035987575643583, lng: 100.72916666509232 },
  { lat: 14.035995549258699, lng: 100.73025579604142 },
  { lat: 14.036008054065814, lng: 100.7311402593091 },
  { lat: 14.036011432768147, lng: 100.7314932227475 }
];
const options = {
  strokeColor: '#FF0000',  // สีแดง
  strokeOpacity: 1.0,      // ความโปร่งใสของเส้น (0 - 1)
  strokeWeight: 5          // ความหนาของเส้น
};

// สไตล์สำหรับธีมสว่างและมืด
const lightTheme = [
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d4e4ff' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
];

const darkTheme = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ];


const Map = ({ storedResults }) => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loRaMarker, setLoRaMarker] = useState(null);
  const [loraMarkers, setLoraMarkers] = useState({});
  const [userPosition, setUserPosition] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [bus, setBus] = useState([]);
  const [lora,setLora] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedLoRa, setSelectedLoRa] = useState(null);
  const [showRoute, setShowRoute] = useState(false);
  const [gpsError, setGpsError] = useState(false); // ใช้เพื่อตรวจสอบว่ามีข้อผิดพลาดในการเข้าถึง GPS หรือไม่
  const [buttonText, setButtonText] = useState('You Location'); // ข้อความบนปุ่ม
 
  const markerIcons = {
    light: '/images/Bus stop.png',
    dark: '/images/BusStopDark.png',
  };

  const loraIcons = {
    light: '/images/BusPin.png',
    dark: '/images/BusPinDark.png',
  };

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const targetLocation = {
    lat: 14.036738188138683,   
    lng: 100.72792246695249,
  };
  
  const handleGoToLocation = () => {
    if (map) {
      map.panTo(targetLocation);
      map.setZoom(18);
    }
  };

  let watchId; // เก็บค่าของ watchId เพื่อยกเลิกการติดตามตำแหน่งภายหลัง

  const handleGoToUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition({ lat: latitude, lng: longitude });
          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
            map.setZoom(18);
          }
        },
        (error) => {
          console.error('Error getting location', error);
          if (error.code === 1) {
            // Error code 1 คือ Permission denied
            setGpsError(true);
            setButtonText('Please allow GPS');
            setTimeout(() => {
              setGpsError(false);
              setButtonText('You Location');
              // แจ้งผู้ใช้ว่าต้องอนุญาตสิทธิ์ในการเข้าถึง GPS ผ่าน pop-up อีกครั้ง
              alert("Please allow GPS from your browser settings.");
              // ลองขอสิทธิ์อีกครั้ง (จะขึ้นกับบราวเซอร์ว่าจะแสดง pop-up ขึ้นมาอีกหรือไม่)
            }, 3000);
          } else if (error.code === 3) {
            // Error code 3 คือ Timeout expired
            setGpsError(true);
            setButtonText('Request timed out, try again');
            setTimeout(() => {
              setGpsError(false);
              setButtonText('You Location');
            }, 3000);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: Infinity,
          maximumAge: 0,
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };
  

  
  
  
  

  useEffect(() => {
    if (map && window.google) {
      // const { latitude, longitude, title } = storedResults; // ดึงค่า latitude, longitude, และ title จาก storedResults
    

      if (!storedResults.buses || storedResults.buses.length === 0) {
      console.log("From Map",storedResults)
      const lat = parseFloat(storedResults.busStops.BusStop_Latitude)
      const lng = parseFloat(storedResults.busStops.BusStop_Longitude)
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // ใช้ panTo เมื่อ lat และ lng เป็นตัวเลข
        map.panTo({ lat: lat, lng: lng });
        map.setZoom(18); // ตั้งค่า zoom
        console.log("Pan to lat: ", lat, " lng: ", lng);
      } else {
        console.log("Nan on LAT or LNG")
      }
      console.log("From Map",lat)
      console.log("From Map",lng)
    } else{
      
      const busid = storedResults.buses.Dip_Switch_Value
      const matchedItem = lora.find(item => item.Dip_Switch_Value === busid);

      const dip_id = matchedItem?.Dip_Switch_Value ?? null ;
      if(busid == null && dip_id == null){
        alert("LoRa is not Setting")
      }


      console.log("FromBus : ",busid, "From Lora",dip_id)
      console.log("From Match",matchedItem)
      
      if(busid === dip_id && busid !== null && dip_id !== null){
        // const findlat = lora.find(item => item.LoRa_Latitude&&item.LoRa_Longitude != null)
        
        const lat = parseFloat(matchedItem.LoRa_Latitude)
        const lng = parseFloat(matchedItem.LoRa_Longitude)
        if (!isNaN(lat) && !isNaN(lng)) {
          // ใช้ panTo เมื่อ lat และ lng เป็นตัวเลข
          map.panTo({ lat: lat, lng: lng });
          map.setZoom(18); // ตั้งค่า zoom
          console.log("Pan to lat: ", lat, " lng: ", lng);
        } else {
          console.log("Nan on LAT or LNG")
        }
        
        
      }else { console.log("ไม่มี Bus นี้ที่เชื่อม กับ Lora")}
      
    }
    }
  }, [storedResults]);

  const trackUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log({ latitude, longitude });

          setUserPosition({ lat: latitude, lng: longitude });

          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
            map.setZoom(18);
          }
        },
        (error) => console.error('Error getting location', error),
        {
          enableHighAccuracy: true,
          timeout: 1000,
          maximumAge: 2000,
        }
      );

      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition({ lat: latitude, lng: longitude });

          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
          }
        },
        (error) => console.error('Error tracking location', error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    trackUserLocation();
  }, []);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('https://service.lora-bus.com/web_api/getBusStop'); // เรียก API จาก backend
        const data = await response.json();
        if (data.success) {
          setMarkers(data.data || []); // ตั้งค่า markers ใหม่จาก API
         
        }
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };
    
    fetchMarkers();
  }, []);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const response = await fetch('https://service.lora-bus.com/admin_api/getLoRa'); // เรียก API จาก backend
        const data = await response.json();
        if (data.success) {
          setBus(data.data || []); // ตั้งค่า markers ใหม่จาก API
         
        }
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };
    
    fetchBus();

    // const interval = setInterval(fetchBus, 100);

    // // เคลียร์ interval เมื่อ component unmount
    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLora = async () => {
      try {
        const response = await fetch('https://service.lora-bus.com/admin_api/getLoRaLast'); // เรียก API จาก backend
        const data = await response.json();
        if (data.success) {
          setLora(data.data || []); // ตั้งค่า markers ใหม่จาก API
          
        }
      } catch (error) {
        console.error('Error fetching markers:', error);
      }
    };
    
    fetchLora();

    const interval = setInterval(fetchLora, 600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (map && window.google) {
      const filteredLoRa = lora.reduce((acc, current) => {
        const found = acc.find(item => item.Dip_Switch_Value === current.Dip_Switch_Value);
        if (!found) {
          acc.push(current);  // ถ้าไม่มีค่าซ้ำ ให้เก็บใน acc
        }
        return acc;
      }, []).slice(0, 99);  // เลือกข้อมูลไม่ซ้ำแค่ 99 อัน
  
      filteredLoRa.forEach(loRa => {
        const latitude = parseFloat(loRa.LoRa_Latitude);
        const longitude = parseFloat(loRa.LoRa_Longitude);
  
        // เช็คเวลาว่าผ่านไปเกิน 5 นาทีหรือยัง
        const updateTime = new Date(loRa.Update_Time); // เวลาที่ได้รับจาก API
        const currentTime = new Date(); // เวลาปัจจุบัน
        const timeDiff = (currentTime - updateTime) / 1000 / 60; // เปลี่ยนเวลาต่างให้เป็นนาที
  
        if (timeDiff > 5) {
          // console.log(`LoRa marker ${loRa.Dip_Switch_Value} has exceeded 5 minutes, setting marker to null.`);
          
          // ซ่อน marker หากเวลาผ่านไปเกิน 5 นาที
          if (loraMarkers[loRa.Dip_Switch_Value]) {
            loraMarkers[loRa.Dip_Switch_Value].setMap(null);
            const updatedMarkers = { ...loraMarkers };
            delete updatedMarkers[loRa.Dip_Switch_Value]; // ลบ marker ที่เก่าจาก state
            setLoraMarkers(updatedMarkers);
          }
          return;
        }
  
        if (!isNaN(latitude) && !isNaN(longitude) && map) {
          // ถ้า marker นี้มีอยู่แล้ว ให้แค่เปลี่ยนตำแหน่ง
          if (loraMarkers[loRa.Dip_Switch_Value]) {
            loraMarkers[loRa.Dip_Switch_Value].setPosition({ lat: latitude, lng: longitude });
            if (selectedLoRa && selectedLoRa.Dip_Switch_Value === loRa.Dip_Switch_Value) {
              setSelectedLoRa({
                ...loRa,
                position: { lat: latitude, lng: longitude } // อัปเดตตำแหน่งของ selectedLoRa
              });
            } 
          } else {
            // ถ้า marker นี้ยังไม่มี ให้สร้างใหม่
            const newMarker = new window.google.maps.Marker({
              position: { lat: latitude, lng: longitude },
              map: map,
              title: loRa.Dip_Switch_Value.toString(),
              icon: {
                url: isDarkTheme ? loraIcons.dark : loraIcons.light,
                scaledSize: new window.google.maps.Size(50, 50),
              },
            });
  
            newMarker.addListener("click", () => {
              setSelectedLoRa({
                ...loRa,
                position: { lat: latitude, lng: longitude } // อัปเดตตำแหน่งของ selectedLoRa
              });
            });
  
            // เก็บ marker ใหม่ไว้ใน state
            setLoraMarkers(prevMarkers => ({
              ...prevMarkers,
              [loRa.Dip_Switch_Value]: newMarker,
              
            }));
            
            
          }
          
        } else {
          console.error('Invalid latitude or longitude:', loRa.LoRa_Latitude, loRa.LoRa_Longitude);
        }
      });
    }
  }, [map, lora, isDarkTheme, loraIcons, loraMarkers]);

  // useEffect(() => {
    
  //   if (map && window.google) {  // ตรวจสอบว่า window.google มีอยู่
  //     // กรองค่า Dip_Switch_Value ที่ไม่ซ้ำกัน

  //     const filteredLoRa = lora.reduce((acc, current) => {
  //       const found = acc.find(item => item.Dip_Switch_Value === current.Dip_Switch_Value);
  //       if (!found) {
  //         acc.push(current);  // ถ้าไม่มีค่าซ้ำ ให้เก็บใน acc
  //       }
  //       return acc;
  //     }, []).slice(0, 99);  // เลือกข้อมูลไม่ซ้ำแค่ 5 อัน
      
  //     // สมมติว่าเราจะใช้ marker ตัวแรกจาก filteredLoRa
  //     if (filteredLoRa.length > 0) {
  //       const loRa = filteredLoRa[1]; // เลือกตัวแรกจาก filteredLoRa
  //       const latitude = parseFloat(loRa.LoRa_Latitude);
  //       const longitude = parseFloat(loRa.LoRa_Longitude);
        
  //       if (!isNaN(latitude) && !isNaN(longitude)) {
  //         if (!loRaMarker1) {
  //           // สร้าง marker ใหม่ครั้งแรก
  //           const newMarker = new window.google.maps.Marker({
  //             position: { lat: latitude, lng: longitude },
  //             map: map,
  //             title: loRa.Dip_Switch_Value.toString(),
  //             icon: {
  //               url: isDarkTheme ? loraIcons.dark : loraIcons.light,
  //               scaledSize: new window.google.maps.Size(40, 40), // ขนาดของไอคอน
  //             },
  //           });
  //           setLoRaMarker1(newMarker);  // เก็บ marker ใน state
  //           newMarker.addListener("click", () => {
  //             setSelectedLoRa(loRa); // Set selected LoRa for InfoWindow
              
  //           });
  //         } else  {
  //           // อัปเดตตำแหน่งของ marker เดิม
            
  //           loRaMarker1.setPosition({ lat: latitude, lng: longitude });
  //           loRaMarker1.addListener("click", () => {
  //             setSelectedLoRa(loRa); // Set selected LoRa for InfoWindow
              
  //           });
  //         }
  //       } else {
  //         console.error('Invalid latitude or longitude:', loRa.LoRa_Latitude, loRa.LoRa_Longitude);
  //       }
  //     }
  //   }
   
  // }, [map, loraIcons, lora, loRaMarker1]);  

  // useEffect(() => {
    
  //   if (map && window.google) {  // ตรวจสอบว่า window.google มีอยู่
  //     // กรองค่า Dip_Switch_Value ที่ไม่ซ้ำกัน

  //     const filteredLoRa = lora.reduce((acc, current) => {
  //       const found = acc.find(item => item.Dip_Switch_Value === current.Dip_Switch_Value);
  //       if (!found) {
  //         acc.push(current);  // ถ้าไม่มีค่าซ้ำ ให้เก็บใน acc
  //       }
  //       return acc;
  //     }, []).slice(0, 99);  // เลือกข้อมูลไม่ซ้ำแค่ 5 อัน
      
  //     // สมมติว่าเราจะใช้ marker ตัวแรกจาก filteredLoRa
  //     if (filteredLoRa.length > 0) {
  //       const loRa = filteredLoRa[8]; // เลือกตัวแรกจาก filteredLoRa
  //       const latitude = parseFloat(loRa.LoRa_Latitude);
  //       const longitude = parseFloat(loRa.LoRa_Longitude);
        
  //       if (!isNaN(latitude) && !isNaN(longitude)) {
  //         if (!loRaMarker) {
  //           // สร้าง marker ใหม่ครั้งแรก
  //           const newMarker = new window.google.maps.Marker({
  //             position: { lat: latitude, lng: longitude },
  //             map: map,
  //             title: loRa.Dip_Switch_Value.toString(),
  //             icon: {
  //               url: isDarkTheme ? loraIcons.dark : loraIcons.light,
  //               scaledSize: new window.google.maps.Size(40, 40), // ขนาดของไอคอน
  //             },
  //           });
  //           setLoRaMarker(newMarker);  // เก็บ marker ใน state
  //           newMarker.addListener("click", () => {
  //             setSelectedLoRa(loRa); // Set selected LoRa for InfoWindow
              
  //           });
  //         } else  {
  //           // อัปเดตตำแหน่งของ marker เดิม
  //           loRaMarker.setPosition({ lat: latitude, lng: longitude });
  //           loRaMarker.addListener("click", () => {
  //             setSelectedLoRa(loRa); // Set selected LoRa for InfoWindow
              
  //           });
  //         }
  //       } else {
  //         console.error('Invalid latitude or longitude:', loRa.LoRa_Latitude, loRa.LoRa_Longitude);
  //       }
  //     }
  //   }
  // }, [map, loraIcons, lora, loRaMarker]);  

  // useEffect(() => {
  //   if (map && window.google) {  // ตรวจสอบว่า window.google มีอยู่
  //     // กรองค่า Dip_Switch_Value ที่ไม่ซ้ำกัน
  //     const filteredLoRa = lora.reduce((acc, current) => {
  //       const found = acc.find(item => item.Dip_Switch_Value === current.Dip_Switch_Value);
  //       if (!found) {
  //         acc.push(current);  // ถ้าไม่มีค่าซ้ำ ให้เก็บใน acc
  //       }
  //       return acc;
  //     }, []).slice(0, 99);  // เลือกข้อมูลไม่ซ้ำแค่ 99 อัน
      
  //     // สมมติว่าเราจะใช้ marker ตัวแรกจาก filteredLoRa
  //     if (filteredLoRa.length > 0) {
  //       const loRa = filteredLoRa[0]; // เลือกตัวแรกจาก filteredLoRa
  //       const latitude = parseFloat(loRa.LoRa_Latitude);
  //       const longitude = parseFloat(loRa.LoRa_Longitude);
        
  //       if (!isNaN(latitude) && !isNaN(longitude)) {
  //         if (!loRaMarker) {
  //           // สร้าง marker ใหม่ครั้งแรก
  //           const newMarker = new window.google.maps.Marker({
  //             position: { lat: latitude, lng: longitude },
  //             map: map,
  //             title: loRa.Dip_Switch_Value.toString(),
  //             icon: {
  //               url: isDarkTheme ? loraIcons.dark : loraIcons.light,
  //               scaledSize: new window.google.maps.Size(50, 50), // ขนาดของไอคอน
  //             },
  //           });
  //           setLoRaMarker(newMarker);  // เก็บ marker ใน state
  //           newMarker.addListener("click", () => {
  //             setSelectedLoRa(loRa); // Set selected LoRa for InfoWindow
  //           });
  //           setSamePositionCount(0); // รีเซ็ตจำนวนครั้งเมื่อสร้าง marker ใหม่
  //         } else {
  //           // ตรวจสอบว่าตำแหน่งของ marker เดิมอยู่ที่ไหน
  //           const currentPosition = loRaMarker.getPosition();
  //           const isSamePosition = currentPosition.lat() === latitude && currentPosition.lng() === longitude;
  
  //           if (isSamePosition) {
  //             setSamePositionCount(prevCount => prevCount + 1); // เพิ่มจำนวนครั้งเมื่ออยู่ที่ตำแหน่งเดิม
              
  //             if (samePositionCount >= 20000) { // ถ้าตำแหน่งเดิมเกิน 20 ครั้ง
  //               loRaMarker.setMap(null); // เอา marker ออก
  //               setLoRaMarker(null); // รีเซ็ต marker ใน state
  //               return; // ออกจาก useEffect
  //             }
  //           } else {
  //             setSamePositionCount(0); // รีเซ็ตเมื่อเปลี่ยนตำแหน่ง
  //             loRaMarker.setPosition({ lat: latitude, lng: longitude }); // อัปเดตตำแหน่งของ marker
  //           }
  //         }
  //       } else {
  //         console.error('Invalid latitude or longitude:', loRa.LoRa_Latitude, loRa.LoRa_Longitude);
  //       }
  //     }
  //   }
  // }, [map, loraIcons, lora, loRaMarker, samePositionCount]);


  useEffect(() => {
    if (map && window.google) {  // ตรวจสอบว่า window.google มีอยู่
      markers.forEach(marker => {
        const latitude = parseFloat(marker.BusStop_Latitude);
      const longitude = parseFloat(marker.BusStop_Longitude);
      if (!isNaN(latitude) && !isNaN(longitude)){
        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: marker.BusStop_Name,
          icon: {
            url: isDarkTheme ? markerIcons.dark : markerIcons.light,
            scaledSize: new window.google.maps.Size(40, 40), // ขนาดของไอคอน
          },
          
        }).addListener('click', () => {
          setSelectedMarker(marker); // เมื่อคลิกที่ marker จะเก็บ marker ที่เลือก
        });
        
      } else {
        console.error('Invalid latitude or longitude:', marker.BusStop_Latitude, marker.BusStop_Longitude);
      }
    }
    );
    }
    
  }, [map,markerIcons,markers]);

  

  // ตรวจจับธีมที่เปลี่ยนไปตาม Tailwind CSS โดยใช้ MutationObserver
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkTheme(isDark);
      if (map) {
        map.setOptions({
          styles: isDark ? darkTheme : lightTheme,
        });
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [map]);

  return (
    
    <div className="relative w-full h-screen rounded-md overflow-hidden">
       <div className="absolute left-5 top-5 z-50">
        <button 
          onClick={handleGoToLocation} 
          className="p-2 bg-blue-500 text-white rounded-md shadow-md">
          RMUTT
        </button>
        <button
            onClick={handleGoToUserLocation}
            className={`p-2 text-white rounded-md shadow-md ml-2 ${gpsError ? 'bg-red-500' : 'bg-green-500'}`}>
            {buttonText}
        </button>
      </div>

        <LoadScript googleMapsApiKey="your google map api">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12.5}  
            onLoad={onLoad}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              mapTypeControl: false,
              fullscreenControl: false,
              scrollwheel: true,
              gestureHandling: "greedy", 
              styles: isDarkTheme ? darkTheme : lightTheme, // เลือก styles ตามธีม
            }}   
          >    
            {userPosition && (
              <Marker
                position={userPosition}
                title="ตำแหน่งของคุณ"
                icon={{
                  url: '/images/person.png',
                  scaledSize: window.google ? new window.google.maps.Size(40, 40) : null,
                }}
              />
            )}
            {showRoute && (
            <Polyline
             path={pathCoordinates}
             options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
              }}
                />
             )}

            {/* Rectangle สำหรับกำหนดขอบเขต */}
            

            {/* Marker สำหรับ Bus Stops */}
            {/* {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: parseFloat(marker.BusStop_Latitude), lng: parseFloat(marker.BusStop_Longitude) }}
                title={marker.BusStop_Name}
                icon={{
                  url: isDarkTheme ? markerIcons.dark : markerIcons.light,
                  scaledSize: window.google ? new window.google.maps.Size(50, 50) : null,
                }}
              />
            ))} */}

            {/* Marker สำหรับ LoRa */}
            {/* {loraMarkers.map((loRa, index) => (
              <Marker
                key={index}
                position={{ lat: parseFloat(loRa.LoRa_Latitude), lng: parseFloat(loRa.LoRa_Longitude) }}
                title={loRa.Dip_Switch_Value.toString()}
                icon={{
                  url: isDarkTheme ? loraIcons.dark : loraIcons.light,
                  scaledSize: window.google ? new window.google.maps.Size(50, 50) : null,
                }}
              />
            ))} */}
            {/* InfoWindow สำหรับแสดงข้อมูล */}
          {selectedMarker && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedMarker.BusStop_Latitude),
                lng: parseFloat(selectedMarker.BusStop_Longitude),
              }}
              onCloseClick={() => setSelectedMarker(null)} // ปิด InfoWindow เมื่อคลิกปิด
            >
              <div className="text-black">
                <h4>Name : {selectedMarker.BusStop_Name}</h4>
                <h3>Detail : {selectedMarker.Search_Details}</h3>
                
                {/* เพิ่มข้อมูลอื่น ๆ ตามต้องการ */}
              </div>
            </InfoWindow>
          )}
          
          {selectedLoRa && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedLoRa.LoRa_Latitude),
              lng: parseFloat(selectedLoRa.LoRa_Longitude),
            }}
            onCloseClick={() => setSelectedLoRa(null)}
          >
            <div className="text-black">
              <h3 className="font-bold">รถเบอร์ : {selectedLoRa.Dip_Switch_Value}</h3>
              <button
                onClick={() => setShowRoute(!showRoute)}  // สลับสถานะการแสดงเส้นทางเมื่อกดปุ่ม
                className={`p-2 text-white rounded-md mt-2 ${showRoute ? 'bg-red-500' : 'bg-blue-500'}`}
                   >
                   {showRoute ? 'ยกเลิกแสดงเส้นทาง' : 'แสดงเส้นทาง'}
                </button>
            </div>
          </InfoWindow>
        )}
        {showRoute && selectedLoRa && (
          <Polyline
            path={pathCoordinates}  // ระบุ pathCoordinates ตามที่ต้องการ
            options={{
              strokeColor: '#008fff',
              strokeOpacity: 1,
              strokeWeight: 8,
              clickable: false,
              draggable: false,
              editable: false,
              visible: true,
    }}
  />
)}
          </GoogleMap>
          
        </LoadScript>
        
      </div>
    
  );
};

export default Map;
