import { useState, useEffect, useRef, useContext } from "react";
import "./Chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../api/axios";
import { useNotificationStore } from "../../hooks/useNotificationStore";
import { SocketContext } from "../../context/SocketContext";
import noavatar from "../../assets/noavatar.png";
import ChatWindow from "../chatWindow/ChatWindow";
import Loader from "../loader/Loader";

const Chat = () => {
  const [chat, setChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const messageEndRef = useRef();

  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const decrease = useNotificationStore((state) => state.decrease);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);
      if (!res.data.seenBy.includes(user.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/chat/" + chat.id, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id);
      } catch (err) {
        console.log(err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket?.off("getMessage");
    };
  }, [socket, chat]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await apiRequest.get("/chats");
        setChats(res.data);
      } catch (err) {
        setError(err.message || "Failed to load chats");
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  return (
    <>
      {loading && <Loader />}
      {!loading && error && <p>Something went wrong. Please try again</p>}
      {!loading && !error && (
        <div className="chat">
          <div className="messages">
            <h1>Messages</h1>
            {chats?.map((c) => (
              <div
                className="message"
                key={c.id}
                style={{
                  backgroundColor:
                    c.seenBy.includes(user.id) || chat?.id === c.id
                      ? "white"
                      : "#fecd514e",
                }}
                onClick={() => handleOpenChat(c.id, c.receiver)}
              >
                <div className="receiver-box">
                  <img src={c.receiver.avatar || noavatar} alt="avatar" />
                  <span>{c.receiver.username}</span>
                </div>
                <p>{c.lastMessage}</p>
              </div>
            ))}
          </div>
          {chat && (
            <ChatWindow
              chat={chat}
              onClose={() => setChat(null)}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Chat;
