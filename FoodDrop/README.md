<!DOCTYPE html>
<!--
    Copyright (c) 2012-2016 Adobe Systems Incorporated. All rights reserved.

    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->
<html>

<head>
    <meta charset="utf-8" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="msapplication-tap-highlight" content="no" />
    <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" />
    <!-- This is a wide open CSP declaration. To lock this down for production, see below. -->
    <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline'; style-src 'self' 'unsafe-inline'; media-src *" />
    <!-- Good default declaration:
    * gap: is required only on iOS (when using UIWebView) and is needed for JS->native communication
    * https://ssl.gstatic.com is required only on Android and is needed for TalkBack to function properly
    * Disables use of eval() and inline scripts in order to mitigate risk of XSS vulnerabilities. To change this:
        * Enable inline JS: add 'unsafe-inline' to default-src
        * Enable eval(): add 'unsafe-eval' to default-src
    * Create your own at http://cspisawesome.com
    -->
    <!-- <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: 'unsafe-inline' https://ssl.gstatic.com; style-src 'self' 'unsafe-inline'; media-src *" /> -->

    <link rel="stylesheet" type="text/css" href="css/index.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <title>Hello World</title>

    <style>
       #map {
        height: 400px;
        width: 800px;
       }
    </style>
</head>

<body>
    <div class="app">
        <h1>PhoneFapp Best Feces Edition</h1>
        <div id="deviceready" class="blink">
            <p class="event listening">Connecting to Device</p>
            <p class="event received">Device is Ready</p>
        </div>
        <div id="map"></div>
        username <input id="foodpool_username" type="text"><br>
        jassword <input id="foodpool_password" type="text"><br>
        address <input id="foodpool_address" type="text"><br>

        <input id="imageuploader" type="file" name="pic" accept="image/*">
        
        <button type="button" onclick="foodpool_firebase_registerUser()">Register Keith</button>
        <button type="button" onclick="foodpool_firebase_addDrop()">Add example drop</button>
        <button type="button" onclick="foodpool_firebase_deleteDrop('example')">Delete example drop</button>
        <button type="button" onclick="foodpool_imgur_uploadTest()">Imgur upload test</button>

        <button type="button" onclick="foodpool_gmaps_geocode()">Geocode address</button>

        <button type="button" onclick="foodpool_firebase_retrieveDrops()">Get drops</button>
    </div>

    <script type="text/javascript" src="cordova.js"></script>

    <script type="text/javascript" src="js/index.js"></script>

    <script>
    var map;
      function initMap() {

        var onSuccess = function(position) {

            var geolocated = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: geolocated
            });
        };
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        
      }

      function foodpool_gmaps_placeMarker(creatorName, dateCreated, description, pictureURL, locationGeo)
      {

        console.log("Location geo: " + locationGeo);
        var latlngsplit = locationGeo.split(", ");

        var location = new google.maps.LatLng(parseFloat(latlngsplit[0]), parseFloat(latlngsplit[1]));

        var marker = new google.maps.Marker({
          position: location,
          map: map,
          title: creatorName
        });

        var contentString = "<h1>" + creatorName + "</h1>" +
                            "<p>Date created: " + dateCreated + "<br>" +
                            "Description: " + description + "<br>" +
                            "<img src ='" + pictureURL + "' style='width:500px;height:200px'/>";
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      }
    </script>




    <script type="text/javascript">
        app.initialize();

        var imgur_clientId = 'b37798f670e2df3';

        function foodpool_firebase_retrieveDrops()
        {
            console.log("entered retrireve pfucntion");   
            return firebase.database().ref('/drops/').once('value').then(function(snapshot) {
              var json = snapshot.val();
                

                for(var i in json)
                {
                     var creatorName = json[i].creatorName;
                    var dateCreated = json[i].dateCreated;
                    var description = json[i].description;
                    var dropPicture = json[i].dropPictureURL;
                    var locationGeo = json[i].locationGeo;

                    foodpool_gmaps_placeMarker(creatorName, dateCreated, description, dropPicture, locationGeo);
                }


              

            });
        }

        function foodpool_firebase_registerUser()
        {
            var signin_email = document.getElementById("foodpool_username").value;
            var signin_pass = document.getElementById("foodpool_password").value;

            firebase.auth().createUserWithEmailAndPassword(signin_email, signin_pass).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log("FoodPool - Firebase - Registration errors: " + errorMessage);
                });
        }

        function foodpool_firebase_loginUser()
        {
            var signin_email = document.getElementById("foodpool_username").value;
            var signin_pass = document.getElementById("foodpool_password").value;

            firebase.auth().signInWithEmailAndPassword(signin_email, signin_password).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              console.log("FoodPool - Firebase - Login errors: " + errorMessage)
            });
        }

        function foodpool_firebase_addDrop()
        {

            firebase.database().ref('drops/examplea').set({
                creatorUID: 'afkaefkii215',
                creatorName: 'Gordon Freeman',
                dateCreated: '5/2/7 7 PM',
                dropPictureURL: 'imgur.com/i/faf21.png',
                locationGeo: '35.25 N 25 W -53',
                description: 'Apples and stuff like that'
          });
        }

        function foodpool_firebase_deleteDrop(dropID)
        {
            firebase.database().ref('drops/' + dropID).remove();
        }

//AIzaSyBKuwo5MRYI7s05OvlbJEpEfYF3TrKRT5Q


        function foodpool_imgur_uploadTest()
        {

                var file = document.getElementById("imageuploader").files[0];
                console.log(file);
                if (file) {
                    var reader = new FileReader();

                    reader.onload = function(readerEvt) {
                        var binaryString = readerEvt.target.result;
                        var base64Data = btoa(binaryString);
                      


                        $.ajax({
                              url: 'https://api.imgur.com/3/image',
                              type: 'POST',
                              headers: {
                                Authorization: 'CLIENT-ID ' + imgur_clientId,
                                Accept: 'application/json'
                              },
                              data: {
                                image:  base64Data
                              },
                              success: function(result) {
                                var id = result.data.id;
                                console.log('Image uploaded to http://i.imgur.com/' + id + '.png');
                              }
                            });
                    };

                    reader.readAsBinaryString(file);
                }
        }


        function foodpool_gmaps_geocode()
        {
             var geocoder = new google.maps.Geocoder();

             var address = document.getElementById("foodpool_address").value;
             var loc = [];

             geocoder.geocode( { 'address': address}, function(results, status) {
              // and this is function which processes response
              if (status == google.maps.GeocoderStatus.OK) {
                loc[0]=results[0].geometry.location.lat();
                loc[1]=results[0].geometry.location.lng();


                //INSERT CALLBACK FUNCTION HERE THAT STARTS ADDING THE OTHER ELEMENTS 
                //TO THE DATABASE QUERY

                alert( loc ); // the place where loc contains geocoded coordinates

              } else {
                alert("Geocode was not successful for the following reason: " + status);
              }
            });




        }




               
             
        
    </script>




    <script src="https://www.gstatic.com/firebasejs/4.0.0/firebase.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBKuwo5MRYI7s05OvlbJEpEfYF3TrKRT5Q&callback=initMap"
    async defer></script>
    <script>
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyAnfDSStNP9IgTNVIAJUBbiRPLWhBmmutU",
        authDomain: "fooddrop-7bf0b.firebaseapp.com",
        databaseURL: "https://fooddrop-7bf0b.firebaseio.com",
        projectId: "fooddrop-7bf0b",
        storageBucket: "fooddrop-7bf0b.appspot.com",
        messagingSenderId: "909620415382"
      };
      firebase.initializeApp(config);
</script>
</body>

</html>
