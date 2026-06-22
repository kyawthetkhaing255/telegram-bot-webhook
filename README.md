# 🤖 Telegram Bot Webhook

A modern Telegram bot built with **Node.js** and **Telegram Webhooks**.

![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Platform](https://img.shields.io/badge/Platform-Linux-orange)

---

## ✨ Features

* 🚀 Fast webhook-based updates
* 🤖 Telegram Bot API integration
* 🔒 Environment variable configuration
* 📡 Express.js server
* 🛠 Easy deployment
* 📦 Simple project structure

---

## 📂 Project Structure

```text
telegram-bot-webhook/
│
├── src/
│   bot.js
├── .env
├── package.json
├── README.md
└── server.js
```

---

## 🛠 Requirements

* Node.js 20+
* npm
* Telegram Bot Token

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/telegram-bot-webhook.git
cd telegram-bot-webhook
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file:

```env
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
PORT=3000
```

---

## 🚀 Running the Bot

Development mode:

```bash
node start.js
```

Production mode:

```bash
npm start
```

---

## 🌐 Setting the Webhook

```bash
curl -X POST \
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
-d "url=https://your-domain.com/webhook"
```

---

## 📜 Example Commands

| Command | Description    |
| ------- | -------------- |
| /start  | Start the bot  |
| /help   | Show help menu |
| /about  | About the bot  |

---

## 📸 Screenshot

Add screenshots here:

```text
docs/images/bot.png
```

---

## 🤝 Contributing

Pull requests are welcome.

For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Kyaw Thet Khaing**

* GitHub: https://github.com/kyawthetkhaing255

⭐ If you found this project useful, please give it a star.
