<?php
require 'connect.php';

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)){
    $request = json_decode($postdata);

    $email = $request->data->email;
    $username = $request->data->username;
    $password = $request->data->password;
    $firstname = $request->data->firstname;
    $lastname = $request->data->lastname;
    $birthdate = $request->data->birthdate;
    $organizationcode = $request->data->organizationcode;
    $accounttype = $request->data->accounttype;

    $sql = "INSERT INTO Users VALUES ('{$email}', '{$username}', '{$password}', '{$firstname}', '{$lastname}', '{$birthdate}', '{$organizationcode}', '{$accounttype}');";
    $statement = $pdo->prepare($sql);

    if($statement->execute()){
        http_response_code(201);
        $signup = [
            'email' => $email,
            'username' => $username,
            'password' => $password,
            'firstname' => $firstname,
            'lastname' => $lastname,
            'birthdate' => $birthdate,
            'organizationcode' => $organizationcode,
            'accounttype' => $accounttype
        ];
    }else{
        http_response_code(422);
    }
}


?>