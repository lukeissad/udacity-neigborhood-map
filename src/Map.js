import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class Map extends Component {
  state = {
    locations: [
      {name: 'Caffè Nero', location: {lat: 54.995709, lng: -7.320242}},
      {name: 'Primrose', location: {lat: 54.9940282, lng: -7.31968}},
      {name: 'Primrose on the Quay', location: {lat: 55.006426, lng: -7.319701}},
      {name: 'Synge & Byrne', location: {lat: 54.9946159, lng: -7.319509}},
      {name: 'Legenderry Warehouse No 1', location: {lat: 54.9974879, lng: -7.319824}}
    ],
    markers: [],
    infoWindow: new this.props.google.maps.InfoWindow(),
    query: '',
    defaultIcon: null,
    highlightedIcon: null
  }

  componentDidMount() {
    this.loadMap()
    this.onClickLocation()
    this.setState({defaultIcon: this.makeMarkerIcon('001f7e')})
    this.setState({highlightedIcon: this.makeMarkerIcon('d00c27')})
  }

  // Loads the map.
  loadMap() {
    if (this.props && this.props.google) {
      const {google} = this.props
      const maps = google.maps

      const mapRef = this.refs.map
      const node = ReactDOM.findDOMNode(mapRef)

      const mapConfig = Object.assign({}, {
        center: {lat: 54.996612, lng: -7.308575}
      })

      this.map = new maps.Map(node, mapConfig)
      this.addMarkers()
    }
  }

  // Displays infoWindow when a key is pressed while having focus on one of the list items or on click.
  onClickLocation = () => {
    const that = this
    const {infoWindow} = this.state

    const displayInfoWindow = (e) => {
      const {markers} = this.state
      const markerInd =
        markers.findIndex(m => m.name.toLowerCase() === e.target.innerText.toLowerCase())
      that.populateInfoWindow(markers[markerInd], infoWindow)
    }
    document.querySelector('.locations-list').addEventListener('click', function (e) {
      if (e.target && e.target.nodeName === "LI") {
        displayInfoWindow(e)
      }
    })
    document.querySelector('.locations-list').addEventListener('keypress', function (e) {
      if (e.target && e.target.nodeName === "LI") {
        displayInfoWindow(e)
      }
    })
  }

  // Handles changes in the search field.
  handleValueChange = (event) => {
    this.setState({query: event.target.value})
  }

  // Add markers to te map.
  addMarkers = () => {
    const {google} = this.props
    const {infoWindow} = this.state
    const bounds = new google.maps.LatLngBounds()

    this.state.locations.forEach((location, index) => {
      const marker = new google.maps.Marker({
        position: {lat: location.location.lat, lng: location.location.lng},
        map: this.map,
        name: location.name,
        icon: this.makeMarkerIcon('001f7e'),
        animation: google.maps.Animation.DROP
      })
      // On click calls populateInfoWindow
      marker.addListener('click', () => {
        this.populateInfoWindow(marker, infoWindow)
      })
      // Changes marker colour on mouseover.
      marker.addListener('mouseover', () => {
        marker.setIcon(this.state.highlightedIcon)
      })
      // Changes marker colour on mouseout.
      marker.addListener('mouseout', () => {
        marker.setIcon(this.state.defaultIcon)
      })
      this.setState((state) => ({
        markers: [...state.markers, marker]
      }))
      bounds.extend(marker.position)
    })
    this.map.fitBounds(bounds)
  }

  // Fills the infoWindo with information.
  populateInfoWindow = (marker, infoWindow) => {
    const {google} = this.props
    const {defaultIcon, markers, locations} = this.state
    // Checks to make sure the infowindow is not already opened on this marker.
    if (infoWindow.marker !== marker) {
      if (infoWindow.marker) {
        const ind = markers.findIndex(m => m.name === infoWindow.marker.name)
        markers[ind].setIcon(defaultIcon)
      }
      // Animates marker if it gets clicked.
      marker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(function() {
        marker.setAnimation(null);
      }, 1200);

      // Gets latlng for use with Foursquare.
      let locationInd = locations.findIndex(l => l.name === marker.name)
      let locationLl = locations[locationInd].location.lat + ',' + locations[locationInd].location.lng

      const fsId = 'SRNXJJBUC0GSPKCA3VQJ1A4DJVBWAA5JHMXW2LNX5DWQB41E'
      const fsSecret = '3CAJOJBGXO4ISJCEDZPEMG2MKH430FHEJVUXQJFKEJAE4SGW'

      // Fetches the venue id from Foursquare, required to request venue details.
      fetch(`https://api.foursquare.com/v2/venues/search?ll=${locationLl}&v=20180724&client_id=${fsId}&client_secret=${fsSecret}`)
        .then(response => response.json())
        .then(data => {
          const venueId = data.response.venues[0].id
          // Fetches the photos of the venue.
          return fetch(`https://api.foursquare.com/v2/venues/${venueId}/photos?v=20180724&client_id=${fsId}&client_secret=${fsSecret}`)
        })
        .then(response => response.json())
        .then(photos => addImage(photos))
        .catch(e => requestError(e, 'Foursquare'))

      // Function which is called in case there's an error during the Foursquare request.
      function requestError(e, part) {
        console.log(e)
        infoWindow.setContent(`<h3>${marker.name}</h3><p class="network-warning">No pictures for you. :(</p><p class="network-warning">There was an error making a request to ${part}.</p>`)
      }

      function addImage(photos) {
        console.log(photos)
        let htmlContent = ''
        const firstImage = photos.response.photos.items[0]

        // Sets the content of the infoWindow depending on whether there was a picture returned or not.
        if (firstImage) {
          htmlContent = `<h3>${marker.name}</h3><img alt="Photo from ${marker.name}" class="cafe-image" src="${firstImage.prefix}300x300${firstImage.suffix}"/>`
        } else {
          htmlContent = `<h3>${marker.name}</h3><p>Unfortunately there were no images returned for this cafe :(.</p>`
        }
        infoWindow.setContent(htmlContent)
      }

      infoWindow.marker = marker
      infoWindow.open(this.map, marker)
      // Clears the marker property if the infoWindow is closed.
      infoWindow.addListener('closeclick', function () {
        infoWindow.marker = null
      })
      this.map.panTo(marker.getPosition());
    }
  }

  // Changes the color of the marker icon.
  makeMarkerIcon = (markerColor) => {
    const {google} = this.props
    let markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34))
    return markerImage;
  }

  render() {
    const {locations, query, markers, infoWindow} = this.state

    // Shows or hides markers depending on the query.
    if (query) {
      locations.forEach((l, i) => {
        if (l.name.toLowerCase().includes(query.toLowerCase())) {
          markers[i].setVisible(true)
        } else {
          if (infoWindow.marker === markers[i]) {
            // Closes the infoWindow if marker is removed.
            infoWindow.close()
          }
          markers[i].setVisible(false)
        }
      })
    } else {
      locations.forEach((l, i) => {
        if (markers.length && markers[i]) {
          markers[i].setVisible(true)
        }
      })
    }

    return (
      <div className="map-container">
        <div className={this.props.menuShow ? "sidebar show" : "sidebar"}>
          <input
            role="search"
            type="text"
            placeholder="Search"
            tabIndex={this.props.menuShow ? "0" : "-1"}
            value={this.state.value}
            onChange={this.handleValueChange}
            aria-label="Cafe search field"
          />
          <ul className="locations-list">
            {markers.filter(marker => marker.getVisible()).map((marker, index) => (
              <li key={index} className="location" tabIndex={this.props.menuShow ? "0" : "-1"}>{marker.name}</li>
            ))}
          </ul>
        </div>
        <div role="application" className="map" ref="map" aria-label="Map with cafe locations">
            loading map...
        </div>
        <a href="https://developer.foursquare.com/" className="foursquare-link">
          <img className="foursquare-logo" src="http://www.freeiconspng.com/uploads/foursquare-icon-12.png" title="Image from freeiconspng.com" alt="Foursquare logo" />
        </a>
      </div>
    )
  }
}
