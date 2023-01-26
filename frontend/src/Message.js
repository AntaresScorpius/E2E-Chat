import React, {useEffect, useState, useRef} from 'react';
import Chat from './Chat';
// import axios from 'axios';

import {decryptData, toCrypto} from './secret';
// import {Socket} from 'socket.io-client';

function Message({socket, jsonKey, priKey}) {
  // const [messages, setMessages] = useState([]);
  const [partnerKey, setPartnerKey] = useState(null);
  const [room, setRoom] = useState(null);

  const modalRef = useRef(null);

  function handleJoin(e) {
    socket.emit('join', room);
    // socket.emit('join', room);
    // socket.on(room);

    console.log('join room :', room);
  }

  socket.on('key', async (msg) => {
    console.log('Server wants to exchange public keys:', msg);
    socket.emit('exchange', jsonKey);
  });

  socket.on('exchange', async (jwk) => {
    console.log('recieved parters key', jwk);
    const key = await toCrypto(jwk);
    console.log('after conversion', key);
    setPartnerKey(key);
  });

  useEffect(() => {
    socket.on('error', (msg) => {
      alert(msg);
    });
  }, []);

  // useEffect(() => {
  //   if (socket !== null) return
  //   if (pubKey == null || priKey == null) {
  //     genkey()
  //       .then((keypair) => {
  //         setPriKey(keypair.privateKey);
  //         setPubKey(keypair.publicKey);
  //         console.log(keypair);
  //         return toJWK(keypair.publicKey);
  //       })
  //       .then((jwkkey) => {
  //         setJsonKey(jwkkey);
  //         console.log('jsonKey', jwkkey);
  //       })
  //       .catch((err) => {
  //         console.log('error making key', err);
  //       });
  //   }
  //   socket.on('chat', (message) => {
  //     setMsg([...msg, message]);
  //     console.log('rec:', message);
  //   });
  // }, [room]);

  return (
    <div id="modal" ref={modalRef}>
      <p className="text-gradient">ID: {socket.id}</p>
      <p className="text-gradient"> Room: {room}</p>
      {/* <input type="text" onChange={(e) => setText(e.target.value)} />
      <button onClick={handleClick}>Send Message</button> */}
      <div>
        <input type="text" onChange={(e) => setRoom(e.target.value)} />
        <button id="modal-button" onClick={handleJoin}>
          Create / Join Room
        </button>
        {/* <button id="cancel-button" onClick={() => setMsg([])}>
          Clear
        </button> */}
      </div>
      {partnerKey ? (
        <Chat
          socket={socket}
          jwk={jsonKey}
          partnerKey={partnerKey}
          modalRef={modalRef}
          priKey={priKey}
        />
      ) : (
        <>
          <p className="text-gradient">Enter Room first</p>
          <p className="text-gradient">Chat Appears when two users join</p>
        </>
      )}
    </div>
  );
}

export default Message;
