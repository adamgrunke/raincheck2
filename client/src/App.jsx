import React from 'react';
import axios from 'axios';
import Login from './Login';
import './App.css';
import Rain from './Rain'

import Signup from './Signup';
// import Home from "./components/TripContainer";
import Raincheck from "./components/Raincheck";
import MyTrips from "./components/MyTrips";
import NewTrip from "./components/NewTrip";
import EditTrip from "./components/EditTrip";
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Header from './Header'
import Footer from './Footer'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user: null,
      errorMessage: ''
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this) //* May not be necessary since we're not passing it down...but can't hurt
    this.liftToken = this.liftToken.bind(this)
    this.liftUser = this.liftUser.bind(this)
    this.logout = this.logout.bind(this)
    this.deleteTrips = this.deleteTrips.bind(this)
    // this.getUsersTrips = this.getUsersTrips.bind(this)
  }

  checkForLocalToken() {
    var token = localStorage.getItem('mernToken'); //* localStorage lives in the browser...mernToken is key in localStorage
    if (!token || token === 'undefined') {
      // token is invalid or missing
      localStorage.removeItem('mernToken');
      this.setState({
        token: '',
        user: null
      })
    } else {
      // found a token in localStorage; verify it
      axios.post('/auth/me/from/token', { token })
        .then(res => {
          if (res.data.type === 'error') {
            localStorage.removeItem('mernToken');
            this.setState({
              token: '',
              user: null,
              errorMessage: res.data.message
            })
          } else {
            localStorage.setItem('mernToken', res.data.token);
            this.setState({
              token: res.data.token,
              user: res.data.user,
              // trips: res.data.user.trips,
              errorMessage: ''
            }, this.getUsersTrips)
          }
        })
    }
  }

  // liftToken(data) {
  //   this.setState({
  //     token: data.token,
  //     user: data.user
  //   })
  // }

  //* Object Destructuring!

  liftToken({ token, user }) {
    console.log("we are now in the liftToken function!!!!!!!2")
    this.setState({
      token,
      user
    })
  }

  liftUser(user) {
    // console.log("we are now in the liftUser function!!!!!!!2")
    this.setState({
      user
    })
  }

  logout() {
    // Remove token from localStorage
    localStorage.removeItem('mernToken');

    // Remove user and token from state
    this.setState({
      token: '',
      user: null
    })
  }

  // getUsersTrips() {
  //   let config = {
  //     headers: {
  //       Authorization: `Bearer ${this.state.token}`
  //     }
  //   }
  //   axios.get("/trips", config)
  //     .then(res => {
  //       let trips = res.data
  //       let user = Object.assign(this.state.user)
  //       user.trips = trips
  //       this.setState({
  //         user
  //       })
  //     })
  // }

  deleteTrips(tripId) {
    console.log('the delete function starts and the token is ', this.state.token)
    let config = {
      headers: {
        Authorization: `Bearer ${this.state.token}`
      }
    }
    console.log('token passed')
    axios.delete(`/trips/${tripId}`, config)
      .then(res => {
        this.setState({
          user: res.data.user
        })

      })
  }

  componentDidMount() {
    this.checkForLocalToken()
    // this.getUsersTrips()
  }

  render() {
    var user = this.state.user
    var contents
    if (user) {
      contents = (
        <>
          {/* <p>Hello, {user.name}</p> */}
            <Link to='/' onClick={this.logout}>Logout!</Link>
          {/* <p onClick={this.testRoute}></p> */}
          {/* <p>{this.state.apiData}</p> */}
        </>
      );
    } else {
      contents = (
        <>
          <p>Please signup or login</p>

          <Route exact path="/" render={ props => (
            <div>
              <Login {...props} liftToken={this.liftToken} />
            </div>)
          } />

          <Route exact path="/" render={ props => (
            <div>
              <Signup {...props} liftToken={this.liftToken} />
            </div>)
          } />

          {/* <Signup liftToken={this.liftToken} /> */}
        </>
      );
    }
    // var trip = this.state.trip // This variable is unused. -AdamG
    return (
      <>

        <Rain />
        <Router>
        {contents}
        <Header />
        <nav>
          <Link to='/'>Raincheck Home</Link>{'  |  '}
          <Link to='/trips/new'>New Trip</Link>{'  |  '}
          <Link to='/trips/mytrips'>My Trips</Link>
        </nav>
          {/* <Route
            exact
            path="/raincheck"
          render={() => <Raincheck user={this.state.user} trips={this.state.trips} checkForLocalToken={this.checkForLocalToken}   />}
          /> */}



        <Route exact path="/trips/mytrips" render={(props) => <MyTrips user={this.state.user} deleteTrips={this.deleteTrips} token={this.state.token} {...props}/>} />
        <Route exact path="/trips/mytrips/:id" render={(props) => <Raincheck user={this.state.user} token={this.state.token} {...props}/>}/>
        <Route exact path ='/trips/new' render={(props) => <NewTrip user={this.state.user} liftUser={this.liftUser} token={this.state.token} {...props} />} />
        <Route exact path ='/trips/:id/edit'
                render={(props) => <EditTrip
                                      liftUser={this.liftUser}
                                      // liftToken={this.liftToken}
                                      user={this.state.user}
                                      token={this.state.token}
                                      {...props}/>
                }   />

          {/* <Route exact path='/issues' render={(props) => <Issues issues={issueCopy} />}/>
        <Route exact path='/issues/:id' render={(props) => <IssueShow issues={issueCopy} {...props} />} />  */}

        </Router>
        <Footer />
      </>
    );
  }
}

export default App;