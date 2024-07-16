$ErrorActionPreference = "Stop"

$videoPath = "C:\Personal-Projects\Form-Correction-App\form-estimation\form-correction-app-backend\test_video.mp4"
$uri = "http://localhost:3000/process-video"

if (Test-Path $videoPath) {
    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($videoPath)
        $fileEnc = [System.Text.Encoding]::GetEncoding('ISO-8859-1').GetString($fileBytes)

        $boundary = [System.Guid]::NewGuid().ToString()
        $LF = "`r`n"

        $bodyLines = (
            "--$boundary",
            "Content-Disposition: form-data; name=`"video`"; filename=`"test_video.mp4`"",
            "Content-Type: video/mp4$LF",
            $fileEnc,
            "--$boundary--$LF"
        ) -join $LF

        $response = Invoke-RestMethod -Uri $uri -Method Post -ContentType "multipart/form-data; boundary=`"$boundary`"" -Body $bodyLines -TimeoutSec 600
        $response | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "An error occurred: $_"
        if ($_.Exception.Response) {
            Write-Host "Status code: $($_.Exception.Response.StatusCode.value__)"
        }
    }
} else {
    Write-Host "File not found at path: $videoPath"
}
