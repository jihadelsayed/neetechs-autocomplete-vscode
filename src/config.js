const fs = require('fs');
const path = require('path');

async function getApiKey(context) {
    let key = await context.secrets.get('openaiApiKey');

    if (!key && process.env.OPENAI_KEY) {
        console.log("🔄 Using OPENAI_KEY from environment");
        key = process.env.OPENAI_KEY;
    }

    if (!key) {
        const configPath = path.join(__dirname, 'neetechs.config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            key = config.openaiApiKey;
            console.log("📄 Loaded API key from neetechs.config.json");
        }
    }

    return key;
}

module.exports = { getApiKey };
