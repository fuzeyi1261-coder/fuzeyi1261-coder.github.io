// GitHub Gist配置
const gistConfig = {
  gistId: "bf89e77ac4e7b1a6c5f3608132dafa37", // Gist ID
  token: "" // 初始化为空，将在浏览器中设置
};

// 从本地存储加载Token
function loadTokenFromLocalStorage() {
  const savedToken = localStorage.getItem('githubToken');
  if (savedToken) {
    gistConfig.token = savedToken;
    return true;
  }
  return false;
}

// 保存Token到本地存储
function saveTokenToLocalStorage(token) {
  localStorage.setItem('githubToken', token);
  gistConfig.token = token;
}

// 检查Token是否已设置
function checkToken() {
  if (!gistConfig.token) {
    return loadTokenFromLocalStorage();
  }
  return true;
}

// 消息存储
let messages = [];

// 从Gist加载消息
async function loadMessagesFromGist() {
  console.log('=== 开始从Gist加载消息 ===');
  try {
    // 确保Token已设置
    if (!gistConfig.token) {
      const savedToken = localStorage.getItem('githubToken');
      if (savedToken) {
        gistConfig.token = savedToken;
        console.log('从localStorage加载Token');
      } else {
        throw new Error('GitHub Token未设置');
      }
    }
    console.log('Token已设置:', gistConfig.token.substring(0, 20) + '...');
    console.log('Gist ID:', gistConfig.gistId);
    
    // 调用GitHub API
    console.log('开始调用GitHub API...');
    const response = await fetch(`https://api.github.com/gists/${gistConfig.gistId}`, {
      headers: {
        'Authorization': `token ${gistConfig.token}`
      }
    });
    
    console.log('GitHub API响应状态:', response.status);
    if (!response.ok) {
      throw new Error(`GitHub API请求失败: ${response.status}`);
    }
    
    // 解析响应
    const gist = await response.json();
    console.log('Gist文件:', Object.keys(gist.files));
    
    if (!gist.files['messages.json']) {
      throw new Error('Gist中不存在messages.json文件');
    }
    
    const content = gist.files['messages.json'].content;
    console.log('messages.json内容长度:', content.length);
    console.log('messages.json内容前50字符:', content.substring(0, 50) + (content.length > 50 ? '...' : ''));
    
    // 解析消息
    messages = JSON.parse(content);
    console.log('加载的消息数量:', messages.length);
    
    // 打印每条消息的摘要
    messages.forEach((msg, index) => {
      console.log(`消息${index + 1}:`, msg.type, '-', msg.content.substring(0, 30) + (msg.content.length > 30 ? '...' : ''));
    });
    
  } catch (error) {
    console.error('加载消息失败:', error);
    throw error;
  } finally {
    console.log('=== 从Gist加载消息完成 ===');
  }
}

// 保存消息到Gist
async function saveMessagesToGist() {
  try {
    if (!checkToken()) {
      throw new Error('GitHub Token未设置');
    }
    
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
    throw error;
  }
}