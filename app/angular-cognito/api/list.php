<?php

require 'connect.php';

$signup = [];

$sql = "SELECT email, username, password, firstname, lastname, birthdate, organizationcode, accounttype FROM Users WHERE username = 'max';";

$statement = $pdo->query($sql);
$cr = 0;
while($row = $statement->fetch(PDO::FETCH_ASSOC)){
    $signup[$cr]['email'] = $row['email'];
    $signup[$cr]['username'] = $row['username'];
    $signup[$cr]['password'] = $row['password'];
    $signup[$cr]['firstname'] = $row['firstname'];
    $signup[$cr]['lastname'] = $row['lastname'];
    $signup[$cr]['birthdate'] = $row['birthdate'];
    $signup[$cr]['organizationcode'] = $row['organizationcode'];
    $signup[$cr]['accounttype'] = $row['accounttype'];
    $cr++;

}


if(!empty($signup)){
    echo json_encode(['data'=>$signup]);
}else{
    http_response_code(404);
}



?>