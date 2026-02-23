// GitHub Gist配置
const gistConfig = {
  gistId: "bf89e77ac4e7b1a6c5f3608132dafa37", // Gist ID
  token: "" // 请在此处输入GitHub Token，或使用环境变量
};

// 消息存储
let messages = [];

// 从Gist加载消息
async function loadMessagesFromGist() {
  try {
    const response = await fetch(`https://api.github.com/gists/${gistConfig.gistId}`, {
      headers: {
        'Authorization': `token ${gistConfig.token}`
      }
    });
    const gist = await response.json();
    const content = gist.files['messages.json'].content;
    messages = JSON.parse(content);
  } catch (error) {
    console.error('加载消息失败:', error);
  }
}

// 保存消息到Gist
async function saveMessagesToGist() {
  try {
    await fetch(`https://api.github.com/gists/${gistConfig.gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${gistConfig.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          'messages.json': {
            content: JSON.stringify(messages, null, 2)
          }
        }
      })
    });
  } catch (error) {
    console.error('保存消息失败:', error);
  }
}