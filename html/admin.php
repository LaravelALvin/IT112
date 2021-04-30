<?php
   include '../php/connection.php';
?>


<!DOCTYPE html>
<html>
	<head>
        <meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0">
		<link rel="stylesheet" type="text/css" href="../css/mainstyle.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.22/css/jquery.dataTables.css">

		<link rel="stylesheet" href="../bootstrap/bootstrap.min.css">

		<script type="text/javascript" src="../jQuery/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.22/js/jquery.dataTables.js"></script>
        <title>Caraga-covid19</title>
	</head>
	<body>
		<!-- navbar header -->
		<div class="navbar" style="background-color: #222222;">
			<div id="logo-con">
				<p id="logo" >COVID-19 CARAGA REGION</p>
			</div>
			<div id="home">
				<ul>
					<a href="../index.php"><li>HOME</li></a>	
					<li>VIEW DATA</li>
					<li>TESTING</li>
					<li>ABOUT</li>
				</ul>
			</div>
		</div>
		<!-- navbar -->

		<!-- home mobile setup -->
		<div>
			<div id="home-mobile-setup">
				<button onclick="location.href='../index.php'" id="home-but">HOME</button>
				<button id="viewdata-but">VIEW DATA</button>
				<button id="testing-but">TESTING</button>
				<button id="about-but">ABOUT</button>
		</div>
		<!-- home mobile setup -->

		<!-- home tablet setup -->
		<div class="banner" style="height: 5px;">
			<div id="home-tablet-setup">
				<ul>
                <a href="../index.php"><li>HOME</li></a>	
					<li>VIEW DATA</li>
					<li>TESTING</li>
					<li>ABOUT</li>
				</ul>
			</div>
			<!-- home tablet setup -->
        </div><!-- banner -->
        

        </table>
		
	</body>
    

   
</html>