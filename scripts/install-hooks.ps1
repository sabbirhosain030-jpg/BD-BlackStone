# install-hooks.ps1
# Run this script once to install the pre-push git hook.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/install-hooks.ps1

$hookDir = ".git\hooks"
$hookFile = "$hookDir\pre-push"

if (-not (Test-Path $hookDir)) {
    Write-Error "Not in a git repository root. Run from project root."
    exit 1
}

$hookContent = @'
#!/bin/sh
# BD BlackStone — Pre-Push Hook
# Runs TypeScript type check before every git push.
# If there are errors, the push is BLOCKED until they are fixed.

echo ""
echo "=================================================="
echo "  BD BlackStone — Pre-Push Check"
echo "=================================================="

echo ""
echo "Running TypeScript type check..."
npx tsc --noEmit
TSC_EXIT=$?

if [ $TSC_EXIT -ne 0 ]; then
  echo ""
  echo "=================================================="
  echo "  PUSH BLOCKED: TypeScript errors found above."
  echo "  Fix the errors and try again."
  echo "=================================================="
  echo ""
  exit 1
fi

echo ""
echo "TypeScript check passed!"
echo ""
echo "Running Next.js lint check..."
npx next lint --quiet
LINT_EXIT=$?

if [ $LINT_EXIT -ne 0 ]; then
  echo ""
  echo "=================================================="
  echo "  PUSH BLOCKED: ESLint errors found above."
  echo "  Fix the errors and try again."
  echo "=================================================="
  echo ""
  exit 1
fi

echo ""
echo "=================================================="
echo "  All checks passed!  Pushing..."
echo "=================================================="
echo ""
exit 0
'@

Set-Content -Path $hookFile -Value $hookContent -Encoding UTF8

# Make it executable (needed for git bash on Windows)
$gitPath = (Get-Command git).Source
$gitDir = Split-Path (Split-Path $gitPath)
$bashPath = Join-Path $gitDir "bin\bash.exe"

if (Test-Path $bashPath) {
    & $bashPath -c "chmod +x .git/hooks/pre-push" 2>$null
}

Write-Host ""
Write-Host "=========================================="
Write-Host "  Pre-push hook installed successfully!"
Write-Host "=========================================="
Write-Host ""
Write-Host "Every 'git push' will now:"
Write-Host "  1. Run TypeScript type check (tsc --noEmit)"
Write-Host "  2. Run ESLint (next lint)"
Write-Host "  Push is BLOCKED if any check fails."
Write-Host ""
