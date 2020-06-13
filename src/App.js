import React from 'react';
import logo from './logo.svg';
import './App.css';
import Peer from 'peerjs'
import $ from 'jquery'
import MediaHandler from './handler/MediaHandler.js'
import io from 'socket.io-client'
import BoxChat from './Component/boxChat'
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hasMedia: false,
      // otherUserId: null,
      arrPeer: [],
      idPeer: null
    }

    this.mediaHandler = new MediaHandler();
    this.socket = null;
    this.peer = null;
    this.startPeer = this.startPeer.bind(this)
    this.Call = this.Call.bind(this)
    this.SignUp = this.SignUp.bind(this)
    this.ClickLi = this.ClickLi.bind(this)
  }
  componentDidMount() {
      this.peer =this.startPeer();
  }
  componentWillMount() {
    this.socket = io('https://webrtc9598.herokuapp.com/');
    // this.socket = io('http://localhost:3000');
    this.mediaHandler.getPermission()
      .then(stream => {
        this.setState({ hasMedia: true });
        try {
          this.myVideo.srcObject = stream;
        } catch (error) {
          this.myVideo.src = URL.createObjectURL(stream);
        }
        this.myVideo.play();
      });

      this.socket.on('DANG_SACH_ONLINE', arrUserInfo => {
        arrUserInfo.forEach(user => {
          const { ten, peerId } = user;
            this.state.arrPeer.push(user);
            this.setState({arrPeer : this.state.arrPeer})
        });
        this.socket.on('CO_NGUOI_DUNG_MOI', user => {
          const { ten, peerId } = user;
          this.state.arrPeer.push(user);
          this.setState({arrPeer : this.state.arrPeer})
        })
      })
    this.socket.on('DANG_KY_THAT_BAI', () => alert('username da ton tai!'));
    this.socket.on('AI_DO_NGAT_KET_NOI', peerId => {
      $('#' + peerId + '').remove();
    });
  }
  startPeer() {
    const peer = new Peer();
    peer.on('open', id => {
      this.setState({ idPeer: id });
      console.log(id)
    })
    peer.on('stream', (stream) => {
      try {
        this.userVideo.srcObject = stream;
      } catch (error) {
        this.userVideo.src = URL.createObjectURL(stream);
      }
      this.userVideo.play();
    })
    peer.on('call', call => {
      this.mediaHandler.getPermission()
        .then(stream => {
          call.answer(stream);
          try {
            this.myVideo.srcObject = stream;
          } catch (error) {
            this.myVideo.src = URL.createObjectURL(stream);
          }
          this.myVideo.play();
          call.on('stream', remoteStream => {
            try {
              this.userVideo.srcObject = remoteStream;
            } catch (error) {
              this.userVideo.src = URL.createObjectURL(remoteStream);
            }
            this.userVideo.play();
          })
        })
    }) 
    return peer;
  }
  Call() {
    const id = $('#remoteId').val();
    this.mediaHandler.getPermission()
      .then(stream => {
        try {
          this.myVideo.srcObject = stream;
        } catch (error) {
          this.myVideo.src = URL.createObjectURL(stream);
        }
        this.myVideo.play();
        const call = this.peer.call(id, stream);
        call.on('stream', remoteStream => {
          try {
            this.userVideo.srcObject = remoteStream;
          } catch (error) {
            this.userVideo.src = URL.createObjectURL(remoteStream);
          }
          this.userVideo.play();
        })
      });
  }
  SignUp() {
    const username = $('#txtUsername').val();
    this.socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: this.peer.id });
  }
  
  ClickLi(id) {
      this.mediaHandler.getPermission().then(stream => {
        try {
          this.myVideo.srcObject = stream;
        } catch (error) {
          this.myVideo.src = URL.createObjectURL(stream);
        }
        this.myVideo.play();
        const call = this.peer.call(id, stream);
        call.on('stream', remoteStream => {
          try {
            this.userVideo.srcObject = remoteStream;
          } catch (error) {
            this.userVideo.src = URL.createObjectURL(remoteStream);
          }
          this.userVideo.play();
        })
      });
  }
  render() {
    return (
      <div className="App">
        <p>Online USer:</p>
        <ul id="ulUser"></ul>
        {
          this.state.arrPeer.map(i => <li id={i.peerId} key={i.peerId} onClick={()=>this.ClickLi(i.peerId)}>{i.ten}</li>)
        }
        <div className="video-container">
          <h3 id="my-peer">ID : {this.state.idPeer}</h3>
          <video className="my-video" ref={(ref) => { this.myVideo = ref; }}></video>
          <video className="user-video" ref={(ref) => { this.userVideo = ref; }}></video>
        </div>
        <div>
          <input type='text' id="remoteId" placeholder="Remote ID"></input>
          <button id="btnCall" onClick={this.Call}>Call</button>
        </div>
        <div>
          <input type='text' id="txtUsername" placeholder="Enter your username"></input>
          <button id="btnSignUp" onClick={this.SignUp}>SignUp</button>
        </div>
        <BoxChat socket = {this.socket}/>
      </div>
    );
  }
}
export default App;