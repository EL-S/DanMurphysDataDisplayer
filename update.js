// load in the data and periodically refresh it incase there is changes in the database

function sanitize_percent(percent) {
	if (percent.includes("%")) {
        if (percent.includes(",")) {
            percent = "Unknown";
		} else if (percent.includes("-")) {
			percent = "Unknown";
		} else if (percent.includes("(")) {
			percent = "Unknown";
        } else if (percent.includes("<")) {
			percent = "Unknown";
        } else if (percent.includes("/")) {
			percent = "Unknown";
        } else if (percent.includes("x")) {
			percent = "Unknown";
        } else if (percent.includes("X")) {
			percent = "Unknown";
        } else if (percent.includes("&")) {
			percent = "Unknown";
        } else if (percent.includes("and")) {
			percent = "Unknown";
        }
		else {
            percent = percent.replace("%","").split()[0];
		}
		if (percent !== "Unknown") {	
			if (percent > 100) {
				percent = percent/100;
			} else {
				percent_str = percent.toString();
				try {
					if (percent_str.length > 5) {
						alert(percent);
						percent = (percent).toFixed(2);
						alert(percent);
					}
				} catch {
					alert("it did the thing");
					alert(percent);
					alert(percent_str);
				}
			}
		}
    } else {
        try {
            if (percent > 100) {
				percent = "Unknown";
			}
        } catch {
            percent = "Unknown";
		}
	}
	try {
        if (percent !== "Unknown") {
            if (percent < 0.3) {
				percent = percent*100;
			}
            percent = percent.toString()+"%";
		}
    } catch {
        percent = "Unknown";
	}
    return percent;
}

function get_data() { // synchronous
	var url = "data/data.json";
	var http_req = new XMLHttpRequest();
	http_req.open("GET", url, false);
	http_req.send(null);
	var response = http_req.responseText;
	var data = JSON.parse(response)
	alert("yeet");
	return data;
}

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data/data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

function get_price(price_details) {
	var price = "Unknown";
	try {
		price = price_details['singleprice']['Value'];
	} catch {
		try {
			case_amount = pricedetails['message'].split(" ")[-1];
			case_price = int(pricedetails['caseprice']['Value']);
			price = str(case_price/int(case_amount));
		} catch {
			try {
				price = pricedetails['inanysixprice']['Value'];
			} catch {
			}
		}
	}
	// console.log(price);
	return price;
}

function parse_product(product) {
	// console.log(JSON.stringify(product));
	try {
		var additional_details = product["Products"][0]['AdditionalDetails'];
		var price_details = product["Products"][0]['Prices'];
		
		var dm_stockcode = "DM_"+product["PackDefaultStockCode"];
		var price = get_price(price_details);
		
		var standard_drinks = "Unknown";
		var size = "Unknown";
		var percent = "Unknown";
		var alcohol_type = "Unknown";
		var name = "Unknown";
		var alcohol_type2 = "Unknown";
		var alcohol_type3 = "Unknown";
		var alcohol_type4 = "Unknown";
		var reviews_amount = "0";
		
		for (detail_num in additional_details) {
			if (additional_details.hasOwnProperty(detail_num)) {
				var detail = additional_details[detail_num];
				if (detail['Name'] == "dm_stockcode") {
					dm_stockcode = detail['Value'];
				}
				if (detail['Name'] == "standarddrinks") {
					standard_drinks = detail['Value'];
					// standard_drinks = sanitize_standard_drinks(standard_drinks);
				}
				if (detail['Name'] == "webliquorsize") {
					size = detail['Value'];
					// size = sanitize_size(size);
				}
				if (detail['Name'] == "producttitle") {
					name = detail['Value'];
				}
				if (detail['Name'] == "webalcoholpercentage") {
					percent = detail['Value'];
					percent = sanitize_percent(percent);
				}
				if (detail['Name'] == "webproducttype") {
					alcohol_type = detail['Value'];
				}
				if (detail['Name'] == "webmaincategory") {
					alcohol_type2 = detail['Value'];
				}
				if (detail['Name'] == "liquorstyle") {
					alcohol_type3 = detail['Value'];
				}
				if (detail['Name'] == "varietal") {
					alcohol_type4 = detail['Value'];
				}
				if (detail['Name'] == "webtotalreviewcount") {
					reviews_amount = detail['Value'];
				}
			}
		}
		price_per_standard_drink = 0; // get_price_per_standard_drink(price,standard_drinks);
		url = "fake url"; //get_url(dm_stockcode);
		return [dm_stockcode, price, standard_drinks, size, percent, alcohol_type, name, alcohol_type2, alcohol_type3, alcohol_type4, reviews_amount];
	} catch {
		return false;
	}
}

function load_data() { // update the data display
	loadJSON(function(response) {
		// Parse JSON string into object
		var json_data = JSON.parse(response);
		// make each row of the table using specific metrics
		// output the row to the html table
		var results = [];
		
		for (var key in json_data) {
			if (json_data.hasOwnProperty(key)) {
				var product = json_data[key][0];
				var product_parsed = parse_product(product);
				if (product_parsed) {
					results.push(product_parsed);
				}
			}
		}
		
		for (var i = 0; i < results.length; i++) {
			//console.log(results[i]);
		}
	});
}

function init() {
	load_data();
}

window.onload = init;