const singleLineCommentMap: Record<string, string> = {
    abap: "--",
    bat: "::",
    bibtex: "%",
    clojure: ";",
    coffeescript: "#",
    c: "//",
    cpp: "//",
    csharp: "//",
    "cuda-cpp": "//",
    diff: "//",
    dockerfile: "#",
    fsharp: "//",
    "git-commit": "#",
    "git-rebase": "#",
    go: "//",
    groovy: "//",
    ini: ";",
    java: "//",
    javascript: "//",
    javascriptreact: "//",
    json: "//",
    jsonc: "//",
    latex: "%",
    less: "/*",
    lua: "--",
    makefile: "#",
    objectivec: "//",
    objectivecpp: "//",
    perl: "#",
    perl6: "#",
    php: "//",
    plaintext: "//",
    powershell: "#",
    jade: "//",
    pug: "//",
    python: "#",
    r: "#",
    razor: "@*",
    ruby: "#",
    rust: "//",
    sass: "//",
    shaderlab: "//",
    shellscript: "#",
    sql: "--",
    slim: "//",
    stylus: "//",
    swift: "//",
    typescript: "//",
    typescriptreact: "//",
    tex: "%",
    vb: "'",
    yaml: "#",
};

const multiLineCommentMap: Record<string, [string, string]> = {
    css: ["/*", "*/"],
    handlebars: ["{{!--", "--}}"],
    html: ["<!--", "-->"],
    markdown: ["<!--", "-->"],
    scss: ["/*", "*/"],
    xml: ["<!--", "-->"],
    xsl: ["<!--", "-->"],
};

export const styleAsComment = (text: string, lang: string) => {
    const singleLineComment = singleLineCommentMap[lang];
    const multiLineComment = multiLineCommentMap[lang];

    if (!singleLineComment && !multiLineComment) return text;

    if (singleLineComment) return `${singleLineComment} ${text}`;
    if (multiLineComment) return `${multiLineComment[0]} ${text} ${multiLineComment[1]}`;
};

export const languageSupportsComments = (lang: string) => {
    return !!singleLineCommentMap[lang] || !!multiLineCommentMap[lang];
};
