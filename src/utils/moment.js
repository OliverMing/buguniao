const moment = require('moment');
// 或者 import moment from 'moment'

const calculateWeekPeriods = () => {
    const today = moment();
    const dayOfWeek = today.isoWeekday();

    // 计算本周的起始日期和结束日期
    const startDateThisWeek = today.clone().startOf('isoWeek');
    const endDateThisWeek = today.clone().endOf('isoWeek');

    // 计算上周和下周的起始日期和结束日期
    const startDateLastWeek = startDateThisWeek.clone().subtract(1, 'week');
    const endDateLastWeek = startDateLastWeek.clone().endOf('isoWeek');
    const startDateNextWeek = startDateThisWeek.clone().add(1, 'week');
    const endDateNextWeek = startDateNextWeek.clone().endOf('isoWeek');

    // 格式化日期范围
    const formatDateRange = (startDate, endDate) => {
        return `${startDate.format('YYYY-MM-DD')}~${endDate.format('YYYY-MM-DD')}`;
    };

    // 生成周期数组
    const weekPeriods = [
        { label: '上周', dateRange: formatDateRange(startDateLastWeek, endDateLastWeek) },
        { label: '这周', dateRange: formatDateRange(startDateThisWeek, endDateThisWeek) },
        { label: '下周', dateRange: formatDateRange(startDateNextWeek, endDateNextWeek) }
    ];

    return weekPeriods;
}


export default{
    calculateWeekPeriods
}