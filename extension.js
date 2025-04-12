// File: extension.js
const vscode = require('vscode');
const fetch = require('node-fetch');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand('neetechs-autocomplete.configureApiKey', async () => {
        const key = await vscode.window.showInputBox({ prompt: 'Enter your OpenAI API Key', ignoreFocusOut: true, password: true });
        if (key) {
            await context.secrets.store('openaiApiKey', key);
            vscode.window.showInformationMessage('OpenAI API key saved.');
        }
    });

    const provider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: '*' },
        {
            
            async provideCompletionItems(document, position) {
                console.log("🚀 Autocomplete triggered at", new Date().toISOString());

                const apiKey = await context.secrets.get('openaiApiKey');
                if (!apiKey) {
                    vscode.window.showErrorMessage('Please configure your OpenAI API key.');
                    return;
                }

                const range = new vscode.Range(
                    Math.max(0, position.line - 10),
                    0,
                    position.line,
                    position.character
                );

                const codeContext = document.getText(range);
                console.log('📄 Code context:', codeContext);

                try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4',
                            messages: [
                                { role: 'system', content: 'You are a coding assistant that helps autocomplete code.' },
                                { role: 'user', content: `Continue this code:\n\n${codeContext}` }
                            ],
                            max_tokens: 100,
                            temperature: 0.5
                        })
                    });

                    const result = await response.json();
                    console.log('🤖 GPT-4 response:', result);

                    const text = result.choices?.[0]?.message?.content?.trim();

                    if (text) {
                        const item = new vscode.CompletionItem(text.split('\n')[0], vscode.CompletionItemKind.Snippet);
                        item.insertText = new vscode.SnippetString(text);
                        return [item];
                    }
                } catch (err) {
                    vscode.window.showErrorMessage(`OpenAI API Error: ${err.message}`);
                    console.error('❌ API Error:', err);
                }
            }
        }, '.', '(', '{', '=', ':'// more triggers
    );

    context.subscriptions.push(disposable, provider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
