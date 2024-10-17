import axios from 'axios';

const API_URL = 'https://api.deepseek.com/chat/completions';

export const sendMessageToDeepSeek = async (messages) => {
  try {
    const response = await axios.post(API_URL, {
      model: 'deepseek-chat',
      messages: messages,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.VUE_APP_DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error; // 重新抛出错误以便在调用处处理
  }
};
