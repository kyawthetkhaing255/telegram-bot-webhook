require('dotenv').config();

const express = require('express');

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

const API =
    `https://api.telegram.org/bot${TOKEN}`;

/*
 * Send message helper
 */
async function sendMessage(chatId, text)
{
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
}

/*
 * Telegram webhook handler
 */
app.post('/webhook', async (req, res) =>
{
    const message =
        req.body.message;

    if (!message)
    {
        return res.sendStatus(200);
    }

    const chatId =
        message.chat.id;

    const text =
        message.text || '';

    console.log('[MESSAGE]', text);

    if (text === '/start')
    {
        await sendMessage(chatId, 'Welcome 🚀 Render Bot is live!');
    }
    else if (text === '/help')
    {
        await sendMessage(chatId, '/start\n/help\n/ping');
    }
    else if (text === '/ping')
    {
        await sendMessage(chatId, 'Pong ✅');
    }
    else
    {
        await sendMessage(chatId, `Echo: ${text}`);
    }

    res.sendStatus(200);
});

/*
 * Health check route (Render needs this sometimes)
 */
app.get('/', (req, res) =>
{
    res.send('Bot is running');
});

/*
 * Start server
 */
app.listen(PORT, async () =>
{
    console.log('Bot server running on port', PORT);

    /*
     * Set webhook automatically after deploy
     */
    const RENDER_URL =
        process.env.RENDER_EXTERNAL_URL;

    if (RENDER_URL)
    {
        const webhookURL =
            `${RENDER_URL}/webhook`;

        await fetch(
            `${API}/setWebhook?url=${webhookURL}`
        );

        console.log('Webhook set to:', webhookURL);
    }
});