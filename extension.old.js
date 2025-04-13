const vscode = require('vscode');
const fetch = require('node-fetch');
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

function activate(context) {
    const disposable = vscode.commands.registerCommand('neetechs-autocomplete.configureApiKey', async () => {
        const key = await vscode.window.showInputBox({
            prompt: 'Enter your OpenAI API Key',
            ignoreFocusOut: true,
            password: true
        });
        if (key) {
            await context.secrets.store('openaiApiKey', key);
            vscode.window.showInformationMessage('✅ OpenAI API key saved.');
        }
    });
    const selectModel = vscode.commands.registerCommand('neetechs-autocomplete.selectModel', async () => {
        const model = await vscode.window.showQuickPick(['gpt-3.5-turbo', 'gpt-4'], {
          placeHolder: 'Select the OpenAI model to use for autocompletion'
        });
      
        if (model) {
          await context.globalState.update('selectedModel', model);
          vscode.window.showInformationMessage(`✅ Model set to ${model}`);
        }
      });
      

    const provider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: '*' },
        {
            async provideCompletionItems(document, position) {
                const apiKey = await getApiKey(context);
                if (!apiKey) {
                    vscode.window.showErrorMessage('❌ Missing OpenAI API Key. Run: Neetechs: Configure OpenAI API Key');
                    return;
                }

                const range = new vscode.Range(
                    Math.max(0, position.line - 10), 0,
                    position.line, position.character
                );
                const codeContext = document.getText(range);

                console.log("📤 Sending request to OpenAI API...");

                try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: context.globalState.get('selectedModel') || 'gpt-3.5-turbo',
                            messages: [
                                { role: 'system', content: 'You are a coding assistant that helps autocomplete code.' },
                                { role: 'user', content: `Continue this code:\n\n${codeContext}` }
                            ],
                            max_tokens: 100,
                            temperature: 0.5
                        })
                    });

                    console.log("✅ Got response from OpenAI");

                    const result = await response.json();
                    console.log("📦 Raw GPT API response:", JSON.stringify(result, null, 2));
                    
                    // ✅ Show user-friendly OpenAI error if present
                    if (result.error) {
                        const code = result.error.code || "unknown_error";
                        const message = result.error.message || "Unknown error from OpenAI";
                    
                        if (code === "insufficient_quota") {
                            vscode.window.showErrorMessage("💸 You’ve exceeded your OpenAI quota. Visit https://platform.openai.com/account/billing to resolve.");
                        } else if (code === "model_not_found") {
                            vscode.window.showErrorMessage("❌ Selected model not found. Try switching to `gpt-3.5-turbo`.");
                        } else {
                            vscode.window.showErrorMessage(`OpenAI Error: ${message}`);
                        }
                    
                        console.error("❌ OpenAI API Error:", result.error);
                        return;
                    }
                    
                    // ✅ Continue if response is valid
                    const text = result.choices?.[0]?.message?.content?.trim();
                    
                    if (text) {
                        console.log("💡 GPT Suggestion:", text);
                        const item = new vscode.CompletionItem(text.split('\n')[0], vscode.CompletionItemKind.Snippet);
                        item.insertText = new vscode.SnippetString(text);
                        return [item];
                    } else {
                        console.warn("⚠️ GPT returned no text.");
                        vscode.window.showWarningMessage("⚠️ GPT returned no suggestion.");
                    }
                    
                } catch (err) {
                    console.error("❌ GPT Request Error:", err);
                    vscode.window.showErrorMessage(`Error: ${err.message}`);
                }
            }
        },
        '.', '(', '{', '=', ':'
    );

    context.subscriptions.push(disposable, provider, selectModel);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
