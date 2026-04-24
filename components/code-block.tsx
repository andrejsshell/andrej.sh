"use client";

import { useMemo, useState } from "react";

type CodeBlockProps = {
  code: string;
  lang?: string;
  file?: string;
};

export function CodeBlock({ code, lang = "text", file }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => highlight(code, lang), [code, lang]);

  const onCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };

  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span className="codeblock-file">
          <span className="codeblock-dots">
            <span />
            <span />
            <span />
          </span>
          {file || lang}
        </span>
        <button
          type="button"
          className={`copybtn ${copied ? "copied" : ""}`}
          onClick={onCopy}
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

function escape(s: string) {
  return s.replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!,
  );
}

function span(cls: string, text: string) {
  return `<span class="${cls}">${escape(text)}</span>`;
}

function highlight(code: string, lang: string) {
  if (lang === "ts" || lang === "tsx" || lang === "js" || lang === "jsx") {
    return tokenize(code, [
      {
        re: /`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/,
        cls: "tok-s",
      },
      { re: /\/\/[^\n]*|\/\*[\s\S]*?\*\//, cls: "tok-c" },
      { re: /\b\d+\.?\d*\b/, cls: "tok-n" },
      {
        re: /\b(?:const|let|var|function|return|if|else|for|while|import|export|from|as|default|class|extends|new|async|await|try|catch|throw|interface|type|enum|public|private|protected|readonly|typeof|in|of|null|undefined|true|false|this|super|void|never|any|unknown)\b/,
        cls: "tok-k",
      },
      { re: /\b[a-zA-Z_$][\w$]*(?=\s*\()/, cls: "tok-f" },
    ]);
  }

  if (lang === "go") {
    return tokenize(code, [
      { re: /`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"/, cls: "tok-s" },
      { re: /\/\/[^\n]*/, cls: "tok-c" },
      { re: /\b\d+\.?\d*\b/, cls: "tok-n" },
      {
        re: /\b(?:package|import|func|return|if|else|for|range|var|const|type|struct|interface|chan|go|defer|select|switch|case|default|break|continue|map|nil|true|false)\b/,
        cls: "tok-k",
      },
      { re: /\b[a-zA-Z_][\w]*(?=\s*\()/, cls: "tok-f" },
    ]);
  }

  if (lang === "sql") {
    return tokenize(code, [
      { re: /--[^\n]*/, cls: "tok-c" },
      { re: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/, cls: "tok-s" },
      { re: /\b\d+\.?\d*\b/, cls: "tok-n" },
      {
        re: /\b(?:SELECT|FROM|WHERE|ORDER|BY|LIMIT|GROUP|HAVING|JOIN|LEFT|RIGHT|INNER|ON|AS|AND|OR|NOT|NULL|INSERT|INTO|VALUES|UPDATE|DELETE|CREATE|TABLE|INDEX|ALTER|DROP|DESC|ASC|SUM|COUNT|AVG|MAX|MIN)\b/,
        cls: "tok-k",
      },
    ]);
  }

  if (lang === "bash" || lang === "sh") {
    return tokenize(code, [
      { re: /#[^\n]*/, cls: "tok-c" },
      { re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, cls: "tok-s" },
      {
        re: /(?<=^|\s)(?:npm|pnpm|yarn|bun|go|docker|kubectl|git|curl|cd|ls|mkdir|make|brew)\b/,
        cls: "tok-k",
      },
    ]);
  }

  if (lang === "yaml" || lang === "yml") {
    return tokenize(code, [
      { re: /#[^\n]*/, cls: "tok-c" },
      { re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/, cls: "tok-s" },
      { re: /(?<=^|\n)(\s*)([\w\-.]+)(:)/, cls: "yaml-key" },
    ]);
  }

  return escape(code);
}

type Rule = { re: RegExp; cls: string };

function tokenize(code: string, rules: Rule[]) {
  const source = [
    "(",
    rules.map((r) => `(?:${r.re.source})`).join("|"),
    ")",
  ].join("");
  const master = new RegExp(source, "g");

  let out = "";
  let last = 0;
  for (const match of code.matchAll(master)) {
    const idx = match.index;
    if (idx > last) out += escape(code.slice(last, idx));
    const text = match[0];
    const rule = rules.find((r) => new RegExp(`^(?:${r.re.source})$`).test(text));
    if (!rule) {
      out += escape(text);
    } else if (rule.cls === "yaml-key") {
      const m = /^(\s*)([\w\-.]+)(:)/.exec(text);
      if (m) {
        out +=
          escape(m[1]) +
          span("tok-t", m[2]) +
          span("tok-p", m[3]);
      } else {
        out += escape(text);
      }
    } else {
      out += span(rule.cls, text);
    }
    last = idx + text.length;
  }
  if (last < code.length) out += escape(code.slice(last));
  return out;
}
