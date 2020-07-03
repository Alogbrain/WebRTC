import React from 'react'
import '../Component/chatCircle.css'
export default class App extends React.Component {
    render() {
        return (
            <div id="body" onClick={()=>this.props.minimize()}>
                <div id="chat-circle" class="btn btn-raised">
                    <div id="chat-overlay"></div>
                </div>
            </div>
        );
    }

}