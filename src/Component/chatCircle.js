import React from 'react'
import '../Component/chatCircle.css'
import icon from '../images/messIcon.png'
export default class App extends React.Component {
    render() {
        return (
            <div id="body" onClick={()=>this.props.minimize()}>
                <div id="chat-circle" className="btn btn-raised">
                    {/* <div id="chat-overlay"></div> */}
                    <img id ="iconMess"src={icon}></img>
                </div>
            </div>
        );
    }

}