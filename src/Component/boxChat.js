import React from 'react';
import $ from 'jquery';
import _map from 'lodash/map';
import io from 'socket.io-client';
import Input from './input'
import Messages from './message-list'
// import './component.css'
// import './component.js'

export default class boxChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // messages: [{ id: 0, userId: 0, message: "HỆ THỐNG : CHÀO MỪNG VÀO PHÒNG CHAT" }],
            user: null
        }
    }
    componentWillMount() {
        this.props.socket.on('id', res => {
            this.setState({ user: res })
        });
        // this.props.socket.on('newMessage', (response) => { this.newMessage(response); })
    }
    // newMessage(m) {
    //     const messages = this.state.messages;
    //     let ids = _map(messages, 'id');
    //     let max = Math.max(...ids);
    //     messages.push({
    //         id: max + 1,
    //         userId: m.id,
    //         img: m.img,
    //         username: m.username,
    //         message: m.data
    //     })

    //     let objMessage = $('.messages');
    //     if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight) {
    //         this.setState({ messages });
    //         objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
    //     } else {
    //         this.setState({ messages });
    //         if (m.id === this.state.user) {
    //             objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
    //         }
    //     }
    // }
    sendnewMessage(m) {
        if (m.value) {
            this.props.socket.emit("newMessage", m.value);
            m.value = "";
        }
    }
    render() {
        return (
            // this.props.user
            //         ?<div className="content">
            <div className="content">
                <Messages user={this.props.user} messages={this.props.messages} typing={this.state.typing} />
                <Input sendMessage={this.sendnewMessage.bind(this)} />
            </div>
            // </div > :null
        );
    }
}
