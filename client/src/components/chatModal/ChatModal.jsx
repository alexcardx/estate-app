import "./ChatModal.scss";
import { useContext, useEffect, useState } from "react";
import apiRequest from "../../api/axios";
import ChatWindow from "../chatWindow/ChatWindow";
import { SocketContext } from "../../context/SocketContext";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../hooks/useNotificationStore";

const ChatModal = ({ isOpen, onClose, receiverId }) => {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const decrease = useNotificationStore((state) => state.decrease);

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
    const openChat = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.post("/chats/open-or-create", {
          receiverId,
        });

        if (!res.data.seenBy.includes(user.id)) {
          decrease();
        }
        setChat(res.data);
      } catch (err) {
        console.error("Failed to open chat", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) openChat();
  }, [receiverId, isOpen, decrease, user.id]);

  return (
    !loading && (
      <ChatWindow
        chat={chat}
        onClose={onClose}
        handleSubmit={handleSubmit}
        isModal
      />
    )
  );
};

export default ChatModal;
