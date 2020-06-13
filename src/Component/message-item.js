import React from 'react'
// import './item.scss'
export default class App extends React.Component{
    render(){
        return(
            <li className={this.props.user  ? 'message right' : 'message left'}>
                <div className="avatar">
                    <img id="img" src="https://scontent.fsgn2-1.fna.fbcdn.net/v/t1.0-9/54424813_2104573432990181_6339272824389107712_n.jpg?_nc_cat=107&_nc_sid=85a577&_nc_ohc=DmUnk1hdXe4AX_owOcC&_nc_ht=scontent.fsgn2-1.fna&oh=dd6339d06d003b67e9c8d85136fee1f3&oe=5F0BBB9E" alt="user" />
                </div>
                <div className="text_wrapper">
                    <div className="box bg-light-info">{this.props.message}</div>
                </div>
            </li>
        );
    }
}