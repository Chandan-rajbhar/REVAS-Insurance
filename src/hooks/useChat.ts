import { useAppStore } from '../store/context';

export function useChat() {
  const { state, sendChatWithAutoReply } = useAppStore();

  return {
    messages: state.chatMessages,
    sendMessage: sendChatWithAutoReply,
  };
}
