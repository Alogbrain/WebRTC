import React from 'react'
import './home.css'
import App from '../App'
import $ from 'jquery'
import Peer from 'peerjs'
import io from 'socket.io-client'
import MediaHandler from '../handler/MediaHandler.js'
import Select from 'react-select'

import defImg from '../images/default.jpg'
import mna from '../images/MNA.jpg'
import duck from '../images/duck.jpg'
import ninja from '../images/ninja.png'
import dinasour from '../images/dinasour.jpg'

export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedOption: null,
            login: false,
            idPeer: null,
            usernameImg: "defImg",
            img: defImg,
            errors: {
                username: ''
            }
        }

        this.mediaHandler = new MediaHandler();
        this.peer = null;
        this.startPeer = this.startPeer.bind(this)
    }
    componentDidMount() {
        this.peer = this.startPeer();
    }
    componentWillMount() {
        // this.socket = io('https://webrtc9598.herokuapp.com/');
        this.socket = io('http://localhost:3000');
        this.socket.on('DANG_KY_THAT_BAI', () => {
            this.setState({ login: false });
            alert('username da ton tai!')
        });
        this.socket.on('DANG_KY_THANH_CONG', () => {
            this.setState({ login: true });
        });
    }
    startPeer() {
        const peer = new Peer();
        peer.on('open', id => {
            this.setState({ idPeer: id });
            console.log(id)
        })
        return peer;
    }
    login() {
        let username = $('#username').val();
        let errors = this.state.errors;
        if (username.length === 0) {
            errors.username = "Tên không được để trống";
            this.setState({ errors });
        } else {
            if (this.state.errors.username.length === 0) {
                const username = $('#username').val();
                this.socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: this.peer.id, usernameImg: this.state.usernameImg });
            }
            errors.username = ''
            $('#username').val('')
            this.setState({ errors });
        }


    }
    handleChange = (selectedOption) => {
        var Objects = [{ username: "defImg", img: defImg },
        { username: "duck", img: duck },
        { username: "ninja", img: ninja },
        { username: "dinasour", img: dinasour }]
        var _usernameImg = null;
        Objects.map(i => {
            if (i.img === selectedOption.value)
                _usernameImg = i.username;
        })
        this.setState({ selectedOption, img: selectedOption.value, usernameImg: _usernameImg });
        console.log(`Option selected:`, selectedOption.value + " " + _usernameImg);
    }
    checkValid = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'username':
                errors.username = value.length > 8 ? 'Tên không được quá 8 kí tự' : '';
                break;
            default:
                break;
        }
        this.setState({ errors, [name]: value });
    }
    render() {
        var options = [
            { value: defImg, label: <div id="test"><img src={defImg} id="imgSelect" /><span id="textSelect">Default</span></div> },
            { value: duck, label: <div><img src={duck} id="imgSelect" /><span id="textSelect">Duck</span></div> },
            { value: ninja, label: <div><img src={ninja} id="imgSelect" /><span id="textSelect">Ninja</span></div> },
            { value: dinasour, label: <div><img src={dinasour} id="imgSelect" /><span id="textSelect">Dinasour</span></div> }
        ];
        {
            if (this.state.login === false)
                return (
                    <div >
                        <div className="logo" ></div>
                        <div className="wrapper fadeInDown" >
                            <div id="formContent">
                                <div className="fadeIn first">
                                    <img src={this.state.img} className="rounded-circle user_img_msg" id="icon" alt="User Icon" />
                                </div>
                                <form noValidate>
                                    {/* <label htmlFor="fullName">Full Name</label> */}
                                    <input type="text1" name="username" id="username" onChange={this.checkValid} className="fadeIn second" placeholder="username" noValidate />
                                    {this.state.errors.username.length >= 0 && <div><span className="error">{this.state.errors.username}</span></div>}
                                    <Select id="Select" value={this.state.selectedOption} options={options} onChange={this.handleChange}></Select>
                                    <input type="button" className="fadeIn fourth" value="Log In" onClick={() => this.login()} />
                                </form>
                                <div id="formFooter">
                                    <a className="underlineHover" href="#">Forgot Password?</a>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            else {
                return <div><div className="logo" /><App socket={this.socket} peer={this.peer} mediaHandler={this.mediaHandler} /></div>
            }
        }
    }
}