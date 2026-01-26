import ChatPage from "@/components/chat/chat-page";
import WithVerification from "@/components/common/with-verification";

export default function Chat() {
  return (
    <WithVerification>
      <ChatPage />
    </WithVerification>
  );
}
