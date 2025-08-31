# 🚫 Auto Reject Issues

Sometimes your repo needs a bouncer that rejects EVERYONE.

Automatically closes ALL issues immediately with a random dismissive comment.

## Usage

```yaml
name: Auto Reject Issues
on:
  issues:
    types: [opened]

permissions:
  issues: write

jobs:
  auto-reject:
    runs-on: ubuntu-latest
    steps:
      - name: Auto Reject Issues
        uses: ernestm1234/auto-reject-issues@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          closing-statements: "nah,not happening,hard pass,absolutely not,denied"
```

## Configuration

| Input                | Description                | Default                                     |
| -------------------- | -------------------------- | ------------------------------------------- |
| `github-token`       | GitHub token (required)    | -                                           |
| `closing-statements` | Random dismissive comments | "nah,not happening,rejected,no thanks,pass" |

## License

MIT - see [LICENSE.md](LICENSE.md)
