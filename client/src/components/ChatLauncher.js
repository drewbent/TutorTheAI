import React from 'react';
import { Launcher } from '../react-chat-window/lib/index.js';
import logo from './images/logo.png';

export default function ChatLauncher(props) {
  return (
    <Launcher
      agentProfile={{
        teamName: 'Tutor the AI',
        imageUrl: { logo }
      }}
      onMessageWasSent={ handleUserMessage }
      handleClick={ handleLauncherClick }
      messageList={ messageList }
      newMessagesCount={ newMessagesCount }
      isOpen={ isChatOpen } />
  );
}