import { type ExtensionContext, window } from "vscode";

export const checkEmail = async (context: ExtensionContext) => {
    const email = await context.globalState.get("email");

    // If the email has not been saved, ask the user for their email
    if (!email) {
        const newEmail = await window.showInputBox({
            title: "Code-GPT",
            placeHolder: "📧 Enter your email",
            prompt: "To protect us from unlimited use. We won't spam your email, promise. 🤝",
            validateInput: (value) => {
                const emailRegex =
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (!emailRegex.test(value)) {
                    return "Error: Invalid email. ☹";
                }

                return null;
            },
        });

        await context.globalState.update("email", newEmail);
    }
};
