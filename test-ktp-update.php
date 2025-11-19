<?php
/**
 * Test script to simulate KTP file update
 * Run with: php test-ktp-update.php
 */

require_once 'vendor/autoload.php';

// Create test image file
$testImagePath = __DIR__ . '/storage/app/public/ktp/test_image.jpg';
if (!file_exists($testImagePath)) {
    // Create a simple test JPG
    $image = imagecreate(100, 100);
    $white = imagecolorallocate($image, 255, 255, 255);
    imagejpeg($image, $testImagePath);
    imagedestroy($image);
    echo "Created test image: $testImagePath\n";
} else {
    echo "Test image already exists\n";
}

// Simulate file upload by creating form data
$pelangganId = 1;
$curlHandle = curl_init();

$postData = array(
    'nama_update' => 'Test Update',
    'alamat_update' => 'Test Address',
    'status_lapangan' => 'Bisa didata',
    'ket_lapangan' => '',
    'ket_pemadanan' => '',
    'ktp' => new \CURLFile($testImagePath, 'image/jpeg', 'ktp_test.jpg'),
);

curl_setopt_array($curlHandle, [
    CURLOPT_URL => "http://localhost:8000/data-pelanggan/$pelangganId",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POST => 1,
    CURLOPT_POSTFIELDS => $postData,
    CURLOPT_HTTPHEADER => [
        'X-HTTP-Method-Override: PUT',
        'Accept: application/json',
        'X-Requested-With: XMLHttpRequest',
    ],
]);

echo "Sending request to update pelanggan $pelangganId with KTP file...\n";
$response = curl_exec($curlHandle);
$httpCode = curl_getinfo($curlHandle, CURLINFO_HTTP_CODE);

curl_close($curlHandle);

echo "HTTP Code: $httpCode\n";
echo "Response: \n$response\n";

// Check logs
echo "\n=== Checking Laravel logs ===\n";
$logPath = __DIR__ . '/storage/logs/laravel.log';
if (file_exists($logPath)) {
    $lastLines = shell_exec("tail -30 " . escapeshellarg($logPath));
    echo $lastLines;
} else {
    echo "Log file not found\n";
}
