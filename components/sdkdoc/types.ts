import type React from "react";

export type SDKBlockProps = {
  name: string;
  type?:
    | "function"
    | "class"
    | "method"
    | "enum"
    | "variable"
    | "type"
    | "module"
    | "trait"
    | "constant"
    | "static"
    | "struct"
    | "type_alias";
  owner?: string;
  children?: React.ReactNode;
};
