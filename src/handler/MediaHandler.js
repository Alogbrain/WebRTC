import React from 'react'
import Peer from 'peerjs'
import $ from 'jquery'
export default class MediaHandler extends React.Component{
    getPermission(){
        return new Promise((res,rej) => {
            navigator.mediaDevices.getUserMedia({video : true, audio : true})
            .then(stream => {
                res(stream);
            })
            .catch(err =>{
                throw new Error('Unable to fetch stream ',err);
            })
        })
    }
}