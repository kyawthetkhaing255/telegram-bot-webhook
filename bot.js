require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!TOKEN)
{
    console.error('BOT_TOKEN missing in .env');
    process.exit(1);
}

const API =
    `https://api.telegram.org/bot${TOKEN}`;






// setting webhook
async function setWebhook(publicUrl)
{
    const res =
        await fetch(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook`,
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: `${publicUrl}/webhook`
                })
            }
        );

    const data = await res.json();

    console.log('[WEBHOOK]', data);
}



/*
 * Send Telegram Message
 */
async function sendMessage(chatId, text)
{
    try
    {
        const response =
            await fetch(
                `${API}/sendMessage`,
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                    {
                        chat_id: chatId,
                        text: text
                    })
                }
            );

        const data =
            await response.json();

        console.log(
            '[SEND]',
            data.ok
        );
    }
    catch(error)
    {
        console.error(
            '[SEND ERROR]',
            error.message
        );
    }
}

/*
 * Home Route
 */
app.get('/', (req, res) =>
{
    res.send('Telegram Bot Online');
});

/*
 * Telegram Webhook Route
 */
app.post('/webhook', async (req, res) =>
{
    try
    {
        const update =
            req.body;

        const message =
            update.message;

        if (!message)
        {
            return res.sendStatus(200);
        }

        const chatId =
            message.chat.id;

        const text =
            message.text || '';

        console.log(
            '[MESSAGE]',
            text
        );

        switch(text)
        {
            case '/start':

                await sendMessage(
                    chatId,
                    '🚀 Welcome to Science Tutor Bot'
                );

                break;

            case '/help':

                await sendMessage(
                    chatId,
                    '/start\n/help\n/ping'
                );

                break;

            case '/ping':

                await sendMessage(
                    chatId,
                    'Pong ✅'
                );

                break;

            default:

                await sendMessage(
                    chatId,
                    `Echo: ${text}`
                );
        }

        res.sendStatus(200);
    }
    catch(error)
    {
        console.error(error);

        res.sendStatus(500);
    }
});

/*
 * Start Server
 */
app.listen(PORT, () =>
{
    console.log(
        `Server running on port ${PORT}`
    );
});