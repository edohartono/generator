#! /usr/bin/env node

const { program } = require("commander");
const generate = require("./commands/generate");
const rn = require("./commands/rn");
const react = require("./commands/react");
program.command("generate").description("Generate").action(generate);

program
  .command("rn <task> <action>")
  .description("Generate react native")
  .action(rn);

program
  .command("react <task> <action>")
  .description("Generate react")
  .action(react);

program.parse();
