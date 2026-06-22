require('dotenv').config();

const express = require('express');

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!TOKEN)
{
    console.error('BOT_TOKEN missing');
    process.exit(1);
}

const API = `https://api.telegram.org/bot${TOKEN}`;

/*
 * 🌍 PUBLIC URL (SET FROM start.js OR localtunnel)
 */
let PUBLIC_URL = null;

/*
 * =========================
 * DEBUG MIDDLEWARE (IMPORTANT)
 * =========================
 */
app.use((req, res, next) =>
{
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
});

/*
 * =========================
 * SEND MESSAGE
 * =========================
 */
async function sendMessage(chatId, text, replyMarkup = null)
{
    try
    {
        const body =
        {
            chat_id: chatId,
            text
        };

        if (replyMarkup)
        {
            body.reply_markup = replyMarkup;
        }

        const res = await fetch(`${API}/sendMessage`,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        console.log('[SEND]', data.ok);
    }
    catch (err)
    {
        console.error('[SEND ERROR]', err.message);
    }
}

/*
 * =========================
 * WEB APP UI
 * =========================
 */
app.get('/webapp', (req, res) =>
{
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Science UI</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>

<body style="font-family:Arial;text-align:center;padding:20px;">

    <h1>🚀 Science Tutor UI</h1>

    <button onclick="sendData()">Send Message</button>

    // <script>
    //     Telegram.WebApp.ready();

    //     function sendData()
    //     {
    //         Telegram.WebApp.sendData("Hello from WebApp");
    //     }

// 👇 User info comes from Telegram (NOT browser)
    //     const user = Telegram.WebApp.initDataUnsafe?.user;

    //     console.log("User:", user);

    //     const userId = user?.id;
    //     const username = user?.username;

    //     console.log("ID:", userId);
    //     console.log("Username:", username);
    //     window.alert("User ID: " + userId + "\\nUsername: " + username);
    // </script>
<script>
Telegram.WebApp.ready();

function sendUser()
{
    const user = Telegram.WebApp.initDataUnsafe?.user;

    if (!user)
    {
        alert("No user data");
        return;
    }

    const payload =
    {
        id: user.id,
        username: user.username,
        first_name: user.first_name
    };

    // 🔥 Send to bot
    Telegram.WebApp.sendData(JSON.stringify(payload));
}
</script>

<button onclick="sendUser()">Send My ID</button>
</body>
</html>
    `);
});

/*
 * =========================
 * WEBHOOK
 * =========================
 */
app.post('/webhook', async (req, res) =>
{
    try
    {
        const message = req.body.message;

        if (!message)
        {
            return res.sendStatus(200);
        }

        const chatId = message.chat.id;
        const text = message.text || '';

        console.log('[MESSAGE]', text);

        switch (text)
        {
            case '/start':
                await sendMessage(chatId, '🚀 Welcome to the Science Bot!');
                break;

            case '/help':
                await sendMessage(chatId, '/start\n/help\n/ping\n/webapp');
                break;

            case '/ping':
                await sendMessage(chatId, 'Pong ✅');
                break;

            case '/webapp':

                console.log('[DEBUG] PUBLIC_URL:', PUBLIC_URL);

                if (!PUBLIC_URL)
                {
                    await sendMessage(chatId,
                        '⚠️ WebApp not ready yet (PUBLIC_URL missing)'
                    );
                    break;
                }

                await sendMessage(chatId, 'Open UI 👇',
                {
                    inline_keyboard:
                    [
                        [
                            {
                                text: 'Open WebApp',
                                web_app:
                                {
                                    url: `${PUBLIC_URL}/webapp`
                                }
                            }
                        ]
                    ]
                });

                break;

            default:
                await sendMessage(chatId, `Echo: ${text}`);
        }

        res.sendStatus(200);
        
    }
    catch (err)
    {
        console.error('[WEBHOOK ERROR]', err);
        res.sendStatus(500);
    }
    
});

/*
 * =========================
 * SET URL (FROM START SCRIPT)
 * =========================
 */
app.post('/set-url', async (req, res) =>
{
    console.log('[SET-URL HIT]', req.body);

    if (!req.body || !req.body.url)
    {
        console.log('❌ No URL received');
        return res.sendStatus(400);
    }

    PUBLIC_URL = req.body.url;

    console.log('🌍 PUBLIC_URL SET:', PUBLIC_URL);

    await setWebhook(PUBLIC_URL);

    res.sendStatus(200);
});

/*
 * =========================
 * SET WEBHOOK
 * =========================
 */
async function setWebhook(url)
{
    try
    {
        const res = await fetch(`${API}/setWebhook`,
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: `${url}/webhook`
            })
        });

        const data = await res.json();

        console.log('[WEBHOOK]', data);
    }
    catch (err)
    {
        console.error('[WEBHOOK ERROR]', err.message);
    }
}

/*
 * =========================
 * START SERVER
 * =========================
 */
app.listen(PORT, () =>
{
    console.log(`Server running on ${PORT}`);
    console.log('PUBLIC_URL currently:', PUBLIC_URL);
});