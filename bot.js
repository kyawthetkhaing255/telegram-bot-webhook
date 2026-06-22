require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!TOKEN)
{
    console.error('BOT_TOKEN is missing');
    process.exit(1);
}

const API =
    `https://api.telegram.org/bot${TOKEN}`;

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

app.get('/', (req, res) =>
{
    res.send('Telegram Bot Running');
});

app.post('/webhook', async (req, res) =>
{
    try
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

        console.log(text);

        if (text === '/start')
        {
            await sendMessage(
                chatId,
                'Welcome to Science Tutor Bot 🚀'
            );
        }
        else if (text === '/ping')
        {
            await sendMessage(
                chatId,
                'Pong!'
            );
        }
        else
        {
            await sendMessage(
                chatId,
                `Echo: ${text}`
            );
        }

        res.sendStatus(200);
    }
    catch (error)
    {
        console.error(error);
        res.sendStatus(500);
    }
});

app.listen(PORT, () =>
{
    console.log(
        `Server running on port ${PORT}`
    );
});