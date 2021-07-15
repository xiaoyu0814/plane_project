
var TimeProgress = {
	_index:0,
	_mProgressTimer:true,
	_speed:1000,
	invelData:10,
	myfun:"",
	unit:"Day",//Day
	maxInvalTime:30,
	maxInvalDay:32*24,
	invelTime:1000*60*60,
	invelHourTime:1000*60*60,
	startTime:"",
	endTime:"",
	dateFormat:function(date){
 		var Year = date.getFullYear();
	    var Month = (date.getMonth()+1) < 10 ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
	    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	    var Hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
	    var Minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	    var Seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		var weekArray = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
	    var week = weekArray[new Date(date).getDay()];

	    return {
	    	Year,Month,currentDate,Hours,Minutes,week,Seconds
	    }
	},
	SetProgressTime:function(fun,startTime,endTime){
		if( typeof fun == "function"){
			TimeProgress.myfun = fun;
		}
		
		TimeProgress.startTime = startTime
		TimeProgress.endTime = endTime
	    $("#progressTime").show();
	    // 开始时间
	    var startDate = new Date(startTime);
	    const { Year,Month,currentDate,Hours,Minutes,week,Seconds } = TimeProgress.dateFormat(startDate)
 		var indexStart1 = Year + "年" + Month + "月"+currentDate+"日   " + Hours + ":" + Minutes+":" + Seconds;
	    var indexStart2 = week + "  " + currentDate + " - " + Hours + ":" + Minutes;
	    var indexStart3 = Hours + ":" + Minutes;
	    var firstStart = Year + "-" + Month + "-" + currentDate;
		
		var testFirstStart = Year + "-" + Month + "-" + currentDate + "-" + Hours;
	    // 结束时间
	    var endDate = new Date(endTime);
	    var endYear = endDate.getFullYear();
	    var endMonth = (endDate.getMonth()+1) < 10 ? "0" + (endDate.getMonth()+1) : (endDate.getMonth()+1);
	    var endcurrentDate = endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate();
	    var endHours = endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours();
	    var endMinutes = endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes();
	    var lastEnd = endYear + "-" + endMonth + "-" + endcurrentDate;
		
		var testLastEnd = endYear + "-" + endMonth + "-" + endcurrentDate + "-" + endHours;
	    $("#scroll_Thumb").html(indexStart1);
	    $(".timecode").html(indexStart1);
		$("#startTime").text(startTime);
	    $("#endTime").text(endTime);
		TimeProgress.setTimeSlotNum(startTime,endTime);
	},
	setNewTime(startTime,endTime){
		TimeProgress.SetProgressTime("",startTime,endTime);
		TimeProgress._index =0;
	},
	setUnit:function(unit){
		TimeProgress.unit = unit;
		TimeProgress.setTimeSlotNum(TimeProgress.startTime,TimeProgress.endTime);
		TimeProgress._index =0;
	},
	setTimeSlotNum:function(startTime,endTime){
		
 		function getTestDateDiff(){
			let _num = TimeProgress.invelHourTime;
			if(TimeProgress.unit == "Hours")_num =  TimeProgress.invelHourTime;
			else if(TimeProgress.unit == "Day")_num = TimeProgress.invelHourTime*24;
			else if(TimeProgress.unit == "Month")_num = TimeProgress.invelHourTime*24*30;
			
			TimeProgress.invelTime = _num
	        var d1=new Date(startTime);
	        var d2=new Date(endTime);
	        return (d2.getTime()-d1.getTime())/(TimeProgress.invelTime); //间隔一小时
	    }
		//返回的是小时间隔
		var numTest = getTestDateDiff();
		console.log(numTest)
		// if(numTest>TimeProgress.maxInvalDay){
		// 	TimeProgress.invelTime = TimeProgress.invelTime*24*30;
			
		// }else if(numTest>TimeProgress.maxInvalTime){
		// 	TimeProgress.invelTime = TimeProgress.invelTime*24;
		// }
		// numTest = getTestDateDiff();
		console.log(numTest)
		var strTest = '';
	    for(var i = 0; i < numTest; i ++){
	        var d1 = new Date(startTime);
	        var d2 = new Date(d1);
	        d2.setTime(d1.getTime() + i*TimeProgress.invelTime); //显示间隔
	        const { Year,Month,currentDate,Hours,Minutes,week,Seconds } = TimeProgress.dateFormat(d2);
	        var _string = "";
	        // if(TimeProgress.invelTime<24*60*60*1000){
			// 	_string= Hours+":"+Minutes;
	        // }else if(TimeProgress.invelTime<24*60*60*1000*30){
	        // 	_string = currentDate + '日'
	        // }else {
	        // 	_string = Month + '月'
	        // }
			if(TimeProgress.unit == "Hours")_string= Hours;
			else if(TimeProgress.unit == "Day")_string = currentDate + '日';
			else if(TimeProgress.unit == "Month")_string = Month + '月';
	        strTest += '<p>'+_string  +'</p>';
	    }
		$(".time_slot").html(strTest);
		$(".time_slot p").css({"width":"calc("+100/numTest+"% - 1px)"});
		//设置最大值
		var qdsjDate = new Date(startTime);
		var jssjDate = new Date(endTime);
		ScrollBar.value = 0;
		ScrollBar.maxValue = Math.abs(qdsjDate - jssjDate) / 1000 / 60 /TimeProgress.invelData; //间隔跳跃值
		//初始化
		ScrollBar.Initialize();
		TimeProgress._index =0;
	},
	SetTime:function(value) {
	    var start = $("#startTime").html();
	    var startDate = new Date(start);
	    //startDate.setHours(startDate.getHours() + 1 * value);//十五分钟为进度
		startDate.setTime(startDate.getTime() + value*60*1000*TimeProgress.invelData); //10分钟为进度
	    const { Year,Month,currentDate,Hours,Minutes,week,Seconds } = TimeProgress.dateFormat(startDate);
	    var indexStart1 = Year + "年" + Month + "月"+currentDate+"日   " + Hours + ":" + Minutes+":" + Seconds;
	    var indexStart = Year + "/" + Month + "/" + currentDate + " " + Hours + ":" + Minutes + ":" + Seconds;
	    $("#scroll_Thumb").html(indexStart1);
	    if (window.parent.currentTime) {
	        currentTime = indexStart;
	    }
	    if (typeof (TimeProgress.myfun) == "function") {
			TimeProgress.myfun(indexStart)
	        // var jscode = new Function('return ' + TimeProgress.myfun)();
	        // jscode(indexStart)
	    }
	},
	SetTime1:function(value) {
	    var start = $("#startTime").html();
	    var startDate = new Date(start);
	   // startDate.setHours(startDate.getHours() + 1 * value);//十五分钟为进度
	    startDate.setTime(startDate.getTime() + value*60*1000*TimeProgress.invelData); //10分钟为进度
	    const { Year,Month,currentDate,Hours,Minutes,week,Seconds } = TimeProgress.dateFormat(startDate);
	    var indexStart2 = Year + "年" + Month + "月"+currentDate+"日   " + Hours + ":" + Minutes+":" + Seconds;
	    var indexStart = Year + "/" + Month + "/" + currentDate + " " + Hours + ":" + Minutes + ":" + Seconds;
	    //var indexStart = Hours + ":" + Minutes;
	    $(".timecode").html(indexStart2);
	    if (window.parent.currentTime) {
	        currentTime = indexStart;
	    }
	    if (typeof (TimeProgress.myfun) == "function") {
			//TimeProgress.myfun(indexStart)
	        // var jscode = new Function('return ' + TimeProgress.myfun)();
	        // jscode(indexStart)
	    }
	},
	progressTimeControl(img) {
	    if ($(img).attr("title") == "暂停") {
	        $(img).attr("title", "开始");
	        $(img).css("background-image", "url(./static/img/play_time.png)");
	        TimeProgress._mProgressTimer = false;
	    }else {
	        $(img).attr("title", "暂停");
			$(img).css("background-image", "url(./static/img/pause_time.png)");
			TimeProgress._mProgressTimer = true;
	        TimeProgress.run();
	    }
	},
	run:function(){
		if (TimeProgress._index <= ScrollBar.maxValue) {
			TimeProgress._index += 1;
			console.log(TimeProgress._index);
			ScrollBar.SetValue(TimeProgress._index);
			TimeProgress.SetTime(TimeProgress._index)
		}else {
			TimeProgress.progressTimeStop()
		}
		setTimeout(function(){
			if(TimeProgress._mProgressTimer){
				 TimeProgress.run();
			}
		},TimeProgress._speed);
	},
	progressTimeStop:function() {
	    $("#progressTime_control").attr("title", "开始");
	    $("#progressTime_control").css("background-image", "url(./static/img/play_time.png)");
	    $("#scroll_Thumb").css("margin-left", "0px");
	    $("#scroll_Track").css("width", "0px");
	    ScrollBar.value = 0;
	    TimeProgress._index = 0;
	    //TimeProgress._speed = 1000;
	    TimeProgress._mProgressTimer = false;
	    TimeProgress.SetTime(ScrollBar.value);
	    TimeProgress.SetInterval(TimeProgress._index);
	},
	SetInterval(_index) {
		TimeProgress._mProgressTimer = false;
	    if ($("#progressTime_control").attr("title") == "开始") {
	        ScrollBar.SetValue(_index);
	        TimeProgress.SetTime(_index)
	    }else{
	        TimeProgress.run();
	    }
	}

}
//滑块
var ScrollBar = {
    value: 0,
    maxValue: 40,
    step: 1,
    currentX: 0,
    Initialize: function () {
        if (this.value > this.maxValue) {
            alert("给定当前值大于了最大值");
            return;
        }
        this.GetValue();
        $("#scroll_Track").css("width", this.currentX + "px");
        $("#scroll_Thumb").css("margin-left", this.currentX + "px");
        this.Value();
    },
    SetValue: function (aValue) {
        this.value = aValue;
        if (this.value >= this.maxValue) this.value = this.maxValue;
        if (this.value <= 0) this.value = 0;
        var mWidth = this.value / this.maxValue * $("#scrollBar").width() + "px";
        $("#scroll_Track").css("width", mWidth);
        $("#scroll_Thumb").css("margin-left", mWidth);
    },
    Value: function () {
        var valite = false;
        var currentValue;
        // 点击进度条时滑块到达对应位置
        $("#scrollBarBox").click(function (event) {
            var changeX = event.clientX - ScrollBar.currentX;
            currentValue = changeX - ScrollBar.currentX - $("#scrollBar").offset().left;
            $("#scroll_Thumb").css("margin-left", currentValue + "px");
            $("#scroll_Track").css("width", currentValue + 2 + "px");
            if ((currentValue + 1) >= $("#scrollBar").width()) {
                $("#scroll_Thumb").css("margin-left", $("#scrollBar").width() - 1 + "px");
                $("#scroll_Track").css("width", $("#scrollBar").width() + 2 + "px");
                ScrollBar.value = ScrollBar.maxValue;
            } else if (currentValue <= 0) {
                $("#scroll_Thumb").css("margin-left", "0px");
                $("#scroll_Track").css("width", "0px");
                ScrollBar.value = 0;
            } else {
                ScrollBar.value = Math.round(currentValue * ScrollBar.maxValue / $("#scrollBar").width());
			}
			TimeProgress._index = ScrollBar.value;
			TimeProgress.SetInterval(TimeProgress._index);
            
        });
        // 鼠标在进度条上面滑动时小滑块显示并对应相应的时间
        $("#scrollBarBox").mousemove(function (event) {
            var changeX = event.clientX - ScrollBar.currentX;
            currentValue = changeX - ScrollBar.currentX - $("#scrollBar").offset().left;
            $(".timecode").show().css("left", currentValue -130 + "px");
            if ((currentValue + 1) >= $("#scrollBar").width()) {
                $(".timecode").css("left", $("#scrollBar").width() - 43 + "px");
                ScrollBar.value = ScrollBar.maxValue;
            } else if (currentValue <= 0) {
                $(".timecode").css("left", "-28px");
                ScrollBar.value = 0;
            } else {
                ScrollBar.value = Math.round(currentValue * ScrollBar.maxValue / $("#scrollBar").width());
            }
            TimeProgress.SetTime1(ScrollBar.value);
        });
        // 鼠标移入进度条时小滑块显示
        $("#scrollBarBox").mouseover(function (event) {
            $(".timecode").show();
        });
        // 鼠标移除进度条时小滑块消失
        $("#scrollBarBox").mouseout(function (event) {
            $(".timecode").hide();
        });
    },
    GetValue: function () {
        this.currentX = $("#scrollBar").width() * (this.value / this.maxValue);
    }
}