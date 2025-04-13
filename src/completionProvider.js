const vscode = require("vscode");
const fetch = require("node-fetch");
const { getApiKey } = require("./config");

function createCompletionProvider(context) {
  return vscode.languages.registerCompletionItemProvider(
    { scheme: "file", language: "*" },
    {
      async provideCompletionItems(document, position) {
        const apiKey = await getApiKey(context);
        console.log("🔍 Retrieved API key:", apiKey ? "[HIDDEN]" : "❌ Not set");

        if (!apiKey) {
          const alreadyShown = context.globalState.get("apiKeyMissingShown");
          if (!alreadyShown) {
            vscode.window
              .showErrorMessage("❌ No OpenAI API Key set.", "Configure Now")
              .then((choice) => {
                if (choice === "Configure Now") {
                  vscode.commands.executeCommand("neetechs-autocomplete.configureApiKey");
                }
              });
            context.globalState.update("apiKeyMissingShown", true);
          }
          return;
        }

        // 🧠 Send the full code + line position to GPT
        const fullCode = document.getText();
        const targetLine = position.line + 1;

        const userPrompt = `Here is my code:\n\n${fullCode}\n\nPlease suggest a continuation or improvement starting at line ${targetLine}. Only respond with the suggested code — no explanation.`;

        try {
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: context.globalState.get("selectedModel") || "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    "You are a coding assistant that gives precise suggestions for improving or continuing code at a specific line.",
                },
                { role: "user", content: userPrompt },
              ],
              max_tokens: 500,
              temperature: 0.5,
            }),
          });

          if (response.status === 401 || response.status === 429) {
            vscode.window.showErrorMessage(
              "🔁 API call failed: expired token or rate limit. Try again later."
            );
            return;
          }

          const result = await response.json();
          if (result.error) {
            const message = result.error.message || "Unknown error";
            vscode.window.showErrorMessage(`❌ OpenAI Error: ${message}`);
            return;
          }

          let text = result.choices?.[0]?.message?.content?.trim();

          if (text?.startsWith("```")) {
            text = text.replace(/```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
          }

          if (text) {
            const firstLine = text.split("\n").find((line) => line.trim() !== "");
            const item = new vscode.CompletionItem(
              firstLine?.replace(/^["']|["']$/g, ""),
              vscode.CompletionItemKind.Snippet
            );
            item.insertText = new vscode.SnippetString(text);
            return [item];
          } else {
            vscode.window.showWarningMessage("⚠️ GPT returned no suggestion.");
          }
        } catch (err) {
          vscode.window.showErrorMessage(`❌ Error: ${err.message}`);
        }
      },
    },
    ".", "(", "{", "=", ":"
  );
}

module.exports = { createCompletionProvider };
