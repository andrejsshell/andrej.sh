import type { MDXComponents } from "mdx/types";
import type { ReactElement, ReactNode } from "react";
import { CodeBlock } from "@/components/code-block";
import { Sidenote } from "@/components/sidenote";

type CodeProps = {
  className?: string;
  children?: ReactNode;
  "data-file"?: string;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    CodeBlock,
    Sidenote,
    pre: ({ children }) => {
      const child = children as ReactElement<CodeProps> | undefined;
      const codeProps = child?.props ?? ({} as CodeProps);
      const raw = String(codeProps.children ?? "");
      const match = /language-(\w+)/.exec(codeProps.className ?? "");
      return (
        <CodeBlock
          lang={match?.[1] ?? "text"}
          file={codeProps["data-file"]}
          code={raw.replace(/\n$/, "")}
        />
      );
    },
  };
}
