import { type ExtensionContext, window, commands } from "vscode";
import axios from "axios";

import { checkEmail } from "./utils/email";
import { displayError } from "./utils/errors";
import { languageSupportsComments, styleAsComment } from "./utils/comments";

// Function to handle the selected code
const commentSelectedCode = async (context: ExtensionContext) => {
    // Check if the email has been saved or not
    await checkEmail(context);
    const email = await context.globalState.get("email");
    if (!email) return displayError("noEmail");

    // Grab the editor window
    const editor = window.activeTextEditor;
    if (!editor) return displayError("noEditor");

    // Aquire the selected text
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (!selectedText.length) return displayError("noSelection");

    const lang = editor.document.languageId;
    const isLanguageSupported = languageSupportsComments(lang);
    if (!isLanguageSupported) return displayError("languageNotSupported");

    // Send the selected code and email to the API
    try {
        const { data } = await axios.post("https://www.aiproducttools.com/api/codegpt", {
            email,
            input: selectedText,
            lang,
        });

        if (!data.output) return displayError("serverSentNothing");

        // Get the output from the API response
        const output = data.output.trim();

        // Wrap the output in a comment
        const comment = styleAsComment(output, lang);

        // Replace the selected text with the output
        editor.edit((editBuilder) => {
            editBuilder.insert(selection.start, `${comment}\n`);
        });
    } catch (error) {
        console.error(error);
        return displayError("unableToConnect");
    }
};

// Function to handle the selected code
const explainSelectedCode = async (context: ExtensionContext) => {
    // Check if the email has been saved or not
    await checkEmail(context);
    const email = await context.globalState.get("email");
    if (!email) return displayError("noEmail");

    // Grab the editor window
    const editor = window.activeTextEditor;
    if (!editor) return displayError("noEditor");

    // Aquire the selected text
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    if (!selectedText.length) return displayError("noSelection");

    const lang = editor.document.languageId;
    const isLanguageSupported = languageSupportsComments(lang);
    if (!isLanguageSupported) return displayError("languageNotSupported");

    // Send the selected code and email to the API
    try {
        const { data } = await axios.post("https://www.aiproducttools.com/api/codegpt", {
            email,
            input: selectedText,
            lang,
        });

        if (!data.output) return displayError("serverSentNothing");

        // Get the output from the API response
        const output = data.output.trim();

        // Show the output in a message
        window.showInformationMessage(output)
        
    } catch (error) {
        console.error(error);
        return displayError("unableToConnect");
    }
};

// Register the "Explain Selected Code" command
export function activate(context: ExtensionContext) {
    const registerComment = commands.registerCommand("extension.commentSelectedCode", () => commentSelectedCode(context));
    const registerExplain = commands.registerCommand("extension.explainSelectedCode", () => explainSelectedCode(context));
    context.subscriptions.push(registerComment);
    context.subscriptions.push(registerExplain);
}

// Deactivate the extension
export function deactivate() {
    return null;
}
