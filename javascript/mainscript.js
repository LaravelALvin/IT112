			// Submit function Go or enter
			$.fn.fnSubmit = function(){ 
				municipalities.remove();
				load_municipalities();
				var textInput = $('#textInput').val();
				var greaterLess = $('#greaterLess').val();
				var numberInput = $('#numberInput').val();
				var typeOfQuery = $('#typeOfQuery').val();
				WFSLayer = null;
				set_cql(textInput.toUpperCase(),greaterLess, numberInput, typeOfQuery);
				map.closePopup();
			}

			//Press enter key on input box
			$('input').on('keypress', function (e) {
				if(e.which === 13){

					//Disable textbox to prevent multiple submit
					$(this).attr("disabled", "disabled");

					//Do Stuff, submit, etc..
					$.fn.fnSubmit();

					//Enable the textbox again if needed.
					$(this).removeAttr("disabled");
				}
   			});

			//removes the "active" class to .popup and .popup-content when the "Close" button is clicked 
			$(".close, .popup-overlay, body").on("click", function() {
				$(".popup-overlay, .popup-content").removeClass("active");
				$(".cover.active").removeClass("active");
			});

			// default layer on map
			var Selected_layer = 'covid19:active_cases'; 

			//generating map using leaflet api
			var WFSLayer = null;
			var map = L.map('map').setView([9.1204, 125.59], 8);
			var basemap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			//adding kilometer control scale
			L.control.scale().addTo(map); 
			var legend = L.control({position: 'topright'});

			//adding legend to the map
			legend.onAdd = function (map) {
				var div = L.DomUtil.create('div', 'info legend');
				div.innerHTML ='<img src="http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER='+Selected_layer+'&legend_options=fontName:Arial;fontAntiAliasing:true;fontColor:0x000033;fontSize:10;bgColor:0xFFFFEE;dpi:120;labelMargin:5"/>';
				return div;
			};
			legend.addTo(map);

			//adding the caragaregion layer from the geoserver to the map
			var owsURI = 'http://127.0.0.1:8080/geoserver/covid19/ows';
			var municipalities;
			function load_municipalities(){
				municipalities = L.tileLayer.wms(owsURI, {
					layers: Selected_layer,
					format: 'image/png',
					transparent: true,
					attribution: "",
					zIndex: 100,
					opacity: .8,
					version: '1.1.0',
				}).addTo(map);
			}

			load_municipalities();


			//changing selected query value
			function mytypeOfQuery(){
				var selectquery = document.getElementById("typeOfQuery").value;
				
				if(selectquery == 'active_cases'){
					Selected_layer = 'covid19:active_cases';
					municipalities.remove();
				load_municipalities();
					legend.addTo(map);
				}
				
				else if(selectquery == 'recoveries'){
					Selected_layer = 'covid19:recoveries';
					municipalities.remove();
				load_municipalities();
					legend.addTo(map);
				}

				else if(selectquery == 'deaths'){
					Selected_layer = 'covid19:deaths';
					municipalities.remove();
				load_municipalities();
					legend.addTo(map);
				}

			}

			/** This function is used to create wfs request from the geoserver and the
			geoserver it will return bounds that will be used to create new map display */
			function wfsRequest(filter){
				function getJsonCurrUtil(data){}
				var defaultParameters = {
					service: 'WFS',
					version: '2.0.0',
					request: 'GetFeature',
					typeName: Selected_layer,
					maxFeatures: 500,
					outputFormat: 'application/json',
					cql_filter: filter,
					format_options: 'callback: getJson',
					srsName: 'EPSG:4326'
				}

				var parameters = L.Util.extend(defaultParameters);
				var URL = owsURI + L.Util.getParamString(parameters);
				$.ajax({
					url : URL,
					dataType : 'json',
					jsonpCallback : 'getJson',
					beforeSend : function (){
						//$(".mapOverlay").addClass("active");
						$('#maploader').show();
					},
					success : function (response) {
						$('#maploader').hide();
						//$('.mapOverlay').removeClass("active");
						if(response.features.length > 0){
							WFSLayer = L.geoJson(response, {
								style: function (feature) {
									return {
										stroke: false,
										fillColor: null,
										fillOpacity: 0
									};
								}
							}).addTo(map);
							map.fitBounds(WFSLayer.getBounds());	
						}else{
							$("#mun_message").html($('#textInput').val() +" not found in CARAGA REGION");
							$(".cover").addClass("active");
							$(".popup-overlay, .popup-content").addClass("active");

							load_municipalities();
							map.setView([9.1204, 125.59], 8);
						}
					}
				})
			}

			/** When map is clicked, a table will popup with values of
			city/munipalities, active cases, recoveries, and deaths */
			map.on("click", function(e) {
				var _layers = this._layers,
				layers = [],
				versions = [],
				styles = [];

				for (var x in _layers) {
					var _layer = _layers[x];
					if (_layer.wmsParams) {
						layers.push(_layer.wmsParams.layers);
						versions.push(_layer.wmsParams.version);
						styles.push(_layer.wmsParams.styles);
					}
				}
				
				var loc = e.latlng,
				xy = e.containerPoint,
				size = this.getSize(),
				bounds = this.getBounds(),
				crs = this.options.crs,
				sw = crs.project(bounds.getSouthWest()),
				ne = crs.project(bounds.getNorthEast()),
				obj = {
					service: "WMS",
					version: versions[0],
					request: "GetFeatureInfo",
					layers: layers,
					bbox: sw.x + "," + sw.y + "," + ne.x + "," + ne.y,
					width: size.x,
					height: size.y,
					query_layers: layers,
					info_format: "application/json", 
					feature_count: 1
				};
				if (parseFloat(obj.version) >= 1.3) {
					obj.crs = crs.code;
					obj.i = Math.round(xy.x);
					obj.j = Math.round(xy.y);
				} else {
					obj.srs = crs.code;
					obj.x = Math.round(xy.x);
					obj.y = Math.round(xy.y);
				}

				$.ajax({
					url: owsURI + L.Util.getParamString(obj, owsURI, true),
					beforeSend:function(){
						//$(".mapOverlay").addClass("active");
						$('#maploader').show();
					},
					success: function(data, status, xhr) {
						$('#maploader').hide();
						//$('.mapOverlay').removeClass("active");
						var html = "<table  class='table table-striped' table cellspacing='0' cellpadding='0'>";
						var found = true;
						if (data.features) {
							var features = data.features;
							if (features.length) {
								for (var i in features) {
									var feature = features[i];                     
									var properties=feature.properties;
									html+='<thead><tr><th colspan="2" class="municipality">'+properties['mun_name']+'</th></tr></thead><tbody>';
									html+='<tr class = "active_cases"><th >Active Cases: </th><td class = "active_casess">'+" "+properties['active_cases']+'</td></tr>';
									html+='<tr class = "recoveries"><th >Recoveries: </th><td>'+" "+properties['recoveries']+'</td></tr>';
									html+='<tr class = "deaths"><th >Deaths: </th><td>'+" "+properties['deaths']+'</td></tr>';
									html+='</tbody></table>';
								}
							} else {
								html += "No Features Found.";
							}
						} else {
							html += "Failed to Read the Feature(s).";
						}
						if(found) map.openPopup(html, loc,{maxHeight:500});	
					},
					error: function(xhr, status, err) {
						html += "Unable to Complete the Request.: " + err;
						map.openPopup(html, loc);
					}
					});
				});


			//Setting CQL filter from the input values
			function set_cql(textInput,greaterLess, numberInput, typeOfQuery) {
				var cql_filter = [];
				if (textInput){
					cql_filter.push("mun_name LIKE '%"+textInput+"%'")
				}
				if (numberInput){
					cql_filter.push(typeOfQuery+" "+greaterLess+" "+numberInput)
				}
				
				if (cql_filter.length == 2){
					cql_filter.splice(1, 0, "AND");
				}
				if (cql_filter.length==0){
					cql_filter.push("1=1")
				}

				municipalities.setParams({
					CQL_FILTER: cql_filter.join(' ')
				})
				
				wfsRequest(cql_filter.join(' '));
			}

			
			$('#go-but').click(function(){
				$.fn.fnSubmit();
			})
			$('#clear').click(function(){
				$('#loader').hide();
				$('#textInput').val('');
				$('#numberInput').val('');
				municipalities.setParams({
					CQL_FILTER: '1=1',
				})
				map.closePopup();
				WFSLayer = null;
				map.setView([9.1204, 125.59], 8);
			})

			var modal = document.querySelector(".modal");
			var trigger = document.querySelector(".trigger");
			var closeButton = document.querySelector(".close-button");

			function toggleModal() {
				modal.classList.toggle("show-modal");
			}

			function windowOnClick(event) {
				if (event.target === modal) {
					toggleModal();
				}
			}

			trigger.addEventListener("click", toggleModal);
			closeButton.addEventListener("click", toggleModal);
			window.addEventListener("click", windowOnClick);