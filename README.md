# regex-breakpoints README

## Overview

The **regex-breakpoints** extension allows developers to set and remove breakpoints in their code based on regex patterns. This can save time when debugging large files with repetitive patterns.

## Features

- **Set Breakpoints by Regex:** Add breakpoints to lines matching a user-defined regex pattern.
- **Remove Breakpoints by Regex:** Remove breakpoints from lines matching a user-defined regex pattern.
- **Interactive Input:** Input regex patterns directly from the command palette.

## Usage

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run `Set Breakpoints by Regex`.
3. Enter a regex pattern (e.g., `console\.log`).
4. Breakpoints will be added to all matching lines.
5. To remove breakpoints, run `Remove Breakpoints by Regex` and enter a regex pattern.

## Extension Settings

This extension currently has no configurable settings.

## Known Issues

Please report issues on the [GitHub repository](https://github.com/quecot/regex-breakpoints/issues).

## Release Notes

### 1.0.0

- Initial release with support for setting and removing breakpoints using regex patterns.
