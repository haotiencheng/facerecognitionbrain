import React, { Component } from 'react';
import Clarifai from 'clarifai'
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css'

const app = new Clarifai.App({
  apiKey: 'e2c700b271a54ceba4a0a9813e234b16'
});

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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: '',
      name: '',
      value: '',
    }
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
    const name = data.outputs[0].data.regions[0].data.concepts[0].name.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    const prob = data.outputs[0].data.regions[0].data.concepts[0].value
    console.log(name, prob)
    return [name, prob]
  }

  displayNameAndProb = (data) => {
    this.setState({ name: data[0] })
    this.setState({ prob: data[1] })
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        Clarifai.CELEBRITY_MODEL,
        this.state.input)
      .then(response => {
        this.displayFaceBox(this.calculateFaceBox(response));
        this.displayNameAndProb(this.calculateNameAndProb(response));
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        // console.log(response.outputs[0].data.regions[0].data.concepts[0].name);
        // console.log(response.outputs[0].data.regions[0].data.concepts[0].value)
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App" >
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} name={this.state.name} prob={this.state.prob} />
      </div>
    );
  }
}

export default App;
