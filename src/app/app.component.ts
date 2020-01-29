// Research on classes imported here
import { Component,
        OnInit,
        ViewChild,
        ElementRef,
        NgZone,
         } from '@angular/core'; // @angular is scope name in NPM repository
import { MapsAPILoader, MouseEvent } from '@agm/core';


declare const google: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  // Set title
  title = 'my-giosenz-app';

  // Set initial coordinates and zoom of map when user opens UI
  latitude = 1.3521;
  longitude = 103.8198;

  // Set zoom level
  zoom: number = 11;
  locationChosen = false; // To indicate that user has not chosen a location yet. This is used for creating markers
  address: string; // address and GeoCoder used for obtaining Addresses and coordinates of markers
  private GeoCoder;
  true = true;

  toggle_truefalse() {
    // Basic toggling true and false code
    this.true = !this.true;
    console.log(this.true)
  }


  // Event that is triggered when a drawn polygon is clicked
  onPolyClick(event) {
    console.log(event.latLng.lat());
    console.log(event.latLng.lng());
  }


  // Method calling the drawing manager for drawing shapes on map
  initDrawingManager(map) {
    let shapes = [];

    // Set options to toggle between moving map and polygon drawer
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT, // Set position of drawing options toggling switch
        drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle'] // Set the different kinds of shapes you can draw
      },

      // Set properties of drawn polygon
      // Options can be found here --> https://angular-maps.com/api-docs/agm-core/interfaces/polygonoptions
      polygonOptions: {
        draggable: true,
        editable: true,
        clickable: true,
      },

      // Set properties of drawn circle
      circleOptions: {
        draggable: true,
        editable: true,
        clickable: true
      },

      // Set properties of drawn rectangle
      rectangleOptions: {
        draggable: true,
        editable: true,
        clickable: true
      },

      // Set properties of drawn polyline
      polylineOptions: {
        draggable: true,
        editable: true,
        clickable: true
      },

      drawingMode: google.maps.drawing.OverlayType.POLYGON
    }; // End of "options"

    // Create new instance of Drawing Manager
    const drawingManager = new google.maps.drawing.DrawingManager(options);
    // This code is needed to set the drawing manager on the map
    drawingManager.setMap(map);

    // Add a listener for creating new shape event.
    // This is so that after a new polygon is drawn, the first one drawn will be deleted

    // 26/8/19 The following line was converted from normal function to an arrow function.
    // Feature of arrow function is that it uses the context at time of declaration.
    // Code was suggested by @doom777 from discord
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
    // tslint:disable-next-line: prefer-const
    let newShape = event.overlay;

    // 26/8/19 This following line was added to fire the polyClick event.
    // Code was suggested by @doom777 from discord
    newShape.addListener('click', (ev) => this.onPolyClick(ev));

    newShape.type = event.type;
    shapes.push(newShape);
    if (drawingManager.getDrawingMode()) {
      drawingManager.setDrawingMode(null);
    }
    console.log(newShape); // Console log the new shape object code

    // Define NE, SE, SW, NW points of bounding box
    // Get point coordinates from here if needed for future work
    // Can't just get boundaries and extract out geotiff image:
    // https://stackoverflow.com/questions/9087166/how-can-i-extract-a-satellite-image-from-google-maps-given-a-lat-long-rectangle
    // Attempt: Get center of rectangle drawn, then use google maps static api to extract out image as close as possible to drawn
    // boundary box
    let NEpoint_lat_consolelog = newShape.getBounds().getNorthEast().lat();
    let NEpoint_lng_consolelog = newShape.getBounds().getNorthEast().lng();
    let SEpoint_lat_consolelog = newShape.getBounds().getSouthWest().lat();
    let SEpoint_lng_consolelog = newShape.getBounds().getNorthEast().lng();
    let SWpoint_lat_consolelog = newShape.getBounds().getSouthWest().lat();
    let SWpoint_lng_consolelog = newShape.getBounds().getSouthWest().lng();
    let NWpoint_lat_consolelog = newShape.getBounds().getNorthEast().lat();
    let NWpoint_lng_consolelog = newShape.getBounds().getSouthWest().lng();
    let center_lat = (NEpoint_lat_consolelog + SEpoint_lat_consolelog) / 2;
    let center_lng = (NEpoint_lng_consolelog + NWpoint_lng_consolelog) / 2;


    // Console log the new shape object boundaries
    console.log(
      'NE: ' + NEpoint_lat_consolelog + ',' + NEpoint_lng_consolelog + '\n' +
      'SE: ' + SEpoint_lat_consolelog + ',' + SEpoint_lng_consolelog + '\n' +
      'SW: ' + SWpoint_lat_consolelog + ',' + SWpoint_lng_consolelog + '\n' +
      'NW: ' + NWpoint_lat_consolelog + ',' + NWpoint_lng_consolelog + '\n' +
      'Center: ' + center_lat + ',' + center_lng
    );

    // --------------------------Creating NE and SW info windows after new shape is drawn---------------------------------- //
    // -----Code is inspired by https://developers.google.com/maps/documentation/javascript/examples/rectangle-event ------ //

    // Create first info window for newly drawn shape on top right (NE) corner
    // For future reference => List of events available for info windows to listen to are here:
    // https://developers.google.com/maps/documentation/javascript/reference/info-window under "Events"
    // vvv From Aditya (Synthesis): google and maps might be module and sub module. InfoWindow() is a class here. vvv
    let infoWindowNE = new google.maps.InfoWindow();

    // Create coordinates string here
    let NE_coordinates_str =
    'North-East corner:' + '<br>' +
    newShape.getBounds().getNorthEast().lat() + ', ' + '<br>' +
    newShape.getBounds().getNorthEast().lng();

    infoWindowNE.setContent(NE_coordinates_str); // Set NE coordinates as a string in info window
    infoWindowNE.setPosition(newShape.getBounds().getNorthEast()); // Set info window on NE corner
    infoWindowNE.open(map); // Use .open() method to open info window
    console.log(newShape.getBounds().getNorthEast())

    // Create second info window for newly drawn shape on bottom left (SW) corner
    let infoWindowSW = new google.maps.InfoWindow();

    // Create coordinates string here
    let SW_coordinates_str =
    'South-West corner: ' + '<br>' +
    newShape.getBounds().getSouthWest().lat() + ', ' + '<br>' +
    newShape.getBounds().getSouthWest().lng();

    infoWindowSW.setContent(SW_coordinates_str); // Set SW coordinates as a string in info window
    infoWindowSW.setPosition(newShape.getBounds().getSouthWest()); // Set info window on SW corner
    infoWindowSW.open(map); // Use .open() method to open info window



    // Can't add listener to info window for it to listen to drawing mode changed.
    // List of events available for info windows are here:
    // https://developers.google.com/maps/documentation/javascript/reference/info-window under "Events"
    // ie for bottom code, cannot add 'drawingmode_changed' as a listener
    // tslint:disable-next-line: only-arrow-functions
    infoWindowNE.addListener('closeclick', () => {
      // your code
      console.log('NE Info Window closed');
   });


    // --------------------------Showing changed boundaries after new shape is moved---------------------------------- //

    // Add listener to show changed boundaries after new shape is moved
    newShape.addListener('bounds_changed', showNewShape);

    // Define moved info windows
    let infoWindowNE_moved = new google.maps.InfoWindow();
    let infoWindowSW_moved = new google.maps.InfoWindow();

    // Function which gets new boundaries for new shape
    function showNewShape() {

      // Close previous NE and SW info windows
      infoWindowNE.close()
      infoWindowSW.close()

      // Create new NE coordinates string here
      let NE_coordinates_str_moved =
      'North-East corner:' + '<br>' +
      newShape.getBounds().getNorthEast().lat() + ', ' + '<br>' +
      newShape.getBounds().getNorthEast().lng();

      infoWindowNE_moved.setContent(NE_coordinates_str_moved); // Set new NE coordinates as a string in info window
      infoWindowNE_moved.setPosition(newShape.getBounds().getNorthEast()); // Set info window on NE corner
      infoWindowNE_moved.open(map);

      // Create new SW coordinates string here
      let SW_coordinates_str_moved =
      'South-West corner: ' + '<br>' +
      newShape.getBounds().getSouthWest().lat() + ', ' + '<br>' +
      newShape.getBounds().getSouthWest().lng();

      infoWindowSW_moved.setContent(SW_coordinates_str_moved); // Set new SW coordinates as a string in info window
      infoWindowSW_moved.setPosition(newShape.getBounds().getSouthWest()); // Set info window on SW corner
      infoWindowSW_moved.open(map);
    }



    // Add event listener that fires when user clicks drawing manager to change drawing mode
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', () => {
      // Close all info windows
      infoWindowNE.close();
      infoWindowSW.close();
      infoWindowNE_moved.close();
      infoWindowSW_moved.close();

      // Delete previous shape drawn
      if (drawingManager.getDrawingMode() != null) { // If there is a drawing mode retrieved is not null,
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < shapes.length; i++) { // Set previous shape drawn to null
        shapes[i].setMap(null);
        }
      }
    });


  }); // End of "overlaycomplete" listener


  } // End of initDrawing Manager

  // In Angular 8, @ViewChild takes two arguments. Must include static: false.
  @ViewChild('search', {static: false})
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  // This method is used to customise search bar results
  ngOnInit() {

    this.setCurrentLocation();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.GeoCoder = new google.maps.Geocoder;

      // This line helps address search bar autocomplete searches before user types finish query
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {

          // Get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // Verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // Set properties of the point user sees when user searched location and pressed enter
          this.latitude = place.geometry.location.lat(); // Set latitude
          this.longitude = place.geometry.location.lng(); // Set longitude
          this.zoom = 12; // Set zoom
          this.getAddress(this.latitude, this.longitude); // Display address
          this.locationChosen = true; // Display marker
        });
      });
    });
  }

  // Get current location coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  // For app to recognise that a point is still selected after originally created marker is dragged
  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  // To obtain address of point clicked
  getAddress(latitude, longitude) {
    this.GeoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  // For creating marker when clicking on map
  onChoseLocation(event) {
    console.log(event);
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.locationChosen = true; // Only on clicking a location, will a marker appear
    this.getAddress(this.latitude, this.longitude); // This line is for showing address immediately when a point is clicked
  }

  // Method that is called when Population Density button is pressed
  show_pop_d() {
    window.alert('Population Density!');
  }

  // Method that is called when Temperature button is pressed
  show_temp() {
    window.alert('Temperature!');
  }

  // Method that is called when Humidity button is pressed
  show_humidity() {
    window.alert('Humidity!');
  }

  // Method that is called when Carbon Emissions button is pressed
  show_carbon_emissions() {
    window.alert('Cabon Emissions!');
  }

  // vvv Figure out how to extract out center coordinates of drawn rectangle and pass it onto Google Maps Static API to extract out
  // satellite image
  // Might be useful => To create custom drawing manager button:
  // https://stackoverflow.com/questions/31988335/adding-a-custom-button-to-gmaps-v3-drawingmanager-button-list
  getStaticMap() {
    // Developer guide for Google Maps Static API: https://developers.google.com/maps/documentation/maps-static/dev-guide
    const test_lat = 1.3521;
    const test_lon = 103.8198;

    // Can console log initDrawingManager --> but how to extract out center lat and lon from within it?
    console.log(this.initDrawingManager);

    // tslint:disable-next-line: max-line-length
    window.open('https://maps.googleapis.com/maps/api/staticmap?center=' + test_lat + ',' + test_lon + '&scale=1.5&zoom=11&size=600x400&&maptype=satellite&key=AIzaSyDdT25mvF88YYZSE7gRhy6-AffM-63cn_s');


  }

}
