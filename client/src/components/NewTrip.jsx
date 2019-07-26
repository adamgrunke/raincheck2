import React from 'react';
import axios from 'axios';
// import {Link} from 'react-router-dom';
// import withRouter from 'react-router-dom';

class NewTrip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tripName: '',
            zipStart: '',
            startTime: '',
            travelTime: '',
            zipDest: '',
            returnTime: '',
            returnTravelTime: ''
        }
        this.handleTripNameChange = this.handleTripNameChange.bind(this)
        this.handleZipStartChange = this.handleZipStartChange.bind(this)
        this.handleStartTimeChange = this.handleStartTimeChange.bind(this)
        this.handleTravelTimeChange = this.handleTravelTimeChange.bind(this)
        this.handleZipDestChange = this.handleZipDestChange.bind(this)
        this.handleReturnTimeChange = this.handleReturnTimeChange.bind(this)
        this.handleReturnTravelTimeChange = this.handleReturnTravelTimeChange.bind(this)
        this.handleNewTripSubmit = this.handleNewTripSubmit.bind(this)
    }
    // Functions to handle the NewTrip Form submissions
    handleTripNameChange(e) {
        this.setState({
            tripName: e.target.value
        })
    }
    handleZipStartChange(e) {
        this.setState({
            zipStart: e.target.value
        })
    }
    handleStartTimeChange(e) {
        this.setState({
            startTime: e.target.value
        })
    }
    handleTravelTimeChange(e) {
        this.setState({
            travelTime: e.target.value
        })
    }
    handleZipDestChange(e) {
        this.setState({
            zipDest: e.target.value
        })
    }
    handleReturnTimeChange(e) {
        this.setState({
            returnTime: e.target.value
        })
    }
    handleReturnTravelTimeChange(e) {
        this.setState({
            returnTravelTime: e.target.value
        })
    }

    handleNewTripSubmit(e) {
        e.preventDefault()
        // console.log(this.props.token)
        let config = {
            headers: {
                Authorization: `Bearer ${this.props.token}`
            }
        }
        axios.post('/trips', {
            tripName: this.state.tripName,
            zipStart: this.state.zipStart,
            startTime: this.state.startTime,
            travelTime: this.state.travelTime,
            zipDest: this.state.zipDest,
            returnTime: this.state.returnTime,
            returnTravelTime: this.state.returnTravelTime
        }, config).then(res => {
            // console.log('this is the res.data ', res.data)




            axios.get("/trips", config)
                .then(res => {
                    let trips = res.data
                    let user = Object.assign(this.props.user)
                    user.trips = trips
                    this.props.liftUser(user)
                })

        }).then(() => {
            this.props.history.push('/trips/mytrips')
        }).catch(err => {
            this.setState({
                message: "Trip not saved. Try again.",
                err: err
            })
        })
    }
    render() {
        return (
            <>
                {/* // Let's return the form that allows people to save a trip. Below is sample code*/}
                <div className="">
                    <h3>Create a New Trip</h3>
                    <form onSubmit={this.handleNewTripSubmit}>
                        Trip Name: <input className="textbox" onChange={this.handleTripNameChange}
                            value={this.state.tripName}
                            type="text"
                            name="tripName"
                            placeholder="Trip title..." /><br />
                        Origin ZipCode:<input className="textbox" onChange={this.handleZipStartChange}
                            value={this.state.zipStart}
                            type="number"
                            name="zipStart"
                            placeholder="Enter your origin zipcode" /><br />

                        Start Time: <input className="textbox" onChange={this.handleStartTimeChange}
                            value={this.state.startTime}
                            type="datetime-local"
                            name="startTime"
                            placeholder="Enter your departure time" /><br />

                        Travel Time: <input className="textbox" onChange={this.handleTravelTimeChange}
                            value={this.state.travelTime}
                            type="number"
                            name="travelTime"
                            placeholder="Enter your estimated travel time..." /><br />
                        Destination ZipCode <input className="textbox" onChange={this.handleZipDestChange}
                            value={this.state.zipDest}
                            type="number"
                            name="zipDest"
                            placeholder="Enter your destination zipcode" /><br />

                        Return Time <input className="textbox" onChange={this.handleReturnTimeChange}
                            value={this.state.returnTime}
                            type="datetime-local"
                            name="returnTime"
                            placeholder="Enter your return trip start time" /><br />

                        Return Travel Time  <input className="textbox" onChange={this.handleReturnTravelTimeChange}
                            value={this.state.returnTravelTime}
                            type="number"
                            name="returnTravelTime"
                            placeholder="Enter your estimated travel time..." /><br />
                        <input className="button" type="submit" value="Save Trip!" />

                    </form>
                </div>
            </>
        )
    }
}

export default NewTrip;
