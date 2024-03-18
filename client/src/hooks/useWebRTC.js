import React, { useCallback, useEffect, useRef } from 'react'
import { useStateWithCallback } from './useStateWithCallback';
import { socketInit } from '../socket';
import {ACTIONS} from '../utils/ACTIONS';
export const useWebRTC = (roomId, user) => {
  const [clients,setClients] = useStateWithCallback([]);
  const audioElements=useRef({});
  const connections=useRef({});
  const localMediaStream=useRef(null);
  const socket=useRef(null);
  
  useEffect(()=>{
    socket.current=socketInit();
  },[])

  const addNewClients = useCallback((newClient,cb)=>{
    const search = clients.find((client)=>client._id===newClient._id);
    if(search===undefined){
        setClients((existingClients)=>[...existingClients,newClient],cb);
    }
  },[clients,setClients]);
  
  useEffect(()=>{
    const startCapture=async()=>{
        localMediaStream.current= await navigator.mediaDevices.getUserMedia({
            audio:true,
        });
    };
    startCapture().then(()=>{
        console.log(user);
        addNewClients(user,()=>{
            const localElement = audioElements.current[user._id];
            if(localElement){
                localElement.volume=0;
                localElement.srcObject= localMediaStream.current;
            }
            socket.current.emit(ACTIONS.JOIN,{});
        })
    })

  },[])
  const provideRef=(instance, userId)=>{
    audioElements.current[userId]=instance;
  };

  return{
    clients,
    provideRef,

  };
};
