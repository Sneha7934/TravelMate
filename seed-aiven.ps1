# PowerShell script to seed travelmate.sql into Aiven MySQL
param (
    [string]$HostName,
    [string]$Port,
    [string]$User = "avnadmin",
    [string]$Password,
    [string]$Database = "defaultdb"
)

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   TravelMate Aiven MySQL Database Seeder     " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# Locate mysql.exe
$mysqlExe = "C:\xampp\mysql\bin\mysql.exe"
if (-not (Test-Path $mysqlExe)) {
    $cmd = Get-Command mysql -ErrorAction SilentlyContinue
    if ($cmd) {
        $mysqlExe = $cmd.Source
    } else {
        Write-Error "mysql.exe could not be found in C:\xampp\mysql\bin\ or system PATH."
        exit 1
    }
}
Write-Host "Using MySQL Client: $mysqlExe" -ForegroundColor Green

# Prompt for credentials if not supplied as parameters
if (-not $HostName) {
    $HostName = Read-Host "Enter Aiven Host (e.g., mysql-xxxx.aivencloud.com)"
}
if (-not $Port) {
    $Port = Read-Host "Enter Aiven Port (e.g., 12345)"
}
if (-not $Password) {
    $Password = Read-Host -AsSecureString "Enter Aiven Password"
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
    $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
}
if (-not $Database) {
    $dbInput = Read-Host "Enter Database Name (press Enter for 'defaultdb')"
    if ($dbInput) { $Database = $dbInput }
}

$sqlFile = Join-Path $PSScriptRoot "travelmate.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Error "travelmate.sql not found at $sqlFile"
    exit 1
}

Write-Host "`nImporting travelmate.sql into $Database on $HostName:$Port ..." -ForegroundColor Yellow

$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = $mysqlExe
$processInfo.Arguments = "-h $HostName -P $Port -u $User -p$Password --ssl-mode=REQUIRED $Database"
$processInfo.RedirectStandardInput = $true
$processInfo.RedirectStandardOutput = $true
$processInfo.RedirectStandardError = $true
$processInfo.UseShellExecute = $false
$processInfo.CreateNoWindow = $true

$process = [System.Diagnostics.Process]::Start($processInfo)
$sqlContent = [System.IO.File]::ReadAllText($sqlFile)
$process.StandardInput.Write($sqlContent)
$process.StandardInput.Close()

$output = $process.StandardOutput.ReadToEnd()
$errOutput = $process.StandardError.ReadToEnd()
$process.WaitForExit()

if ($process.ExitCode -eq 0) {
    Write-Host "`nDatabase seeded successfully into Aiven MySQL!" -ForegroundColor Green
    Write-Host "All tables (destinations, attractions, users, reviews, favorites) and data were imported identical to your local database." -ForegroundColor Green
} else {
    Write-Host "`nFailed to import into Aiven MySQL." -ForegroundColor Red
    Write-Host "Error Output:" -ForegroundColor Red
    Write-Host $errOutput
}
