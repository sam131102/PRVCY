<?php
require 'connect.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    $sql = "INSERT INTO video_share_requests (sender_id, receiver_id, video_key, status) VALUES (?, ?, ?, 'pending')";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$data['senderId'], $data['receiverId'], $data['videoKey']]);
    echo json_encode(['success' => true, 'message' => 'Share request created']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

?>
