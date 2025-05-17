import "./ChatWindow.scss";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useRef } from "react";
import noavatar from "../../assets/noavatar.png";

const ChatWindow = ({ chat, onClose, handleSubmit, isModal }) => {
  const { user } = useContext(AuthContext);

  const messageEndRef = useRef();

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  return (
    <div className={`chatBox ${isModal ? "modal" : ""}`}>
      <div className="top">
        <div className="user">
          <img src={chat.receiver.avatar || noavatar} alt="avatar" />
          {chat.receiver.username}
        </div>
        <span className="close" onClick={onClose}>
          X
        </span>
      </div>
      <div className="center">
        {chat.messages.map((message) => (
          <div
            className={`chatMessage ${message.userId === user.id ? "own" : ""}`}
            key={message.id}
          >
            {message.userId !== user.id && (
              <img
                src={chat.receiver.avatar || noavatar}
                alt="avatar"
                className="avatar"
              />
            )}
            {message.userId === user.id && (
              <img
                src={user.avatar || noavatar}
                alt="avatar"
                className="avatar"
              />
            )}
            <div className="textContent">
              <p>{message.text}</p>
              <span>{format(message.createdAt)}</span>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <form onSubmit={handleSubmit} className="bottom">
        <textarea name="text"></textarea>
        <button>Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;
