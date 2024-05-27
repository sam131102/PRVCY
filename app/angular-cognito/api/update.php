<?php
require 'connect.php';

$postdata = file_get_contents("php://input");


  $request = json_decode($postdata);
  
  $username = $request->data->username;
  $organizationcode = $request->data->organizationcode;


  $sql = "UPDATE Users SET organizationcode = '{$organizationcode}' WHERE username = '{$username}' LIMIT 1;";
  $statement = $pdo->prepare($sql);

  if($statement->execute())
  {
    http_response_code(200);
  }
  else
  {
    return http_response_code(422);
  }  

?>