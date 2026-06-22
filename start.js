// const { spawn } = require('child_process');
// const fs = require('fs');
// require('dotenv').config();

// console.log('🤖 Starting bot first...');

// /*
//  * STEP 1: Start BOT FIRST
//  */
// const bot = spawn('node', ['hack.js'], {
//     stdio: 'inherit'
// });

// console.log('🚀 Bot is running...');

// /*
//  * STEP 2: Start LocalTunnel AFTER bot
//  */
// setTimeout(() =>
// {
//     console.log('🌍 Starting LocalTunnel...');

//     const lt =
//         spawn('lt', ['--port', '3000'], {
//             stdio: ['pipe', 'pipe', 'pipe']
//         });

//     let tunnelUrl = '';

//     lt.stdout.on('data', (data) =>
//     {
//         const text = data.toString();
//         console.log('[LT]', text.trim());

//         const match =
//             text.match(/https:\/\/[a-zA-Z0-9-]+\.loca\.lt/);

//         if (match && !tunnelUrl)
//         {
//             tunnelUrl = match[0];

//             console.log('🌍 Tunnel URL:', tunnelUrl);

//             /*
//              * STEP 3: Update .env
//              */
//             let env =
//                 fs.existsSync('.env')
//                     ? fs.readFileSync('.env', 'utf8')
//                     : '';

//             env =
//                 env
//                     .split('\n')
//                     .filter(line => !line.startsWith('PUBLIC_URL='))
//                     .join('\n');

//             env += `\nPUBLIC_URL=${tunnelUrl}\n`;

//             fs.writeFileSync('.env', env.trim());

//             console.log('💾 .env updated');

//             console.log('⚠️ Restart bot or reload webhook manually');
//         }
//     });

//     lt.stderr.on('data', (data) =>
//     {
//         console.error('[LT ERROR]', data.toString());
//     });

// }, 2000);












const { spawn } = require('child_process');
const axios = require('axios');

console.log('🤖 Starting bot first...');

/*
 * STEP 1: Start bot
 */
spawn('node', ['hack.js'], {
    stdio: 'inherit'
});

console.log('🚀 Bot is running...');

/*
 * STEP 2: Start LocalTunnel
 */
setTimeout(async () =>
{
    console.log('🌍 Starting LocalTunnel...');

    const lt = spawn('lt', ['--port', '3000'], {
        stdio: ['pipe', 'pipe', 'pipe']
    });

    let tunnelUrl = '';

    lt.stdout.on('data', async (data) =>
    {
        const text = data.toString();

        console.log('[LT]', text.trim());

        const match =
            text.match(/https:\/\/[a-zA-Z0-9-]+\.loca\.lt/);

        if (match && !tunnelUrl)
        {
            tunnelUrl = match[0];

            console.log('🌍 Tunnel URL:', tunnelUrl);

            /*
             * STEP 3: SEND URL TO BOT (IMPORTANT FIX)
             */
            try
            {
                await axios.post('http://localhost:3000/set-url',
                {
                    url: tunnelUrl
                });

                console.log('✅ URL sent to bot');
            }
            catch (err)
            {
                console.error('❌ Failed to send URL:', err.message);
            }
        }
    });

    lt.stderr.on('data', (data) =>
    {
        console.error('[LT ERROR]', data.toString());
    });

}, 2000);