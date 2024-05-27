<?php
require 'connect.php';
$data = json_decode(file_get_contents('php://input'), true);

$status = $data['action'] === 'accept' ? 'accepted' : 'denied';
$sql = "UPDATE video_share_requests SET status = ? WHERE id = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$status, $data['requestId']]);
echo json_encode(['success' => true, 'message' => "Request {$data['action']}"]);
?>
