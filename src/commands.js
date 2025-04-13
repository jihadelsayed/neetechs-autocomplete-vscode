const vscode = require('vscode');

function registerCommands(context) {
    const configureKeyCmd = vscode.commands.registerCommand('neetechs-autocomplete.configureApiKey', async () => {
        const key = await vscode.window.showInputBox({
            prompt: 'Enter your OpenAI API Key',
            ignoreFocusOut: true,
            password: true,
            value: process.env.OPENAI_KEY || ''
        });
        if (key) {
            await context.secrets.store('openaiApiKey', key);
            vscode.window.showInformationMessage('✅ OpenAI API key saved.');
        }
    });

    const selectModelCmd = vscode.commands.registerCommand('neetechs-autocomplete.selectModel', async () => {
        const model = await vscode.window.showQuickPick(['gpt-3.5-turbo', 'gpt-4'], {
            placeHolder: 'Select the OpenAI model to use for autocompletion'
        });

        if (model) {
            await context.globalState.update('selectedModel', model);
            vscode.window.showInformationMessage(`✅ Model set to ${model}`);
        }
    });

    return [configureKeyCmd, selectModelCmd];
}

module.exports = { registerCommands };
