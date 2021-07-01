import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css'

const particlesOptions = {
  "particles": {
    "number": {
      "value": 150
    },
    "size": {
      "value": 4
    }
  },
  "interactivity": {
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  starName: '',
  prob: '',
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }
  
  loadUser = (data) => {
    // console.log(data)
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  
  calculateFaceBox = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  calculateNameAndProb = (data) => {
    const starName = data.outputs[0].data.regions[0].data.concepts[0].name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    const prob = data.outputs[0].data.regions[0].data.concepts[0].value
    return [starName, prob]
  }

  displayNameAndProb = (data) => {
    this.setState({ starName: data[0] })
    this.setState({ prob: data[1] })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('https://smart-brain-api-rnd.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: this.state.input,
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://smart-brain-api-rnd.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id,
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(err => console.log(err));
        }
        this.displayFaceBox(this.calculateFaceBox(response));
        this.displayNameAndProb(this.calculateNameAndProb(response));
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    this.setState({ route: route })
    if (route === 'signout') {
      // console.log('signout')
      this.setState(initialState)
    } else if (route === 'home') {
      // console.log('home')
      this.setState({ isSignedIn: true })
    }
    // console.log(route)
  }

  render() {
    return (
      <div className="App" >
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation 
          onRouteChange={this.onRouteChange} 
          isSignedIn={this.state.isSignedIn}
        />
        { this.state.route === 'home'
          ? <div>
            <Logo />
            <Rank 
              name={this.state.user.name} 
              entries={this.state.user.entries} 
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit} 
            />
            <FaceRecognition 
              box={this.state.box} 
              imageUrl={this.state.imageUrl} 
              starName={this.state.starName} 
              prob={this.state.prob} 
            />
          </div>
          : (
            this.state.route === 'signin'
            ? <Signin 
                isSignedIn={this.isSignedIn} 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange} 
              />
            : <Register 
                loadUser={this.loadUser} 
                onRouteChange={this.onRouteChange} 
              />
            )
        }
      </div>
    );
  }
}

export default App;
