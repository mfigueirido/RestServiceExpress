<#
Creates a self-signed certificate for localhost and exports a PFX into ./certs.
Usage: Run in PowerShell (Administrator priviledges needed for trusting the certificate).
#>

param(
  [string]$CertFriendlyName = 'restserviceexpress-local',
  [string]$PfxPassword = 'change_me',
  [switch]$Trust
)

$ErrorActionPreference = 'Stop'

$certsDir = Join-Path -Path $PSScriptRoot -ChildPath '..\certs' | Resolve-Path -ErrorAction SilentlyContinue
if (-not $certsDir) {
  New-Item -ItemType Directory -Path (Join-Path -Path $PSScriptRoot -ChildPath '..\certs') | Out-Null
  $certsDir = (Join-Path -Path $PSScriptRoot -ChildPath '..\certs')
}
$certsDir = Resolve-Path $certsDir

Write-Host "Using certs directory: $certsDir"

# Create self-signed cert in LocalMachine\My
$dnsNames = @('localhost', '127.0.0.1')
$cert = New-SelfSignedCertificate -DnsName $dnsNames -CertStoreLocation 'Cert:\LocalMachine\My' -FriendlyName $CertFriendlyName -NotAfter (Get-Date).AddYears(2)

$pfxPath = Join-Path $certsDir 'localhost.pfx'
$securePwd = ConvertTo-SecureString -String $PfxPassword -Force -AsPlainText
Export-PfxCertificate -Cert "Cert:\LocalMachine\My\$($cert.Thumbprint)" -FilePath $pfxPath -Password $securePwd

# Export public cert (optional)
$cerPath = Join-Path $certsDir 'localhost.cer'
Export-Certificate -Cert "Cert:\LocalMachine\My\$($cert.Thumbprint)" -FilePath $cerPath

Write-Host "PFX exported to: $pfxPath"
Write-Host "CER exported to: $cerPath"

if ($Trust) {
  Write-Host "Importing public certificate into LocalMachine\Root (requires admin)..."
  Import-Certificate -FilePath $cerPath -CertStoreLocation Cert:\LocalMachine\Root | Out-Null
  Write-Host "Certificate trusted."
}
else {
  Write-Host "To trust this cert in Windows, re-run this script with -Trust switch as Administrator."
}

Write-Host "Done. Add the following to your .env or docker-compose environment:\n  SSL_PFX_PATH=./certs/localhost.pfx\n  SSL_PFX_PASSPHRASE=$PfxPassword"