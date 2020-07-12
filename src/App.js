import React from 'react';
// import logo from './logo.svg';
import './App.css';
import './Component/component.css'

import Peer from 'peerjs'
import $ from 'jquery'
import MediaHandler from './handler/MediaHandler.js'
import io from 'socket.io-client'
import BoxChat from './Component/boxChat'
import Accept from './Component/accept'
import ChatCircle from './Component/chatCircle'

import _map from 'lodash/map';

import defImg from './images/default.jpg'
import mna from './images/MNA.jpg'
import duck from './images/duck.jpg'
import ninja from './images/ninja.png'
import dinasour from './images/dinasour.jpg'
const Objects = { "defImg": defImg, "duck": duck, "ninja": ninja, "dinasour": dinasour };
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMedia: false,
      // otherUserId: null,
      arrPeer: [],
      idPeer: null,
      receivingCall: false,
      caller: null,
      callerImg: null,
      minimize : false,
      messages: [{ id: 0, userId: 0, message: "HỆ THỐNG : CHÀO MỪNG VÀO PHÒNG CHAT" }],
    }

    // this.mediaHandler = new MediaHandler();
    this.mediaHandler = null;
    this.socket = null;
    this.peer = null;
    this.startPeer = this.startPeer.bind(this)
    // this.Call = this.Call.bind(this)
    this.SignUp = this.SignUp.bind(this)
    this.ClickLi = this.ClickLi.bind(this)
  }
  componentDidMount() {
    // this.peer = this.startPeer();
  }
  componentWillMount() {
    // this.socket = io('https://webrtc9598.herokuapp.com/');
    // this.socket = io('http://localhost:3000');
    this.mediaHandler = this.props.mediaHandler;
    this.peer = this.props.peer;
    this.socket = this.props.socket;
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
        // const { ten, peerId } = user;
        this.state.arrPeer.push(user);
        this.setState({ arrPeer: this.state.arrPeer })
      });
      this.socket.on('CO_NGUOI_DUNG_MOI', user => {
        // const { ten, peerId } = user;
        this.state.arrPeer.push(user);
        this.setState({ arrPeer: this.state.arrPeer })
      })
    })
    this.socket.on('hey', data => {
      if (data.userToCall === this.peer.id) {
        // alert(data.username + " is calling you")
        this.setState({ receivingCall: true, caller: data.from, callerImg: data.usernameImg })
      }
    })
    this.socket.on('callAccepted', data => {
      if (data.caller === this.peer.id) {
        this.mediaHandler.getPermission().then(stream => {
          try {
            this.myVideo.srcObject = stream;
          } catch (error) {
            this.myVideo.src = URL.createObjectURL(stream);
          }
          this.myVideo.play();
          const call = this.peer.call(data.to, stream);
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

    })
    this.socket.on('callRejected', data => {
      if (data.caller === this.peer.id) {
        alert('Cuộc gọi bị từ chối')
      }
    }
    )
    // this.socket.on('DANG_KY_THAT_BAI', () => alert('username da ton tai!'));
    this.socket.on('AI_DO_NGAT_KET_NOI', peerId => {
      // $('#' + peerId + '').remove();
      const index = this.state.arrPeer.findIndex(user => user.peerId === peerId);
      this.state.arrPeer.splice(index, 1);
      this.setState({ arrPeer: this.state.arrPeer })
    });
    this.props.socket.on('newMessage', (response) => { this.newMessage(response); })
    this.startPeer();

  }
  newMessage(m) {
    const messages = this.state.messages;
    let ids = _map(messages, 'id');
    let max = Math.max(...ids);
    messages.push({
        id: max + 1,
        userId: m.id,
        img: m.img,
        username: m.username,
        message: m.data
    })

    let objMessage = $('.messages');
    if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight) {
        this.setState({ messages });
        objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
    } else {
        this.setState({ messages });
        if (m.id === this.state.user) {
            objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
        }
    }
}
  startPeer() {
    // const peer = new Peer();
    // peer.on('open', id => {
    //   this.setState({ idPeer: id });
    //   console.log(id)
    // })
    this.peer.on('stream', (stream) => {
      try {
        this.userVideo.srcObject = stream;
      } catch (error) {
        this.userVideo.src = URL.createObjectURL(stream);
      }
      this.userVideo.play();
    })
    this.peer.on('call', call => {
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
    // return peer;
  }
  SignUp() {
    const username = $('#txtUsername').val();
    this.socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: this.peer.id });
  }

  ClickLi(id) {
    this.socket.emit('callUser', { userToCall: id, from: this.peer.id });
  }
  acceptCall() {
    this.socket.emit('acceptCall', { caller: this.state.caller, to: this.peer.id });
    this.setState({ receivingCall: false });
  }
  reject() {
    this.socket.emit('rejectCall', { caller: this.state.caller, to: this.peer.id });
    this.setState({ receivingCall: false });
  }
  minimize(){
    if(this.state.minimize === false){
      this.setState({minimize:true})  
    }else{
      this.setState({minimize:false})  
    }
    
  }
  render() {
    var incomingCall;
    if (this.state.receivingCall === true) {
      var _ten;
      this.state.arrPeer.map(i => {
        if (i.peerId === this.state.caller) {
          _ten = i.ten;
        }
      })
      incomingCall = (
        <div id="Accept" className=" fadeInDown" >
          <Accept ten={_ten} acceptCall={this.acceptCall.bind(this)} callerImg={this.state.callerImg} reject={this.reject.bind(this)} />
        </div>
      );
    }
    var minimizeChat;
    if(this.state.minimize === false){
      minimizeChat =(
        <div>
          <div className="chat_window">
            <div class="top_menu">
              <div class="buttons">
                <div class="button close" onClick={()=> this.minimize()}></div>
                <div class="button minimize" onClick={()=> this.minimize()}></div>
                <div class="button maximize" onClick={()=> this.minimize()}></div>
              </div>
              <div class="title">Chat</div>
            </div>
            <div className="menu">
              <ul id="ulUser">
                <div id="usersUl">Online User:</div>
                {
                  this.state.arrPeer.map(i => {
                    if (i.peerId !== this.peer.id)
                    return <li className="user" id={i.peerId} key={i.peerId} onClick={() => this.ClickLi(i.peerId)}>
                      <span><img id="imgUser" src={Objects[i.usernameImg]}></img></span><span>{i.ten}</span></li>
                    else
                      return null
                  })
                }
              </ul>
            </div>
            <BoxChat socket={this.socket} messages={this.state.messages} user={this.peer.id}/>
          </div>
        </div>
      )
    }else{
      minimizeChat =(
        <ChatCircle minimize={this.minimize.bind(this)}/>
      )
    }
    return (
      <div className="App">
        <div id="idVideo">
          <div className="video-container">
            <h3 id="my-peer">ID : {this.peer.id}</h3>
            <video className="my-video" ref={(ref) => { this.myVideo = ref; }}></video>
            <video className="user-video" ref={(ref) => { this.userVideo = ref; }}></video>
          </div>
          {minimizeChat}
        </div>
        {incomingCall}
      </div >
    );
  }
}
export default App;