const differenceInDays = require('date-fns/differenceInDays');
const eachDayOfInterval = require('date-fns/eachDayOfInterval')
const endOfDay = require('date-fns/endOfDay')
const eachWeekOfInterval = require('date-fns/eachWeekOfInterval')
const endOfWeek = require('date-fns/endOfWeek');
const eachMonthOfInterval = require('date-fns/eachMonthOfInterval');
const endOfMonth = require('date-fns/endOfMonth');
const eachYearOfInterval = require('date-fns/eachYearOfInterval');
const endOfYear = require('date-fns/endOfYear');
const intervalToDuration = require('date-fns/intervalToDuration');
const getDate = require('date-fns/getDate');
const getMonth = require('date-fns/getMonth');
const getYear = require('date-fns/getYear');
const getDay = require('date-fns/getDay');

const sequelize = require('sequelize');

const { STATS_RESOLUTION_TYPES, STATS_MODEL_TYPES_NUMBERS} = require("../constants/appConstants");
const { REG_ATTR } = require('../constants/modelConstants');

//const DAY = 1000 * 60 * 60 * 24;
const DAY = 1;
const WEEK = 7 * DAY;
const MONTH = 31 * DAY;
const YEAR = 365 * DAY;
const LOCALE = 'en-US';

const WEEK_DAYS_MAP = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_MAP = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



const STRATEGY_FACTORIES = {
  [STATS_MODEL_TYPES_NUMBERS.REGISTRATIONS] : () => generateSingleAttrRegistrationsStrategy,
  [STATS_MODEL_TYPES_NUMBERS.REVENUE_ALL] : () => generateSingleAttrRevenuStrategy,
  [STATS_MODEL_TYPES_NUMBERS.INSURANCE]  : () => generateSingleAttrRevenuInsuranceStrategy,
  [STATS_MODEL_TYPES_NUMBERS.REVENUE_SERVICE] : () => generateSingleAttrRevenuServiceStrategy
}


/**@typedef { "days" | "weeks" | "months" | "years" } RESOLUTION_TYPES */
/**@type { function( Date, Date ) : RESOLUTION_TYPES  */
function detectResolution(startDate, endDate){  
  const daysInIntervals = differenceInDays(endDate, startDate)
  if(daysInIntervals <= 2 * WEEK){
    return STATS_RESOLUTION_TYPES.DAYS;
  }else if( daysInIntervals <= 1.5 * MONTH){
    return STATS_RESOLUTION_TYPES.WEEKS
  }else if( daysInIntervals < 2 * YEAR){
    return STATS_RESOLUTION_TYPES.MONTHS
  }else {
    return STATS_RESOLUTION_TYPES.YEARS;
  }
}
/**@type { function( Date, Date , RESOLUTION_TYPES) : [[Date, Date]]   */
function generateResolutionIntervals(startDate, endDate, resolution){
  const tempInterval = {start : startDate, end: endDate};

  switch(resolution){
    case STATS_RESOLUTION_TYPES.DAYS : 
      return eachDayOfInterval(tempInterval).map( lmdDay => [lmdDay, endOfDay(lmdDay)]);
    
    case STATS_RESOLUTION_TYPES.WEEKS :
      return eachWeekOfInterval(tempInterval).map(lmdWeek => [lmdWeek, endOfWeek(lmdWeek)] );

    case STATS_RESOLUTION_TYPES.MONTHS :
        return eachMonthOfInterval(tempInterval).map( lmdMonth => [lmdMonth, endOfMonth(lmdMonth)] );
    
    case STATS_RESOLUTION_TYPES.YEARS :      
      return eachYearOfInterval(tempInterval).map( lmdYear => [lmdYear, endOfYear(lmdYear)] );

    default:
      throw new Error("Unsupported date time resolution");
  }
}

/**@type { (intervals : [[Date,Date]]) => AttributeInArray[]} */
function generateAttributes( intervalsArray, statsTypeNum){  
  const strategy = STRATEGY_FACTORIES[statsTypeNum]();
  return intervalsArray.map( strategy )  
}


/**@typedef { sequelize.Utils.Fn} Fn */
/**@typedef { sequelize.Utils.Col } Col */
/**@typedef { sequelize.Utils.Literal} Literal */
/**@typedef { [Fn | Col | Literal, string] } AttributeInArray  */

/**@private */
/**@type { (  interval : [Date, Date], name : number | string) => AttributeInArray}   */
function generateSingleAttrRegistrationsStrategy( interval, name) {
  const [startDate, endDate] = interval;
  const start = startDate.getTime();
  const end = endDate.getTime();
  
  return [ sequelize.fn('COUNT', 
            sequelize.fn('IF', sequelize.literal(`${REG_ATTR.REGISTRATION_DATE} BETWEEN ${start} AND ${end}`), 1, null )),               
          'P' + String(name + 1) ] ;
  

/*
  return [sequelize.literal(`(count(if(${REG_ATTR.REGISTRATION_DATE} between ${start} and ${end}, 1, null)) )`), "P" + String(name) ];
  */
}

