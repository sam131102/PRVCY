<?php
require 'connect.php';

$postdata = file_get_contents("php://input");

if(isset($postdata) && !empty($postdata)){
    $request = json_decode($postdata);

    $username = $request->data->username;
    $title = $request->data->title;
    $comment = $request->data->comment;

    $sql = "INSERT INTO video_data VALUES ('{$username}', '{$title}', '{$comment}');";
    $statement = $pdo->prepare($sql);

    if($statement->execute()){
        http_response_code(201);
        $videodata = [
            'username' => $username,
            'title' => $title,
            'comment' => $comment
        ];
    }else{
        http_response_code(422);
    }
}


?>