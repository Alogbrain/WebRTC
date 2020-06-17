import React from 'react'
// import './item.scss'

import defImg from '../images/default.jpg'
import mna from '../images/MNA.jpg'
import duck from '../images/duck.jpg'
import ninja from '../images/ninja.png'
import dinasour from '../images/dinasour.jpg'
const Objects = { "defImg": defImg, "duck": duck, "ninja": ninja, "dinasour": dinasour };
export default class App extends React.Component {
    render() {
        {
            if (this.props.userId == 0) {
                return (
                    <li className="message left appeared" >
                        <div className="avatar">
                            <img id="img" src={defImg} alt="user" />
                        </div>
                        <div className="text_wrapper">
                            <br/>
                            <div className="text">
                                {this.props.message}
                            </div>
                        </div>
                    </li>
                )
            } else {
                return (
                    <li className={this.props.user ? "message right appeared" : "message left appeared"} >
                        <div className="avatar">
                            <img id="img" src={Objects[this.props.img]} alt="user" />
                        </div>
                        <div className="text_wrapper">
                            <div className="text">
                                <b>{this.props.username}</b>
                                <br></br>
                                {this.props.message}
                            </div>
                            {/* <div className="box bg-light-info">{this.props.message}</div> */}
                        </div>
                    </li>
                )
            }

        }
    }
}