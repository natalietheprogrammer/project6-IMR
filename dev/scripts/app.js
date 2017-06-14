import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

// import firebase from 'firebase';

 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyBPw1urP3mA_Xg6d5kZvTtud3ZzXeSZ_vQ",
    authDomain: "imdatadisplay.firebaseapp.com",
    databaseURL: "https://imdatadisplay.firebaseio.com",
    projectId: "imdatadisplay",
    storageBucket: "imdatadisplay.appspot.com",
    messagingSenderId: "470270168744"
  };
    firebase.initializeApp(config);

  // Get a reference to the database service
var fbdb = firebase.database();

import Map from './map.js'

const dbRef = fbdb.ref('/');
const dbRefInstruments = fbdb.ref('/instruments/');


const instrDetailsList = {
	instrType: {
		id: 0,
		renderName: 'Type',
		renderUnit: '',
		placeholder: 'Acronynm',
		userInputType: ''
	},
	instrNum: {
		id: 1,
		renderName: 'No.',
		renderUnit: '',
		placeholder: 'ie. 01'
	},
	latitude: {
		id: 2,
		renderName: 'Latitude',
		renderUnit: '',
		placeholder: ''
	},
	longitude: {
		id: 3,
		renderName: 'Longitude',
		renderUnit: '',
		placeholder: '',
	},
	gsElev: {
		id: 4,
		renderName: 'GS Elev',
		renderUnit: ' (masl)',
		placeholder: ''
	},
	refElev: {
		id: 5,
		renderName: 'Ref Elev',
		renderUnit: ' (masl)',
		placeholder: ''
	},
	baseline: {
		id: 6,
		renderName: 'Baseline',
		renderUnit: ' (m)',
		placeholder: ''
	}
}

class AddInstrument extends React.Component {
	constructor() {
		super();
			this.state = {
					areYouSureShow: false,
					instrToRemove: "",
				// data = [],
				// instrumentKey = ''
					instrType: '',
					instrNum: '',
					latitude: '',
					longitude: '',
					gsElev: '',
					refElev: '',
					baseline: '',
					newInstrument: {},
					dbInstruments: [],
					readingDate: '',
					readingValue: '',
					reset: '',
					data: {
						defaultInput: {
							reading: -1000,
							date: '1900-01-01'
						}
					}
			}
		this.createNewInstrument = this.createNewInstrument.bind(this);
		this.handleSubmit_newInstrument = this.handleSubmit_newInstrument.bind(this);
		this.handleChange_newInstrument = this.handleChange_newInstrument.bind(this);
		this.handleSubmit_newData = this.handleSubmit_newData.bind(this);
		this.handleChange_readingValue = this.handleChange_readingValue.bind(this);
		this.removeInstrument = this.removeInstrument.bind(this);
			
	}
	// NEW INSTRUMENT 
	createNewInstrument() {
		var newInstrument = {};

		// Populate object
		for (var key in instrDetailsList) {
			newInstrument[key] = this.state[key];
		}

		newInstrument.data = this.state.data;

		console.log(newInstrument);

		this.setState({newInstrument})
	}
	handleSubmit_newInstrument(e) {
		e.preventDefault();
		console.log("Submiting new instrument to Firebase")
		// Push object
		dbRefInstruments.child(this.state.instrType+this.state.instrNum).set(this.state.newInstrument);

		// Clear state/input fields
		for (var key in instrDetailsList) {
			this.setState({
				[key]: ''
			})
		}

		this.setState({
			newInstrument: {}
		})			
		
	}
	handleChange_newInstrument(e) {
		console.log("handleChange", e)
		this.setState({
			[e.target.name]: e.target.value
		}, function() {
			this.createNewInstrument();
		});
	}
	// END OF NEW INSTRUMENT

