import React, { useState, useRef } from 'react';
import OpenAI from 'openai';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TextField from '@mui/material/TextField';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import { deepOrange, green } from '@mui/material/colors';
/**
 * 基于reactjs开发的机器人模拟聊天页面
  create-react-app
  全部使用Function Components (Hooks)，避免使用Class Components
  Material UI
  Typescript
  OpenRouter的mistral-7b-instruct:free model
 */
const OPENROUTER_API_KEY = 'your self key';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: OPENROUTER_API_KEY,
  defaultHeaders: {
    // "HTTP-Referer": $YOUR_SITE_URL, // Optional, for including your app on openrouter.ai rankings.
    // "X-Title": $YOUR_SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
  },
  dangerouslyAllowBrowser: true,
});

const Chat = () => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  
  const sendMessage = async (event) => {
    event.preventDefault();
    const message = event.target[0].value;
    if (message === '' || message === undefined) return;
    setMessageHistory((prevHistory) => [...prevHistory, { role: 'user', content: message }])
    setLoading(true);
    try {
      const response = await openai.chat.completions.create({
        model: 'mistralai/mistral-7b-instruct:free', // 使用的模型
        messages: [{ role: 'user', content: message }],
      });

      const botMessage = response.choices[0].message;
      setMessageHistory((prevHistory) => [...prevHistory, { role: 'robot', content: botMessage.content }])
      setLoading(false);
      inputRef.current.querySelector('input').value = '';
      // setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
      // setInputMessage('');
    }
  };


  return (
    <div style={{ margin: '0 20px', position: 'relative', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <List style={{ flex: 1, overflowY: 'auto' }}>
        {messageHistory.map((message, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemAvatar>
              {message.role === 'user' ?
                <Avatar sx={{ bgcolor: deepOrange[500] }}>
                  <AccountCircleSharpIcon color="#fff" />
                </Avatar> :
                <Avatar sx={{ bgcolor: green[500] }}><AssignmentIcon /></Avatar>
              }
            </ListItemAvatar>
            <ListItemText primary={message.role === 'user' ? 'You' : 'robot'} secondary={message.content} />
          </ListItem>
        ))}
      </List>
      <form onSubmit={sendMessage} style={{ height: 56, marginBottom: 20 }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <TextField
            id="outlined-basic"
            label=""
            placeholder="message ChatGPT"
            style={{ width: '100%' }}
            ref={inputRef}
          />
          {loading ?
            <LoadingButton
              loading variant="outlined"
              style={{ position: 'absolute', right: 10, border: 0, width: 40, height: 40, minWidth: 40 }}>

            </LoadingButton> :
            <IconButton
              aria-label="send"
              type='submit'
              style={{ position: 'absolute', right: 10, borderRadius: 0 }}
            >
              <ArrowUpwardIcon />
            </IconButton>
          }
        </div>
      </form>
    </div>
  );
};

export default Chat;