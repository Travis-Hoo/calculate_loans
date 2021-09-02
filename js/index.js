window.onload=function(){
	
	dayjs.extend(window.dayjs_plugin_isSameOrBefore);
	dayjs.extend(window.dayjs_plugin_isBetween);

	var tbody = document.getElementsByTagName("tbody")[0];

	$("#add_btn").click(function(){
		
		$(".put_div input").attr("disabled","disabled");
		$("#refund_amount").removeAttr("disabled");
		$("#end_date").attr("disabled",false);
		
		var total_amount = document.getElementById ("total_amount").value;
		var first_date = dayjs(document.getElementById ("first_date").value);									//起算日
		var end_date = dayjs(document.getElementById ("end_date").value);								//截止日
		var due_date = dayjs(document.getElementById ("due_date").value);								//贷款到期日
		var calculate_date = dayjs(document.getElementById ("calculate_date").value);					//计算截止日
		var rate = document.getElementById ("rate").value;												//年利率
		var beyond_rate = document.getElementById ("beyond_rate").value;								//逾期年利率
		var numbers = document.getElementById ("numbers").value;										//年利息日
		var out_account_day = document.getElementById ("out_account_day").value;						//出账日
		var refund_amount = document.getElementById ("refund_amount").value;							//还款金额
		if(refund_amount == ""){
			refund_amount = 0;
		}
		// var refund_date = dayjs(document.getElementById ("refund_date").value);						//还款日

		var newTr = tbody.firstElementChild.cloneNode(true);
		newTr.className = '';
		var balance_amount = document.getElementById ("balance_amount").value;
		if(balance_amount == ""){
			balance_amount = total_amount;
		}
		var child0 = (parseFloat(balance_amount) - parseFloat(refund_amount)).toFixed(4);
		newTr.children[0].innerHTML = child0;
		document.getElementById ("balance_amount").value = child0;

		newTr.children[1].innerHTML = refund_amount;
		document.getElementById ("refund_amount").value = "";
		newTr.children[3].innerHTML = first_date.format('YYYY-MM-DD');
		var child2 = '', child4 = '', child6 = 0, child7 = 0, child8 = 0, end_date_value = "";
		if(due_date.isBetween(first_date, end_date)){
			child4 = due_date;
		}else{
			child4 = end_date;
		}
		newTr.children[4].innerHTML = child4.format('YYYY-MM-DD');
		document.getElementById ("first_date").value = child4.format('YYYY-MM-DD');
		if(child4.date() < out_account_day){
			end_date_value = child4.date(out_account_day);
		}else{
			end_date_value = child4.add(1, 'M').date(out_account_day);
		}
		if(end_date_value.isAfter(calculate_date)){
			end_date_value = calculate_date;
		}
		if(due_date.isBetween(child4, end_date_value)){
			end_date_value = due_date;
		}
		document.getElementById ("end_date").value = end_date_value.format('YYYY-MM-DD');
		var child5 = dayjs(child4).diff(first_date, 'day');
		newTr.children[5].innerHTML = child5;
		if(due_date.isAfter(first_date)){
			child2 = rate;
			child6 = parseFloat(child0*rate/numbers*child5/100).toFixed(4);
		}else{
			child2 = beyond_rate;
			child7 = parseFloat(child0*beyond_rate/numbers*child5/100).toFixed(4);
		}
		newTr.children[2].innerHTML = child2;
		newTr.children[6].innerHTML = child6;
		newTr.children[7].innerHTML = child7;

		var penalty_interest = document.getElementById ("penalty_interest").value;
		if(penalty_interest == ""){
			penalty_interest = 0;
		}
		if(penalty_interest != 0){
			var no_interest_day = document.getElementById ("no_interest_day").value;
			if(no_interest_day == ""){
				no_interest_day = 0;
			}
			no_interest_day = parseInt(no_interest_day) + parseInt(child5);
			if(dayjs(child4).date() == out_account_day || dayjs(child4).isSame(calculate_date)){
				child8 = parseFloat(penalty_interest*child2/numbers*no_interest_day/100).toFixed(4);
				no_interest_day = 0;
			}
			document.getElementById ("no_interest_day").value = no_interest_day;
		}
		newTr.children[8].innerHTML = child8;
		document.getElementById ("penalty_interest").value = parseFloat(penalty_interest) + parseFloat(child7);
		tbody.appendChild(newTr);

		if(child4.isSame(calculate_date)){
			$("#add_btn").attr("disabled","disabled");
		}

// 		var balance_amount = document.getElementById ("balance_amount").value;
// 		if(balance_amount == ""){
// 			balance_amount = total_amount;
// 		}
// 		var next_begin_date = dayjs(document.getElementById("next_begin_date").value);
// 		if(!next_begin_date.isValid()){
// 			next_begin_date = first_date;
// 		}
// 		var interest = 0, lastDays = 0, lastRest = 0, lastfRest = 0, lastFL = 0, qfl = 0;
// 		var out_account_date = first_date.startOf("month").add(out_account_day-1, 'day');
// 		for(i = 0; next_begin_date.isSameOrBefore(refund_date); i++ ){
//
// 			var newTr = tbody.firstElementChild.cloneNode(true);
// 			newTr.className = '';
//
// 			var next_date = out_account_date.add(i, 'M');
// 			var next_date_start = next_date.startOf("month");
// 			var refund_date_start = refund_date.startOf("month");
// 			var child0 = '',child1 = '',  child2 = '', child4 = '', child5 = 0;
// 			var next_d = next_begin_date.add(1, 'M');
// 			var next_balance_amount = (parseFloat(balance_amount) - parseFloat(refund_amount == "" ? 0 : refund_amount)).toFixed(4);
// 			if(next_begin_date.isSame(refund_date) && next_d.isBefore(end_date)){
// 				child0 = next_balance_amount;
// 				child1 = refund_amount;
// 			}else{
// 				child0 = balance_amount;
// 				child1 = 0;
// 			}
// 			newTr.children[0].innerHTML = child0;
// 			newTr.children[1].innerHTML = child1;
// 			newTr.children[3].innerHTML = next_begin_date.format('YYYY-MM-DD');
//
// 			if(next_begin_date.isBefore(out_account_date)){
// 				child4 = out_account_date.format('YYYY-MM-DD');
// 				child5 = out_account_date.diff(next_begin_date, 'day');
// 				next_begin_date = out_account_date;
// 			}else{
// 				if(next_d.isBefore(refund_date)){
// 					child4 = next_d.format('YYYY-MM-DD');
// 					child5 = next_d.diff(next_begin_date, 'day');
// 					next_begin_date = next_d;
// 				}
// 			}
// 			if(next_begin_date.isBetween(end_date)){
//
// 			}
// 			if(next_begin_date.isSame(refund_date)){
// 				if(next_begin_date.isBefore(end_date)){
// 					var child4_day = "";
// 					if(next_begin_date.date() > out_account_day){
// 						child4_day = next_date;
// 					}else{
// 						child4_day = next_date.subtract(1, 'M');
// 					}
// 					child4 = child4_day.format('YYYY-MM-DD');
// 					child5 = child4_day.diff(next_begin_date, 'day');
// 					next_begin_date = next_d;
// 					document.getElementById("next_begin_date").value = child4;
// 					document.getElementById("balance_amount").value = next_balance_amount;
// 				}else{
// 					child4 = end_date.format('YYYY-MM-DD');
// 					child5 = end_date.diff(next_begin_date, 'day');
// 				}
// 			}else if(next_d.startOf("month").isSame(refund_date.startOf("month"))){
// 				child4 = refund_date.format('YYYY-MM-DD');
// 				child5 = refund_date.diff(next_begin_date, 'day');
// 				next_begin_date = refund_date;
// 			}
// 			newTr.children[4].innerHTML = child4;
// 			newTr.children[5].innerHTML = child5;
// 			if(next_date.isBefore(due_date)){
// 				child2 = rate;
// 				newTr.children[6].innerHTML = (balance_amount*child2*child5/numbers/100).toFixed(4);
// 			}else{
// 				child2 = beyond_rate;
// 			}
// 			newTr.children[2].innerHTML = child2;
//
// //			var date = moment(first_date).add(i, 'M');
// //			//alert(date.format('YYYY-MM-DD'));
// //			var d1 = moment(first_date).add(i, 'M').subtract(1, 'M');
// //			var df = d1.format('YYYY-MM-DD');
// //			var d2 = date.format('YYYY-MM-DD');
// //			var newTr = tbody.firstElementChild.cloneNode(true);
// //
// //			newTr.children[0].innerHTML = total_amount;
// //			newTr.className = total_amount;
// //			if(date.isBefore(end_date)){
// //				newTr.children[4].innerHTML = d2;
// //			}else{
// //				date = end_date;
// //				newTr.children[4].innerHTML = end_date.format('YYYY-MM-DD');
// //			}
// //
// //			if(date.isSameOrAfter(due_date) && d1.isBefore(due_date)){
// //				var newTr1 = tbody.firstElementChild.cloneNode(true);
// //				newTr1.children[0].innerHTML = total_amount;
// //				newTr1.className = total_amount;
// //				newTr1.children[1].innerHTML = rate;
// //				var avgRate1 = (rate/numbers).toFixed(4);
// //				newTr1.children[2].innerHTML = avgRate1;
// //				newTr1.children[3].innerHTML = df;
// //				newTr1.children[4].innerHTML = due;
// //				var days1 = due_date.diff(d1, 'days');
// //				newTr1.children[5].innerHTML = days1;
// //				var rest = (total_amount*avgRate1*days1/100).toFixed(4);
// //				newTr1.children[6].innerHTML = rest;
// //				var avgRate = (beyond_rate/numbers).toFixed(4);
// //				var flRest = (interest*avgRate*lastDays/100).toFixed(4);
// //				newTr1.children[8].innerHTML = flRest;
// //				newTr1.children[9].innerHTML = interest;
// //				lastfRest = parseFloat(lastfRest) + parseFloat(flRest);
// //				qfl	= (parseFloat(flRest) + parseFloat(qfl)).toFixed(4);
// //				newTr1.children[11].innerHTML = qfl;
// //				tbody.appendChild(newTr1);
// //				newTr.children[1].innerHTML = beyond_rate;
// //				newTr.children[2].innerHTML = avgRate;
// //				newTr.children[3].innerHTML = due;
// //				var days = date.diff(due_date, 'days');
// //				newTr.children[5].innerHTML = days;
// //				var fRest = (total_amount*avgRate*days/100).toFixed(4);
// //				newTr.children[7].innerHTML = fRest;
// //				var flRest1 = (interest*avgRate*(parseInt(days)+parseInt(days1))/100).toFixed(4);
// //				newTr.children[8].innerHTML = flRest1;
// //				interest = (parseFloat(rest) + parseFloat(interest)).toFixed(4);
// //				lastRest = (parseFloat(lastRest) + parseFloat(fRest)).toFixed(4);
// //				newTr.children[10].innerHTML = lastRest;
// //				lastFL = (parseFloat(interest) + parseFloat(lastRest)).toFixed(4);
// //				lastfRest = parseFloat(lastfRest) + parseFloat(flRest);
// //				qfl	= (parseFloat(flRest1) + parseFloat(qfl)).toFixed(4);
// //				newTr.children[11].innerHTML = qfl;
// //			}else{
// //				newTr.children[3].innerHTML = df;
// //				var days = date.diff(d1, 'days');
// //				newTr.children[5].innerHTML = days;
// //				if(date.isBefore(due_date)){
// //					newTr.children[1].innerHTML = rate;
// //					var avgRate = (rate/numbers).toFixed(4);
// //					newTr.children[2].innerHTML = avgRate;
// //					var rest = (total_amount*avgRate*days/100).toFixed(4);
// //					newTr.children[6].innerHTML = rest;
// //					interest = (parseFloat(rest) + parseFloat(interest)).toFixed(4);
// //					lastDays = days;
// //				}else{
// //					newTr.children[1].innerHTML = beyond_rate;
// //					var avgRate = (beyond_rate/numbers).toFixed(4);
// //					newTr.children[2].innerHTML = avgRate;
// //					var fRest = (total_amount*avgRate*days/100).toFixed(4);
// //					newTr.children[7].innerHTML = fRest;
// //					lastRest = (parseFloat(lastRest) + parseFloat(fRest)).toFixed(4);
// //					if(date.isBefore(end_date)){
// //						var flLast = ((parseFloat(lastRest) + parseFloat(interest))*avgRate*days/100).toFixed(4);
// //						newTr.children[8].innerHTML = flLast;
// //						qfl	= (parseFloat(flLast) + parseFloat(qfl)).toFixed(4);
// //						newTr.children[11].innerHTML = qfl;
// //					}
// //					newTr.children[10].innerHTML = lastRest;
// //				}
// //
// //			}
// //			newTr.children[9].innerHTML = interest;
// 			tbody.appendChild(newTr);
// 		}
		// newTr.children[0].innerHTML = (parseFloat(balance_amount) - parseFloat(refund_amount)).toFixed(4);
		// newTr.children[1].innerHTML = refund_amount;
		// newTr.children[3].innerHTML = next_begin_date.format('YYYY-MM-DD');


	});
	
	$("#export_btn").click(function(){
		$("#table2html").table2excel({
			exclude: ".noExl",
			name: "Excel Document Name",
			filename: "贷款明细",
			exclude_img: true,
			exclude_links: true,
			exclude_inputs: true
		});
	});

    //    tbody.onclick = function(event){
            //新建触发事件=触发事件的Dom元素本身（触发事件即点击事件）
    //        var target = event.target;

            //如果触发事件的节点名字===a（如果点击a标签）
    //        if(target.nodeName === "A"){

                //如果触发事件的class名字===btn_del（如果点击class名字===btn_del的a标签）
    //           if(target.className === "btn_del"){
                    //移除tody下的孩子（删除点击事件的父节点的父节点，即删除点击的a标签的父节点（td标签)的父节点（tr标签）
    //               tbody.removeChild(target.parentNode.parentNode)
    //            }
                //如果触发事件的class名字===btn_upd（如果点击class名字===btn_upd的a标签）
    //            if(target.className === "btn_upd"){
    //               alert("修改");
    //            }
    //        }
    //   }

};