	//NEW DATA
	handleChange_readingValue(e) {
		this.setState({	
			[e.target.name]: e.target.value
		});
	}
	handleSubmit_newData(e) {

		// e = instrtype+instrNum
		
		// make an object of reading and date
		var readingAndDate = {
			reading: this.state[`${e}-Reading`],
			date: this.state[`${e}-Date`]
		}

		// Push object to firebase
		var dbRefInstrData = fbdb.ref(`/instruments/${e}/data/`);
		dbRefInstrData.push(readingAndDate);

		// Clear state/input fields
		this.setState({
				[`${e}-Reading`]: '',
				[`${e}-Date`]: ''
		})
	

		// this.setState({
		// 	newInstrument: {}
		// })			
		
	}

	removeInstrument(e, instrToRemove) {
		e.preventDefault();
		console.log('remove instr clicked', instrToRemove);

		this.setState({areYouSureShow: true, instrToRemove: instrToRemove});
	}

	
	deleteLastDataValue() {
		console.log("Deleting last data value", this.state)

		var instrToRemove = this.state.instrToRemove;

		const instrRmvRef = fbdb.ref(`/instruments/${instrToRemove}/`);
		instrRmvRef.remove();

		this.setState({areYouSureShow: false});
	}
	//END OF NEW DATA

