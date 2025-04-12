# Neetechs AI Autocompletion

⚡ **Lightweight GPT-based code suggestions right in VS Code — powered by your own OpenAI API key.**

---

## ✨ Features

- 🔍 Autocomplete code intelligently using **GPT-3.5 or GPT-4**
- 🧠 Context-aware suggestions from the last 10 lines
- ⚙️ Works with all languages
- 🔐 Secure: uses your personal OpenAI API key (stored locally)
- 🖱️ Trigger on `.`, `(`, `{`, `=`, `:` or manually with `Ctrl + Space`
- 🔄 Switch between `gpt-3.5-turbo` and `gpt-4` anytime

---

## 🚀 How to Use

1. Press `Ctrl+Shift+P` → `Neetechs: Configure OpenAI API Key`
2. Paste your key from [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
3. *(Optional)* Run `Neetechs: Select OpenAI Model` to choose between `gpt-3.5-turbo` or `gpt-4`
4. Start typing — suggestions will appear when you trigger

---

## 🛠️ Requirements

- ✅ OpenAI API key  
  - GPT-4 access is optional, GPT-3.5 works out of the box
- ✅ Node.js installed (for running in development mode)
- ✅ VS Code 1.75.0+

---

## 🔐 Privacy

Your API key is securely stored using VS Code’s internal secrets storage.  
🛡️ No data is shared — completions are sent directly to OpenAI’s API.

---

## 🧪 Development / Testing Locally

```bash
npm install
code .
# Press F5 to run Extension Dev Host

<pre lang="markdown"> ### 🧩 Optional config file (auto-load API key in dev) Create a file named: ``` neetechs.config.json ``` In the root of your extension (next to `extension.js`) with this content: ```json { "openaiApiKey": "sk-your-api-key-here" } ``` ✅ This allows you to skip re-entering the key during development. 📌 Make sure to add it to your `.gitignore`: ``` neetechs.config.json ``` </pre>

---

## 📞 Support

For help or feedback: [support@neetechs.com](mailto:support@neetechs.com)

---

> Made with ❤️ by [Neetechs](https://neetechs.com)

### 🌍 Follow Neetechs

[![Facebook](https://raw.githubusercontent.com/jihadelsayed/Neetechs/main/icons/icon-facebook.svg)](https://facebook.com/neetechs0)
[![X](https://raw.githubusercontent.com/jihadelsayed/Neetechs/main/icons/icon-twitter.svg)](https://x.com/neetechs)
[![Instagram](https://raw.githubusercontent.com/jihadelsayed/Neetechs/main/icons/icon-instagram.svg)](https://instagram.com/neetechs)
[![LinkedIn](https://raw.githubusercontent.com/jihadelsayed/Neetechs/main/icons/icon-linkedin.svg)](https://linkedin.com/company/neetechs)
[![YouTube](https://raw.githubusercontent.com/jihadelsayed/Neetechs/main/icons/icon-youtube.svg)](https://youtube.com/@neetechs)
[![GitHub](https://raw.githubusercontent.com/jihadelsayed/Neetechs/main/icons/icon-github.svg)](https://github.com/jihadelsayed)
[![Pinterest](https://raw.githubusercontent.com/jihadelsayed/Neetechs/main/icons/icon-pinterest.svg)](https://pinterest.com/neetechs)
[![TikTok](https://raw.githubusercontent.com/jihadelsayed/Neetechs/main/icons/icon-tiktok.svg)](https://tiktok.com/@neetechs)
