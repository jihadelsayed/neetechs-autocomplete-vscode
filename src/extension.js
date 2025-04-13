const vscode = require('vscode');
const { registerCommands } = require('./commands');
const { createCompletionProvider } = require('./completionProvider');
const { getApiKey } = require('./config');

async function activate(context) {
    const commands = registerCommands(context);
    const provider = createCompletionProvider(context);

    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBar.text = `$(zap) Neetechs AI`;
    statusBar.tooltip = 'Click to configure API key';
    statusBar.command = 'neetechs-autocomplete.configureApiKey';
    statusBar.show();
    context.subscriptions.push(statusBar);

    if (!context.globalState.get('neetechsShownWelcome')) {
        vscode.window.showInformationMessage("👋 Welcome to Neetechs Autocomplete! Use Ctrl+Shift+Space or start typing to get code suggestions.");
        context.globalState.update('neetechsShownWelcome', true);
    }
    
    console.log("🟡 Neetechs: Extension activated");


      

    context.subscriptions.push(...commands, provider);
}

function deactivate() {}

module.exports = { activate, deactivate };
