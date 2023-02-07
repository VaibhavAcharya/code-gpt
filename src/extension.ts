import * as vscode from 'vscode';

import axios from "axios";

let email: string | undefined;

// Function to check if the email has been saved or not
const checkEmail = async () => {
    if (!email) {
        // Get the user's email from the configuration
        const config = vscode.workspace.getConfiguration('Code-GPT');
        email = config.get('email');
        
        // If the email has not been saved, ask the user for their email
        if (!email) {
            email = await vscode.window.showInputBox({
                title: "Code-GPT",
                placeHolder: '📧 Enter your email',
                prompt: "To protect us from unlimited use. We won't spam your email, promise. 🤝",
                validateInput: (value) => {
                    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    if (!emailRegex.test(value)) {
                        return "Error: Invalid email. ☹";
                    }

                    return null;
                }
            });
            
            // Save the email in the configuration
            config.update('email', email, vscode.ConfigurationTarget.Global);
        }
    }
};

// Function to handle the selected code
const handleSelectedCode = async () => {
  // Check if the email has been saved or not
  await checkEmail();
  
  // Get the selected text
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    if (email) {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const lang = editor.document.languageId;

        if (selectedText.length) {
            // Send the selected code and email to the API
            try {
                const { data } = await axios.post('https://www.aiproducttools.com/api/codegpt', {
                    email,
                    input: selectedText,
                    lang
                });

                if (data.output) {    
                    // Get the output from the API response
                    const output = data.output.trim();

                    // Replace the selected text with the output
                    editor.edit(editBuilder => {
                        editBuilder.insert(selection.start, `${output}\n`);
                    });
                } else {
                    vscode.window.showWarningMessage("Server sent nothing! 🙃");
                }
            } catch (error) {
                console.error(error);
                vscode.window.showErrorMessage("Error: Unable to connect to server! 💀");
            }
        } else {
            vscode.window.showWarningMessage("Nothing selected. 😅");
        }
    } else {
        vscode.window.showErrorMessage("Error: Email is required! It is to protect us from unlimited use. We won't spam your email, promise. 🤝");
    }
  } else {
    vscode.window.showErrorMessage("Error: Editor not found! 😵");
  }
};

// Register the "Explain Selected Code" command
export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.explainSelectedCode', handleSelectedCode));
}

// Deactivate the extension
export function deactivate() {
    return null;
}
