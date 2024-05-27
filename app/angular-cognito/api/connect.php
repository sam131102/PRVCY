<?php

$servername = "prvcy-main-db.cjrkirabesjd.ca-central-1.rds.amazonaws.com";
$user = "admin";
$password = "admin499";
$port = "13306";

try{
    $dsn = "mysql:host=$servername;port=$port;dbname=prvcy;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $password);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch (PDOException $e){
    echo json_encode(['error'=> 'Connection failed: ' . $e->getMessage()]);
}


?>