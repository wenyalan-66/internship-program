let util = {};

util.dateFormat = function (date, fmt) {
	var o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds(),
		'q+': Math.floor((date.getMonth() + 3) / 3),  //季度
		'S': date.getMilliseconds() //毫秒
	}
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	for (var k in o) {
		if (new RegExp('(' + k +')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
	}
	return fmt
}
//日期加减运算
util.plusDays = function (date, days) {
	return this.dateFormat(new Date(date.setDate(date.getDate() + days)), 'yyyy-MM-dd')
}

//获取本月最后一天
util.lastDayOfMonth = function (e) {
	const date = new Date(e);
	let year = date.getFullYear();
	let month = date.getMonth();
	let nextMonthFirstDay = new Date();
	let resDay = new Date();
	if (month === 11) {
		year++
		nextMonthFirstDay.setFullYear(year);
		nextMonthFirstDay.setMonth(0);
		nextMonthFirstDay.setDate(1);
	} else {
		nextMonthFirstDay.setFullYear(year);
		nextMonthFirstDay.setMonth(month + 1);
		nextMonthFirstDay.setDate(1);
	}
	resDay = this.plusDays(nextMonthFirstDay, -1)
	return resDay
}

//获取一个月后的日期
util.dayOfNextMonth = function (e) {
	let date = new Date(e);
	let year = date.getFullYear();
	let month = date.getMonth();
	let day = date.getDate();
	let resDay = new Date();
	let plusFactor = 30;

	if (month === 0 && day >= 30) {
		//一月30和31号 取今年二月最后一天
		let febDay = this.plusDays(date, 3);
		resDay = this.lastDayOfMonth(febDay)
		return resDay
	} else if (month === 1) {
		//二月 加数因子 闰年28 平年27
		if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
			plusFactor = 28
		} else {
			plusFactor = 27
		}
	} else {
		//加数因子 大月30 小月29
		if (month === 3 || month === 5 || month === 8 || month === 10) {
			plusFactor = 29
		} else {
			plusFactor = 30
		}
	}
	resDay = this.dateFormat(new Date(date.setDate(date.getDate() + plusFactor)), 'yyyy-MM-dd')
	return resDay
}

export default util