	render() {
		// console.log("STATE!", this.state);
		// console.log('dbInstruments', this.state.dbInstruments);

		var spzInstruments = Array.from(this.state.dbInstruments).filter((object) => {
			return (object.instrType === 'spz')
		});	
		spzInstruments.sort(function(a, b){return a.instrNum-b.instrNum});
	

		var gmpInstruments = Array.from(this.state.dbInstruments).filter((object) => {
			return (object.instrType === 'gmp')
		});	
		gmpInstruments.sort(function(a, b){return a.instrNum-b.instrNum});

		// console.log('spzInstruments', spzInstruments);

	    var showAreYouSure = {
	      display: this.state.areYouSureShow ? "block" : "none"
	    };

		return (
			<div>
				<header>
					<h1>IMR</h1>
				</header>

				<section className="mapSection">
					<div id="map" ref="map">
						<Map instruments={this.state.dbInstruments}/>
					</div>
					<div className="legendSection">
							<h3>Legend</h3>
							<ul>
								<li><div className="spzMarkerLegend instrSymbol"></div>SPZ - Open Standpipe Piezometer</li>
								<li><div className="gmpMarkerLegend instrSymbol"></div>GMP - Ground Monitoring Point</li>
							</ul>
						</div> {/* end of RHS */}
				</section>

				<section className="userInputs">
					<div className="addInstrument">
						<h2>Add Instrument</h2>
							<form onSubmit={this.handleSubmit_newInstrument}>
								<ul className="clearfix">
															
									{/* 1. make an array out of the object keys.
									    2. map the array of object keys
									    3. as the array of object keys is being mapped, go to
									      corresponding key value pairs of actual object and tunnel down to the desired values! */
									  }			
									{Object.keys(instrDetailsList).map((v, i)=> {
										return (
											<li className="instrumentDetailsList" key={i + 'instrDetails'}>
												<div className="labelName">
													<label key={i + 'instrDetailsLabel'} htmlFor={instrDetailsList[v]}>{instrDetailsList[v].renderName}: <span className="unit" key={i + 'instrDetailsP'}>{instrDetailsList[v].renderUnit}</span></label>
												</div>
												<div className="inputField">
													<input name={v} value={this.state[v]} onChange={this.handleChange_newInstrument} key={i + 'instrDetailsInput'} type="text" id={instrDetailsList[v]} placeholder={instrDetailsList[v].placeholder}/>
												</div>
											</li>
										)
									})}
									<li>
										<input type="submit" value="Add Instrument" className="addInstrButton"/>	
									</li>
								</ul>
								
							</form>
					</div> {/* end of addInstr Container */}

					<div className='addData'>
						<div className="areYouSure" style={showAreYouSure}>
							<p>Delete<span className='areYouSureInstrName'>{this.state.instrToRemove}</span> and all data associated with this instrument?</p>
							<div>
								<button onClick={()=>this.deleteLastDataValue()}>Yes</button>
								<button onClick={()=>this.setState({areYouSureShow: false})}>No</button>
							</div>
						</div>

						<h2>Input Data</h2>
						<ul>
							<li className="readingsInput">
								<div className="col1 colHeader">ID</div>
								<div className="col2 colHeader">Reading<span>(m)</span></div>
								<div className="col3 colHeader">Date <span className="dateFormat"></span></div>

							</li>
							{spzInstruments.map((v, i) => {
								return (
									<li key = {i + 'datainput_li'}>
										<form className="readingsInput">
											<div className="instrIdLabel">
												<label key = {i + 'datainput_label'} htmlFor={v.instrType+v.instrNum}>{v.instrType}-{v.instrNum}</label>
											</div>
											<input name = {`${v.instrType+v.instrNum}-Reading`} value={this.state[`${v.instrType+v.instrNum}-Reading`]} onChange={this.handleChange_readingValue} key={i + 'readingValue'} type="text" className="readingInput" id={v.instrType+v.instrNum} />
											<input name = {`${v.instrType+v.instrNum}-Date`} value={this.state[`${v.instrType+v.instrNum}-Date`]} onChange={this.handleChange_readingValue} key={i + 'dateValue'} type="date" className="dateInput" id={v.instrType+v.instrNum}/>														
											<input key = {i + 'datainput_submit'} onClick={()=>this.handleSubmit_newData(v.instrType+v.instrNum)} className="submitDataInput" value="Add Data"/>
											<button onClick={(e)=>this.removeInstrument(e,v.instrType+v.instrNum)}>x</button>
										</form>
									</li>
								) 
							})}
						</ul>
						<ul>
							{gmpInstruments.map((v, i) => {
								return (
									<li key = {i + 'datainput_li'}>
										<form className="readingsInput">
											<div className="instrIdLabel">
												<label key = {i + 'datainput_label'} htmlFor={v.instrType+v.instrNum}>{v.instrType}-{v.instrNum}</label>
											</div>
											<input name = {`${v.instrType+v.instrNum}-Reading`} value={this.state[`${v.instrType+v.instrNum}-Reading`]} onChange={this.handleChange_readingValue} key={i + 'readingValue'} type="text" className="readingInput" id={v.instrType+v.instrNum} />
											<input name = {`${v.instrType+v.instrNum}-Date`} value={this.state[`${v.instrType+v.instrNum}-Date`]} onChange={this.handleChange_readingValue} key={i + 'dateValue'} type="date" className="dateInput" id={v.instrType+v.instrNum}/>														
											<input key = {i + 'datainput_submit'} onClick={()=>this.handleSubmit_newData(v.instrType+v.instrNum)} className="submitDataInput" value="Add Data"/>
											<button onClick={(e)=>this.removeInstrument(e,v.instrType+v.instrNum)}>x</button>
										</form>
									</li>
								) 
							})}
						</ul>
					</div> {/* end of data Container */}
				</section>
			</div>
		)
	}

	componentDidMount() {

		dbRefInstruments.on('child_added', (snapshot) =>{

			var dbInstruments = this.state.dbInstruments;
			dbInstruments.push(snapshot.val());
			// dbInstruments[snapshot.val().instrType + snapshot.val().instrNum] = snapshot.val();
			this.setState({dbInstruments});
			console.log('snapshot', snapshot.val());
			console.log('dbInstruments', this.state.dbInstruments);

		});

		dbRefInstruments.on('child_changed', (snapshot) =>{

			var dbInstruments = this.state.dbInstruments;

			dbInstruments = dbInstruments.filter(function(el) {
			    return el.instrNum !== snapshot.val().instrNum || el.instrType !== snapshot.val().instrType;
			});

			dbInstruments.push(snapshot.val());
			this.setState({dbInstruments});
		});

		dbRefInstruments.on('child_removed', (snapshot) =>{

			var dbInstruments = this.state.dbInstruments;

			dbInstruments = dbInstruments.filter(function(el) {
			    return el.instrNum !== snapshot.val().instrNum || el.instrType !== snapshot.val().instrType;
			});

			this.setState({dbInstruments});
		});

	}
}

class App extends React.Component {
    render() {
      return (
        <div>
          <AddInstrument />
        </div>
      )
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
