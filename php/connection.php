<?php
$host = "localhost"; 	//host
$port ="5433";			//posrt
$user = "postgres"; 	//username
$pass = "1234"; 		//password
$db = "alvin"; 			//database name


/**Creating connection to PostgresSQL */
$con = pg_connect("host=$host port=$port dbname=$db user=$user password=$pass")
    or die ("Could not connect to server\n");


?>