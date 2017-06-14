import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

export default class SimpleMap extends Component {
  constructor() {
    super();
    this.state = {  
      currentZoom: 20,
      center: {lat: 43.6532, lng: -79.3832}      
    }
  }

  render() {
    return (
      <GoogleMapReact
        defaultCenter={this.state.center}
        defaultZoom={this.state.currentZoom}
      >

        {
          this.props.instruments.map((v, i)=> {
          return (
            <Marker
              key={i}
              lat={v.latitude}
              lng={v.longitude}
              instrNum={v.instrNum}
              type={v.instrType}
              refElev={v.refElev}
              gsElev={v.gsElev}
              baseline={v.baseline}
              data={v.data}
              mapZoom={this.state.currentZoom}
            />
          )
        })
      }

      </GoogleMapReact>
    );
  }
}

class Marker extends Component {
  constructor() {
    super();
    this.state = {  
      showMarker: false     
    }
    this.toggleMarker = this.toggleMarker.bind(this);
  }

  toggleMarker() {
    console.log("toggle", this.state.showMarker)
    this.setState({showMarker: !this.state.showMarker})
  }

  render() {
     var markerStyle = {
      display: this.state.showMarker ? "block" : "none"
    };

    var markerSize = 100 / this.props.mapZoom;

    var markerSizeStyle = {
      width: markerSize,
      height: markerSize
    }

    var readings = Object.values(this.props.data);
    
    // readings.sort(function(a, b){ return a.date-b.date });

    readings.sort(function(a, b){
      return parseInt(b.date.replace(/-/g, ""))-parseInt(a.date.replace(/-/g, ""))});

    // if current reading is default (not yet defined) make date + reading = TBD
    if (readings[0].date === '1900-01-01') {
      readings[0].date = 'TBD';
      readings[0].reading = 'TBD';
    }

    return (<div className="markerWrapper">
              <div className={"markerDetails"} style={markerStyle}>
                <div>
                  <p className='instrNameMap'>{this.props.type}-{this.props.instrNum}</p>
                  <p>GS Elev: {this.props.gsElev} (masl)</p>
                  <p>Ref Elev: {this.props.refElev} (masl)</p>
                  <p>Baseline: {this.props.baseline} (m)</p> 
                  <p>Latest Reading: {readings[0].reading}m on {readings[0].date} </p>             
                </div>
              </div>
              <div className={"marker " + markerSizeStyle + " " + this.props.type + "Marker"} onClick={()=>this.toggleMarker()}>
                {this.props.instrNum}
              </div>
            </div>
    );
  }
}