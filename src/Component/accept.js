import React from 'react'
import "./accept.css"
import man from "../images/man.png"
import notification from "../images/3.png"

import defImg from '../images/default.jpg'
import mna from '../images/MNA.jpg'
import duck from '../images/duck.jpg'
import ninja from '../images/ninja.png'
import dinasour from '../images/dinasour.jpg'
const Objects ={ "defImg": defImg ,"duck": duck ,"ninja": ninja ,"dinasour": dinasour };
export default class App extends React.Component {
    render() {
        return (
            <div className="login-form">
                <div className="head-info">
                    <a href="#"><img src={Objects[this.props.callerImg]}  alt="avatar"/></a>
                    <div className="head"><a href="#"><img src={notification} /></a>
                    </div>
                </div>
                <div className="social-icons">
                    <h3>{this.props.ten} is calling you</h3>
                    <ul className="bottom-buttons">
                        <li >
                            <a href="#" onClick={() => this.props.acceptCall()}>
                                <i className="video"> </i>
                                <p>Talk</p>
                            </a>
                        </li>
                        <li>
                            <a href="#" onClick={()=>this.props.reject()} className="top-close">
                                <i className="close"> </i>
                                <p>Later</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}