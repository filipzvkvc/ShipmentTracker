const sequelize = require('sequelize');
const moment = require('moment');
const Shipment = require('../models/Shipment');
const Op = sequelize.Op;
const ItemType = require('../models/ItemType');
const User = require('../models/User');
const CargoToItemType = require('../models/CargoToItemType');
const Cargo = require('../models/Cargo');
const { date } = require('joi');

function getMonthName(monthId) {
    const names = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return names[monthId - 1] || '';
}


async function getBymonth(req, res, next) {
    const dateFrom = req.params.dateFrom;
    const dateTo = req.params.dateTo;

    const [yearFrom, monthFrom] = dateFrom.split('-');
    const [yearTo, monthTo] = dateTo.split('-');
    const dateToLastDay = new Date(Number(yearTo), Number(monthTo), 0).getDate();


    try {
        let results = await Shipment.findAll({
            where: {
                createdAt: {
                    // [Op.between]: [`${dateFrom} 00:00:00`, `${dateTo} 00:00:00`]
                    [Op.between]: [`${dateFrom}`, `${dateTo}-${dateToLastDay}`]
                    // [Op.between]: ["2021-01-1 12:49:36", "2022-12-31 12:49:36"]
                }
            },
            attributes: [
                [sequelize.fn('year', sequelize.col('createdAt')), 'year'],
                [sequelize.fn('month', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('sum', sequelize.col('ticketPrice')), 'total_amount'],
                [sequelize.fn('sum', sequelize.col('cargoTicketPrice')), 'total_carGoamount'],
                [sequelize.fn('count', sequelize.col('id')), 'total_flights'],
            ],
            group: [
                sequelize.fn('year', sequelize.col('createdAt')),
                sequelize.fn('month', sequelize.col('createdAt')),
            ],
        })
        results = JSON.stringify(results);
        results = JSON.parse(results);
        const monthsInYear = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        /*const months = result.map(el => el.month);
        monthsInYear.forEach((el, index) => {
            if (!months.includes(el)) {
                result.push({ month: el, total_amount: 0, total_carGoamount: 0 })
            }
        })*/

        const yearMonthSet = results.map(r => r.year + ' ' + (r.month > 9 ? r.month : '0' + r.month));

        if (yearMonthSet.length === 0) {
            let cur = moment(`${yearFrom}-${monthFrom}`, 'YYYY-MM');
            const end = moment(`${yearTo}-${monthTo}`, 'YYYY-MM');
            while (cur.isSameOrBefore(end, 'month')) {
                results.push({ year: cur.year(), month: cur.month() + 1, total_amount: 0, total_carGoamount: 0, total_flights: 0 });
                cur.add(1, 'month');
            }
            return res.status(200).json(results);
        }

        if (Number(yearFrom) == Number(yearMonthSet[0].split(' ')[0]) && Number(monthFrom) + 1 == Number(yearMonthSet[0].split(' ')[1])) {
            results.push({ year: Number(yearFrom), month: Number(monthFrom), total_amount: 0, total_carGoamount: 0, total_flights: 0 })
        }

        if (dateFrom.split('-').join(' ') !== yearMonthSet[0]) {
            yearMonthSet.unshift(dateFrom.split('-')[0] + ' ' + dateFrom.split('-')[1])
        }


        if (dateTo.split('-').join(' ') !== yearMonthSet[yearMonthSet.length - 1]) {
            yearMonthSet.push(dateTo.split('-')[0] + ' ' + dateTo.split('-')[1])
        }


        let startDateMoment;
        let endDateMoment;





        for (let i = 0; i < yearMonthSet.length - 1; i++) {
            let startDate = yearMonthSet[i];
            let endDate = yearMonthSet[i + 1];

            startDateMoment = moment(`${startDate.split(' ')[0]}-${startDate.split(' ')[1]}`, "YYYY-MM");
            endDateMoment = moment(`${endDate.split(' ')[0]}-${endDate.split(' ')[1]}`, "YYYY-MM");

            if (startDate.split(' ')[0] === endDate.split(' ')[0] && Number(startDate.split(' ')[1]) + 1 === Number(endDate.split(' ')[1])) {
                continue;
            }

            if (Number(startDate.split(' ')[0]) + 1 === Number(endDate.split(' ')[0]) && Number(startDate.split(' ')[1]) === 12 && Number(endDate.split(' ')[1] === 1)) {
                continue;
            }



            if (i == 0) {
                results.push({ year: startDateMoment.year(), month: startDateMoment.month() + 1, total_amount: 0, total_carGoamount: 0, total_flights: 0 })
            }
            startDateMoment.add(1, "month");
            while (startDateMoment.isBefore(endDateMoment)) {
                results.push({ year: startDateMoment.year(), month: (startDateMoment.month() + 1), total_amount: 0, total_carGoamount: 0, total_flights: 0 })
                startDateMoment.add(1, "month");

            }

        }

        results.sort((a, b) => {
            if (a.year - b.year < 0) {
                return -1;
            }
            if (a.year - b.year === 0) {
                if (a.month - b.month < 0) {
                    return -1;
                } else if (a.month - b.month === 0) {
                    return 0;
                } else {
                    return 1;
                }
            }
            return 1;
        })


        if (results[results.length - 1].month != Number(monthTo)) {
            results.push({ year: endDateMoment.year(), month: endDateMoment.month() + 1, total_amount: 0, total_carGoamount: 0, total_flights: 0 })
        }


        // console.log(results[results.length - 1].month);
        // console.log(Number(monthTo));
        // console.log(results);
        return res.status(200).json(results);
    }
    catch (error) {
        next(error);
    }
}

async function getStatisticksForItemTypes(req, res, next) {


    try {
        let results = await CargoToItemType.findAll({
            include: [{
                model: Cargo,
                as: 'cargo',
                attributes: []
            }, {
                model: ItemType,
                as: 'itemType',
                attributes: ['name']
            }],
            attributes: [
                'item_type_id',
                [sequelize.fn('sum', sequelize.col('cargo.quantity')), 'total_solded']
            ],
            group: ['CargoToItemType.item_type_id', 'itemType.name'],
        })
        results = JSON.stringify(results);
        results = JSON.parse(results);

        return res.status(200).json(results);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getBymonth,
    getStatisticksForItemTypes
};