import React from 'react';
import Item from './message-item'
// import './message-list.scss'
export default class App extends React.Component {
    render() {
        return (
            <ul className="messages">
                {this.props.messages.map(item => 
                    < Item  img = {item.img} key={item.id} userId = {item.userId} user={item.userId === this.props.user ? true : false} message={item.message} username={item.username}/>
                )}
            </ul>
        )
    }
}