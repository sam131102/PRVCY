<?php
require 'connect.php';

$userId = isset($_GET['userId']) ? $_GET['userId'] : '';
try {
    $sql = "SELECT * FROM video_share_requests WHERE receiver_id = ? AND status = 'pending'";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$userId]); 
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $requests]);
} catch (PDOException $e) {
    error_log("Error executing SQL query: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
