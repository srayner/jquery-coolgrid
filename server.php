<?php
 
    // Get params from request.
    $limit = $_GET['limit'];
    $page  = $_GET['page'];
    $sortDir = $_GET['sortDir'];
    $sortField = $_GET['sortField'];
    
    // Database connection.
    $server   = 'localhost';
    $user     = 'someuser';
    $password = 'somepass';
    $database = 'somedb';
    
    $connection = mysql_pconnect('localhost', $user, $password);
    @mysql_select_db($database) or die( 'Unable to select database');
    
    // Get toal count of records.
    $sql = 'SELECT COUNT(*) FROM users u';
    $result = mysql_query($sql, $connection) or die(mysql_error());
    $resultArray = mysql_fetch_array($result);  
    if($result) 
    { 
        $count = $resultArray[0];
    } 
    else 
    { 
        $count = 0; 
    } 
    
    // Calculate the offset
    if($count > 0) {
        $total_pages = ceil($count/$limit);
    } else {
        $total_pages = 0;
    }
    if ($page > $total_pages) $page = $total_pages;
    if ($page < 1) $page = 1;
    $offset = $limit * $page - $limit;
    
    // Build the sort clause.
    if ($sortDir == 'asc')
    {
        $orderBy = $sortField . ' ASC ';
    }
    else
    {
        $orderBy = $sortField . ' DESC ';
    }
    $responce->page = $page;
    $responce->total = $total_pages;
    $responce->records = $count;
    
    // Build the main query.
    $sql = 'SELECT u.user_id, u.username, u.role_descr, u.firstname, u.lastname, u.email, u.phone ' . 
           'FROM users u ' . 
           'ORDER BY ' . $orderBy . 
           'LIMIT ' . $offset . ',' . $limit;
    $result = mysql_query($sql, $connection);
    
    // Loop through the results.
    $i = 0;
    while ($row = mysql_fetch_array($result, MYSQL_ASSOC))
    {
        $id = $row['user_id'];
        $responce->rows[$i] = array($row['user_id'],
                                    $row['username'],
                                    $row['roleDescr'],
                                    $row['firstName'],
                                    $row['lastName'],
                                    $row['email'],
                                    $row['phone'],
                                    '<a class="sr-icon sr-icon-pencil" href="/edit?id=' . $id . '"></a>' . 
                                    '<a class="tooltip sr-icon sr-icon-cross" href="/users/delete?id=' . $id . '"></a>' . 
                                    '<a class="tooltip sr-icon sr-icon-key" href="/users/reset?id=' . $id . '"></a>');
       $i++;
    }
    mysql_close();
    
    // Echo the responce encoded as json.
    echo json_encode($responce);
    
?>