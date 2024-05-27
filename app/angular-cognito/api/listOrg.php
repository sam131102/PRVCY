<?php

require 'connect.php';


$username = $_GET['username'];
$organizationcode = $_GET['organizationcode'];

$videolist = [];

$sql = "SELECT username FROM Users WHERE organizationcode = '{$organizationcode}' AND NOT username = '{$username}';";

$statement = $pdo->query($sql);
$cr = 0;
while($row = $statement->fetch(PDO::FETCH_ASSOC)){
    $videolist[$cr]['username'] = $row['username'];
    $cr++;

}


if(!empty($videolist)){
    echo json_encode(['data'=>$videolist]);
}else{
    http_response_code(404);
}



?>