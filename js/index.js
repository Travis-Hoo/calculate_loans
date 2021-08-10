window.onload=function(){
	
	var tbody = document.getElementsByTagName("tbody")[0];

	$("#add_btn").click(function(){
		
		$(".put_div input").attr("disabled","disabled");
		$("#add_btn").attr("disabled","disabled");
		
		var table = document.getElementById ("table2html");
		var total_amount = document.getElementById ("total_amount").value;
		
		var first_date = document.getElementById ("first_date").value;		//起算日
		var end_date = moment(document.getElementById ("end_date").value);			//计算截止日
		var due_date = moment(document.getElementById ("due_date").value);			//贷款到期日
		var due = due_date.format('YYYY-MM-DD');
		var rate = document.getElementById ("rate").value;												//年利率
		var beyond_rate = document.getElementById ("beyond_rate").value;								//预期年利率
		var numbers = document.getElementById ("numbers").value;										//年利息日
			
		var interest = 0, lastDays = 0, lastRest = 0, lastfRest = 0, lastFL = 0, qfl = 0;
		for(i = 1; moment(first_date).add(i, 'M').subtract(1, 'M').isSameOrBefore(end_date); i++ ){
			var date = moment(first_date).add(i, 'M');
			//alert(date.format('YYYY-MM-DD'));
			var d1 = moment(first_date).add(i, 'M').subtract(1, 'M');
			var df = d1.format('YYYY-MM-DD');
			var d2 = date.format('YYYY-MM-DD');
			var newTr = tbody.firstElementChild.cloneNode(true);
			
			newTr.children[0].innerHTML = total_amount;
			newTr.className = total_amount;
			if(date.isBefore(end_date)){
				newTr.children[4].innerHTML = d2;
			}else{
				date = end_date;
				newTr.children[4].innerHTML = end_date.format('YYYY-MM-DD');				
			}
			
			if(date.isSameOrAfter(due_date) && d1.isBefore(due_date)){
				var newTr1 = tbody.firstElementChild.cloneNode(true);
				newTr1.children[0].innerHTML = total_amount;
				newTr1.className = total_amount;
				newTr1.children[1].innerHTML = rate;
				var avgRate1 = (rate/numbers).toFixed(4);
				newTr1.children[2].innerHTML = avgRate1;
				newTr1.children[3].innerHTML = df;
				newTr1.children[4].innerHTML = due;
				var days1 = due_date.diff(d1, 'days');
				newTr1.children[5].innerHTML = days1;
				var rest = (total_amount*avgRate1*days1/100).toFixed(4);
				newTr1.children[6].innerHTML = rest;	
				var avgRate = (beyond_rate/numbers).toFixed(4);
				var flRest = (interest*avgRate*lastDays/100).toFixed(4);
				newTr1.children[8].innerHTML = flRest;	
				newTr1.children[9].innerHTML = interest;
				lastfRest = parseFloat(lastfRest) + parseFloat(flRest);
				qfl	= (parseFloat(flRest) + parseFloat(qfl)).toFixed(4);		
				newTr1.children[11].innerHTML = qfl;	
				tbody.appendChild(newTr1);
				newTr.children[1].innerHTML = beyond_rate;
				newTr.children[2].innerHTML = avgRate;
				newTr.children[3].innerHTML = due;
				var days = date.diff(due_date, 'days');
				newTr.children[5].innerHTML = days;
				var fRest = (total_amount*avgRate*days/100).toFixed(4);
				newTr.children[7].innerHTML = fRest;
				var flRest1 = (interest*avgRate*(parseInt(days)+parseInt(days1))/100).toFixed(4);
				newTr.children[8].innerHTML = flRest1;	
				interest = (parseFloat(rest) + parseFloat(interest)).toFixed(4);
				lastRest = (parseFloat(lastRest) + parseFloat(fRest)).toFixed(4);
				newTr.children[10].innerHTML = lastRest;					
				lastFL = (parseFloat(interest) + parseFloat(lastRest)).toFixed(4);
				lastfRest = parseFloat(lastfRest) + parseFloat(flRest);
				qfl	= (parseFloat(flRest1) + parseFloat(qfl)).toFixed(4);		
				newTr.children[11].innerHTML = qfl;	
			}else{
				newTr.children[3].innerHTML = df;
				var days = date.diff(d1, 'days');
				newTr.children[5].innerHTML = days;
				if(date.isBefore(due_date)){
					newTr.children[1].innerHTML = rate;
					var avgRate = (rate/numbers).toFixed(4);
					newTr.children[2].innerHTML = avgRate;
					var rest = (total_amount*avgRate*days/100).toFixed(4);
					newTr.children[6].innerHTML = rest;					
					interest = (parseFloat(rest) + parseFloat(interest)).toFixed(4);
					lastDays = days;
				}else{
					newTr.children[1].innerHTML = beyond_rate;
					var avgRate = (beyond_rate/numbers).toFixed(4);
					newTr.children[2].innerHTML = avgRate;
					var fRest = (total_amount*avgRate*days/100).toFixed(4);
					newTr.children[7].innerHTML = fRest;					
					lastRest = (parseFloat(lastRest) + parseFloat(fRest)).toFixed(4);
					if(date.isBefore(end_date)){
						var flLast = ((parseFloat(lastRest) + parseFloat(interest))*avgRate*days/100).toFixed(4);
						newTr.children[8].innerHTML = flLast;	
						qfl	= (parseFloat(flLast) + parseFloat(qfl)).toFixed(4);		
						newTr.children[11].innerHTML = qfl;						
					}
					newTr.children[10].innerHTML = lastRest;					
				}
				
			}
			newTr.children[9].innerHTML = interest;					
			tbody.appendChild(newTr);
		}


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
