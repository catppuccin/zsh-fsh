#!/usr/bin/env deno run --allow-write=./themes

import {
  Colors,
  flavorEntries,
} from "https://deno.land/x/catppuccin@v1.1.0/mod.ts";
import { parseArgs } from "https://deno.land/std@0.219.1/cli/parse_args.ts";
import * as ini from "https://deno.land/std@0.219.1/ini/mod.ts";

const bold = (c: string) => `${c},bold`;

const theme = (c: Colors<string>) => ({
  "base": {
    "default": c.text,
    "unknown-token": bold(c.red),
    "commandseparator": c.teal,
    "redirection": c.teal,
    "here-string-tri": c.subtext1,
    "here-string-text": c.subtext1,
    "here-string-var": c.subtext1,
    "exec-descriptor": "none",
    "comment": c.overlay0,
    "correct-subtle": c.lavender,
    "incorrect-subtle": c.red,
    "subtle-separator": "none",
    "secondary": "",
    "subtle-bg": "none",
    "recursive-base": c.text,
  },
  "command-point": {
    "reserved-word": c.mauve,
    "subcommand": c.teal,
    "alias": c.blue,
    "suffix-alias": c.blue,
    "global-alias": c.blue,
    "builtin": c.mauve,
    "function": c.blue,
    "command": c.blue,
    "precommand": c.mauve,
    "hashed-command": c.blue,
    "single-sq-bracket": c.yellow,
    "double-sq-bracket": c.yellow,
    "double-paren": c.green,
  },
  "paths": {
    "path": c.yellow,
    "pathseparator": c.yellow,
    "path-to-dir": c.yellow,
    "globbing": c.pink,
    "globbing-ext": "none",
  },
  "brackets": {
    "paired-bracket": "bold",
    "bracket-level-1": c.red,
    "bracket-level-2": c.yellow,
    "bracket-level-3": c.sapphire,
  },
  "arguments": {
    "single-hyphen-option": c.teal,
    "double-hyphen-option": c.teal,
    "back-quoted-argument": c.teal,
    "single-quoted-argument": c.green,
    "double-quoted-argument": c.green,
    "dollar-quoted-argument": c.green,
    "optarg-string": c.green,
    "optarg-number": c.peach,
  },
  "in-string": {
    "back-dollar-quoted-argument": c.peach,
    "back-or-dollar-double-quoted-argument": c.peach,
  },
  "other": {
    "variable": c.peach,
    "assign": "none",
    "assign-array-bracket": "none",
    "history-expansion": "none",
  },
  "math": {
    "mathvar": c.pink,
    "mathnum": c.peach,
    "matherr": bold(c.pink),
  },
  "for-loop": {
    "forvar": c.text,
    "fornum": c.peach,
    "foroper": c.blue,
    "forsep": c.blue,
  },
  "case": {
    "case-input": c.peach,
    "case-parentheses": c.overlay2,
    "case-condition": c.mauve,
  },
});

const args = parseArgs(Deno.args, {
  string: ["overrides"],
});

const overrides = args.overrides ? JSON.parse(args.overrides) : {};

flavorEntries.map(([flavorName, flavor]) => {
  const fName = new URL(
    import.meta.resolve(`./themes/catppuccin-${flavorName}.ini`),
  ).pathname;

  const flavorOverrides = overrides[flavorName] ?? {};
  const hexColors = flavor.colorEntries
    .reduce((acc, [colorName, color]) => ({
      ...acc,
      [colorName]: flavorOverrides[colorName] ?? color.hex,
    }), {} as Colors<string>);

  Deno.writeTextFile(fName, ini.stringify(theme(hexColors)));
});