/**@private */
/**@type { (  interval : [Date, Date], name : number | string) => AttributeInArray}   */
function generateSingleAttrRevenuStrategy( interval, name) {
  const [startDate, endDate] = interval;
  const start = startDate.getTime();
  const end = endDate.getTime();
  
  return [ sequelize.fn('SUM', 
            sequelize.fn('IF', sequelize.literal(`${REG_ATTR.REGISTRATION_DATE} BETWEEN ${start} AND ${end}`), sequelize.literal(`${REG_ATTR.INSURANCE_PRICE} + ${REG_ATTR.AGENCY_SERVICE_PRICE}`), 0 )),               
          'P' + String(name + 1) ] ;
  

/*
  return [sequelize.literal(`(count(if(${REG_ATTR.REGISTRATION_DATE} between ${start} and ${end}, 1, null)) )`), "P" + String(name) ];
  */
}

/**@private */
/**@type { (  interval : [Date, Date], name : number | string) => AttributeInArray}   */
function generateSingleAttrRevenuInsuranceStrategy( interval, name) {
  const [startDate, endDate] = interval;
  const start = startDate.getTime();
  const end = endDate.getTime();
  
  return [ sequelize.fn('SUM', 
            sequelize.fn('IF', sequelize.literal(`${REG_ATTR.REGISTRATION_DATE} BETWEEN ${start} AND ${end}`), sequelize.literal(`${REG_ATTR.INSURANCE_PRICE}`), 0 )),               
          'P' + String(name + 1) ] ;
  
}

function generateSingleAttrRevenuServiceStrategy( interval, name) {
  const [startDate, endDate] = interval;
  const start = startDate.getTime();
  const end = endDate.getTime();
  
  return [ sequelize.fn('SUM', 
            sequelize.fn('IF', sequelize.literal(`${REG_ATTR.REGISTRATION_DATE} BETWEEN ${start} AND ${end}`), sequelize.literal(`${REG_ATTR.AGENCY_SERVICE_PRICE}`), 0 )),               
          'P' + String(name + 1) ] ;
  
}



/** @type { ( findOptionsObj : object, intervalsArray : [[Date, Date]] ) => object } */
function assignColumns(findOptionsObj, intervalsArray, statsTypeNum ){  
  if(! findOptionsObj.attributes) findOptionsObj.attributes = [];  

  generateAttributes( intervalsArray, statsTypeNum )
    .forEach( lmdAttrArray => findOptionsObj.attributes.push( lmdAttrArray ) );

    return findOptionsObj;
}


function isSingleDay(startDate, endDate){
  const { years, months, days } =  intervalToDuration(startDate, endDate);
  return years === 0 && months === 0 && days === 0;
}

function formatDay(day, month){
  return month ? `${day}.${month}`  : `${day}`;
}

function formatDaysInterval(startDay, endDay){
  return `${startDay}-${endDay}`
}

function formatMonth(monthIndex, year){
  return ! year ? MONTHS_MAP[monthIndex] : `${monthIndex + 1}/${year}`;
}

function formatYear(year){
  return `${year}`
}

/** @type { ( intervalsArray : [[Date, Date]], resolution : string)} */
function generateLabels(intervalsDateArray, resolution){
  switch(resolution){
    case STATS_RESOLUTION_TYPES.DAYS : 
      return intervalsDateArray.map( ([lmdStartDate]) => formatDay(getDate(lmdStartDate), intervalsDateArray.length > 30 ? getMonth(lmdStartDate) + 1 : null ) )
    
    case STATS_RESOLUTION_TYPES.WEEKS :
      return intervalsDateArray.map( ([lmdStartDate, lmdEndDate]) => formatDaysInterval(getDate(lmdStartDate), getDate(lmdEndDate) )  )

    case STATS_RESOLUTION_TYPES.MONTHS :
      return intervalsDateArray.map( ([lmdStartDate, lmdEndDate]) => formatMonth( getMonth(lmdStartDate) , intervalsDateArray.length > 12 ? getYear(lmdStartDate) : null)  );
    
    case STATS_RESOLUTION_TYPES.YEARS :      
      return intervalsDateArray.map( ([lmdStartDate, lmdEndDate]) => formatYear( getYear(lmdStartDate) ) );

    default:
      throw new Error("Unsupported date time resolution");
  } 
}

function generateExtraLabels(intervalsDateArray, resolution){
  if(resolution === STATS_RESOLUTION_TYPES.DAYS){
    return intervalsDateArray.map( ([lmdStartDate]) => WEEK_DAYS_MAP[ getDay(lmdStartDate) ] );
  }else {
    return [[]];
  }
}

module.exports = {
  detectResolution,
  generateResolutionIntervals,
  generateAttributes,
  isSingleDay,
  assignColumns,
  generateLabels,
  generateExtraLabels
}