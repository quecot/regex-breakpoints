import * as assert from "assert";
import * as vscode from "vscode";

suite("Regex Breakpoints Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Set Breakpoints Command - Valid Regex", async () => {
    const document = await vscode.workspace.openTextDocument({
      content:
        'console.log("Hello, world!");\nlet x = 5;\nconsole.log("Another log");',
      language: "javascript",
    });

    await vscode.window.showTextDocument(document);

    const regex = "console\\.log";
    await vscode.commands.executeCommand("regex-breakpoints.setBreakpoints", {
      providedRegex: regex,
    });

    const matchingLines = document
      .getText()
      .split("\n")
      .reduce((acc, line, i) => {
        if (new RegExp(regex).test(line)) {
          acc.push(i);
        }
        return acc;
      }, [] as number[]);

    const breakpoints = vscode.debug.breakpoints.filter((bp) => {
      if (bp instanceof vscode.SourceBreakpoint) {
        return matchingLines.includes(bp.location.range.start.line);
      }
      return false;
    });

    assert.strictEqual(
      breakpoints.length,
      2,
      "Expected 2 breakpoints to be set"
    );
  });

  test("Remove Breakpoints Command - Valid Regex", async () => {
    const document = await vscode.workspace.openTextDocument({
      content:
        'console.log("Hello, world!");\nlet x = 5;\nconsole.log("Another log");',
      language: "javascript",
    });

    await vscode.window.showTextDocument(document);

    // First, add breakpoints
    const regex = "console\\.log";
    await vscode.commands.executeCommand("regex-breakpoints.setBreakpoints", {
      providedRegex: regex,
    });

    // Now, remove breakpoints
    await vscode.commands.executeCommand(
      "regex-breakpoints.removeBreakpoints",
      { providedRegex: regex }
    );

    const breakpoints = vscode.debug.breakpoints.filter((bp) => {
      if (bp instanceof vscode.SourceBreakpoint) {
        return bp.location.uri.toString() === document.uri.toString();
      }
      return false;
    });

    assert.strictEqual(
      breakpoints.length,
      0,
      "Expected all breakpoints to be removed"
    );
  });

  test("Set Breakpoints Command - Invalid Regex", async () => {
    const invalidRegex = "[InvalidRegex";

    const e = (await vscode.commands.executeCommand(
      "regex-breakpoints.setBreakpoints",
      {
        providedRegex: invalidRegex,
      }
    )) as Error;

    assert.ok(
      e.message.includes("Invalid regular expression"),
      "Expected an invalid regex error"
    );
  });
});
