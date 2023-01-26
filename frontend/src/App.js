import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Message from './Message';
import {genkey, encryptData, decryptData, toJWK, toCrypto} from './secret';

import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [pubKey, setPubKey] = useState(null);
  const [priKey, setPriKey] = useState(null);
  const [jsonKey, setJsonKey] = useState(null);
  useEffect(() => {
    // if (socket !== null) return;
    const newSocket = io(`https://e2e.onrender.com:8080`);
    newSocket.on('connect', () => {
      setSocket(newSocket);
      console.log('connect with ID', newSocket.id);
    });
    if (pubKey == null || priKey == null) {
      genkey()
        .then((keypair) => {
          setPriKey(keypair.privateKey);
          setPubKey(keypair.publicKey);
          console.log(keypair);
          return toJWK(keypair.publicKey);
        })
        .then((jwkkey) => {
          setJsonKey(jwkkey);
          console.log('jsonKey', jwkkey);
        })
        .catch((err) => {
          console.log('error making key', err);
        });
    }

    return () => {
      console.log('in App cleanup');
      newSocket.close();
    };
  }, []);

  return (
    <div>
      {socket ? (
        <Message socket={socket} jsonKey={jsonKey} priKey={priKey} />
      ) : (
        <h4>
          Server offline... Please wait while it boots up and refresh after a
          few seconds
        </h4>
      )}
    </div>
  );
}

export default App;
