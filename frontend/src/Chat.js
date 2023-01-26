import React, {useState, useEffect, useRef} from 'react';
import {encryptData, decryptData} from './secret';

const Chat = ({socket, partnerKey, modalRef, priKey}) => {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState([]);
  const [flag, setFlag] = useState(false);
  const BiggermodalRef = useRef(null);
  const inputRef = useRef(null);

  if (!flag) {
    // console.log('flag', flag);
    socket.on('chat', async (message) => {
      try {
        let de = await decryptData(priKey, message);
        // const temp = [...msg, de];
        const li = <p className="receiver">{de}</p>;
        setMsg((prevMsg) => [...prevMsg, li]);
      } catch (error) {
        // console.log('messages undefined ');
      }
    });
    setFlag(true);
  }
  async function handleClick(e) {
    const en = await encryptData(partnerKey, text);
    socket.emit('chat', en);
    // const senderStyle = `<p className= "message sender"> ${text}</p>`;
    const li = <p className="sender">{text}</p>;
    setMsg((prevMsg) => [...prevMsg, li]);
    setText('');
    inputRef.current.value = '';
    // console.log('sending encrypted text', en);
  }
  console.log('chat re render');

  useEffect(() => {
    modalRef.current.classList.add('animate');
    BiggermodalRef.current.classList.add('animate');
  }, []);

  return (
    <div ref={BiggermodalRef} id="bigger-modal">
      <div id="bigger-modal-content">
        <div id="chat-messages">{msg}</div>
        <div>
          <input
            ref={inputRef}
            type="text"
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
          />
          <button className="send-button" onClick={handleClick}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

// return (
//   <div ref={BiggermodalRef} id="bigger-modal">
//     <div className="chat-header">
//       <h1>Chat</h1>
//     </div>
//     <div className="chat-messages">
//       {msg.map((message, index) => {
//         return (
//           <div key={index} className="message-container">
//             <p className="message-text">{message}</p>
//           </div>
//         );
//       })}
//     </div>
//     <div className="chat-input">
//       <input
//         type="text"
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Type your message here..."
//       />
//       <button onClick={handleClick}>Send</button>
//     </div>
//   </div>
// );
