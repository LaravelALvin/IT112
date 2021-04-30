<?php
	include 'php/connection.php';

	//query to get the total active cases, recoveries and deaths 
	$query = "SELECT SUM(active_cases), SUM(recoveries), SUM(deaths) FROM caragaregion_municipalities;";   
	$rs = pg_query($con, $query) or die("Cannot execute query: $query\n");  
	
	//if there is return, values will be saved to the variables
	while ($row = pg_fetch_row($rs)) {  
	$active_cases = $row[0];
	$recoveries = $row[1];
	$deaths = $row[2];
	} 
	//closing the connection
	pg_close($con);

?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0">
		<title>Caraga-covid19</title>
		<link rel="stylesheet" type="text/css" href="css/mainstyle.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css" />
		<link rel="stylesheet" href="leaflet/leaflet.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
		<script type="text/javascript" src="leaflet/leaflet.js"></script>
		<script type="text/javascript" src="jQuery/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
		
	</head>
	<script>
         
        function loaded(){
            $(".se-pre-con").fadeOut("slow");
        }

    </script>
	<body onload="loaded()">
	<div class="se-pre-con"></div>
		<!-- navbar header -->
		<div class="navbar">
			<div id="logo-con">
				<p id="logo">COVID-19 CARAGA REGION</p>
			</div>
			<div id="home">
				<ul>
					<a><li>HOME</li></a>	
					<a href="html/Data.php"> <li>VIEW DATA</li></a> 
					<a href="html/admin.php"> <li>TESTING</li></a> 
					<li>ABOUT</li>
				</ul>
			</div>
		</div>
		<!-- navbar -->

		<!-- home mobile setup -->
			<div id="home-mobile-setup">
				<button id="home-but">HOME</button>
				<button onclick="location.href='html/Data.php'" id="viewdata-but">VIEW DATA</button>
				<button id="testing-but">TESTING</button>
				<button id="about-but">ABOUT</button>
			</div>
		<!-- home mobile setup -->

		<!-- home tablet setup -->
		<div class="banner">
			<div id="home-tablet-setup">
				<ul>
					<li>HOME</li>
					<a href="html/Data.php"> <li>VIEW DATA</li></a> 
					<li>TESTING</li>
					<li>ABOUT</li>
				</ul>
			</div>
			<!-- home tablet setup -->
			<h2>Caraga Region COVID-19 Mapping Dashboard</h2>
		</div><!-- banner -->

		<!-- mobile setup -->
		<div class="mobile-setup">
			<div id="active-cases">
				<p>ACTIVE CASES</p>
				<p style="padding:0;margin:0;" class="active_value">0</p>
			</div>
			<div id="recoveries">
				<p>RECOVERIES</p>
				<p style="padding:0;margin:0;" class="rec_value">0</p>
			</div>
			<div id="deaths">
				<p>DEATHS</p>
				<p style="padding:0;margin:0;" class="death_value">0</p>
			</div>	
		</div>
		<!-- mobile setup -->



		<div class="menu">
			<div>
				<input  class="form-control" type="text" placeholder=" Municipality" name="textInput" id="textInput" onkeypress="return /[a-zA-Z]/i.test(event.key)">
			</div>

			<div>
				<select class="form-control" id="typeOfQuery" onchange="mytypeOfQuery()">
					<option value="active_cases">Active cases</option>
					<option value="recoveries">Recoveries</option>
					<option value="deaths">Deaths</option>
				</select>
			</div>

			<div>
				<select class="form-control" id="greaterLess">
					<option value="<">Less than</option>
					<option value="=">Equal</option>
					<option value=">">Greater than</option>
				</select>
			</div>

			<div>
				<input class="form-control" type="number" placeholder=" Input number" id="numberInput"></input>
			</div>

			<div id="buttons">
				<button id="go-but">Go</button>
				<button id="clear">Clear</button>
			</div>
			
			<!-- pc setup -->
			<div class="pc-setup">

				<div id="active-cases">
					<p style="padding-top:5px;">ACTIVE CASES</p>
					<p class="active_value">0</p>
				</div>
				<div id="recoveries">
					<p style="padding-top:5px;">RECOVERIES</p>
					<p class="rec_value">0</p>
				</div>
				<div id="deaths">
					<p style="padding-top:5px;">DEATHS</p>
					<p class="death_value">0</p>
				</div>

			</div>
			<!-- pc setup -->

		</div>
		<!-- menu -->
	
            <div class="map-holder">
			<div class="mapOverlay"></div>
				<div id="map" class ="map">
				<div class="text-center" id="maploader">
                    <div class="loading"></div>
                        <span>Loading...</span>
					</div>
				</div>
			</div>
			
			

			<!--Creates the popup body-->
		<div class="popup-overlay">
			<!--Creates the popup content-->
			<img id="warningIcon" src="img/warning.png">
			<h3 id="mun_message"></h3>
			<button id="btnClose">CLOSE</button>
		</div> 
		<div class="cover" ></div>
		

		<script src="javascript/mainscript.js"></script>

		<script>
			//Total records 
			$('.active_value').text(<?php echo $active_cases; ?>);
			$('.rec_value').text(<?php echo $recoveries; ?>);
			$('.death_value').text(<?php echo $deaths; ?>);
			
			//Counter animation
			$('.active_value, .rec_value, .death_value').each(function () {
				var $this = $(this);
				jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
					duration: 4500,
					easing: 'swing',
					step: function () {
					$this.text(Math.ceil(this.Counter));
					}
				});
			});
		</script>

	</body>

</html>