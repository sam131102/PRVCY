<?php
    include 'connect.php'

    $username = $_GET['username'];
    $title = $_GET['title'];

    $comments = [];

    $sql = "SELECT comment FROM video_data WHERE title = '{$title}' AND username = '{$username}';";

    $statement = $pdo->query($sql);
    $cr = 0;
    while($row = $statement->fetch(PDO::FETCH_ASSOC)){
        $comments[$cr]['comment'] = $row['comment'];
        $cr++;

    }


    if(!empty($videolist)){
        echo json_encode(['data'=>$comments]);
        http_response_code(200);
    }else{
        http_response_code(404);
    }


?>