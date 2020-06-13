import React from 'react';
export default class Input extends React.Component{
    checkEnter(e){
        // console.log(e)
        if(e.keyCode === 13){
            this.props.sendMessage(this.messageInput);
        }
    } 
    render(){
        return(
            <div className="">
               <div className="bottom_wrapper">
                   <div  className="message_input_wrapper">
                        <input ref={(ref) => {this.messageInput = ref}} type="text" className="message_input" placeholder="Type your message here" onKeyUp={this.checkEnter.bind(this)} />
                   </div>
                   <div className="send_message" onClick={() => this.props.sendMessage(this.messageInput)} ref={(ref) => {this.inputMessage = ref}} >
                        <div className='icon'></div>
                        <div className='text'>Send</div>
                   </div>
               </div>
           </div>
        );
    }
}