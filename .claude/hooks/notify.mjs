// Notification and Stop hook: plays a system sound and shows a Windows pop-up (toast)
// when Claude needs you (a permission prompt, waiting for input) or has finished.
// Never blocks: any failure (not Windows, PowerShell missing) is ignored.
// Remove the "Stop" entry from .claude/settings.json if a notification after every
// reply is too much.
import { spawnSync } from 'node:child_process'

let raw = ''
process.stdin.setEncoding('utf8')
for await (const chunk of process.stdin) raw += chunk

let input = {}
try {
  input = JSON.parse(raw)
} catch {
  // no readable input: fall back to a generic message below
}

if (process.platform !== 'win32') process.exit(0)

const event = input.hook_event_name || ''
const title = 'Claude Code: Tip Calculator'
const message =
  event === 'Stop'
    ? 'Claude has finished.'
    : String(input.message || 'Claude needs your attention.').slice(0, 200)

// PowerShell script: sound first, then the toast. Title and message come from
// environment variables, so no quoting problems.
const script = `
try { [System.Media.SystemSounds]::Asterisk.Play() } catch {}
try {
  [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
  $xml = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
  $text = $xml.GetElementsByTagName('text')
  $text.Item(0).AppendChild($xml.CreateTextNode($env:CC_TITLE)) | Out-Null
  $text.Item(1).AppendChild($xml.CreateTextNode($env:CC_MESSAGE)) | Out-Null
  $toast = [Windows.UI.Notifications.ToastNotification]::new($xml)
  $appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe'
  [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show($toast)
} catch {}
Start-Sleep -Milliseconds 700
`

spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
  env: { ...process.env, CC_TITLE: title, CC_MESSAGE: message },
  timeout: 10_000,
  windowsHide: true,
})
