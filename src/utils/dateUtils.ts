class DateUtils {
  /**
   * 格式化日期为指定格式
   * @param date - 要格式化的日期
   * @param format - 格式字符串，支持 'YYYY-MM-DD'、'YYYY-MM-DD HH:mm:ss' 等格式
   * @returns 格式化后的日期字符串
   */
  formatDate(date: Date, format: string = "YYYY-MM-DD"): string {
    if (!date) return "";
    const map: { [key: string]: string } = {
      YYYY: date.getFullYear().toString(),
      MM: String(date.getMonth() + 1).padStart(2, "0"),
      DD: String(date.getDate()).padStart(2, "0"),
      hh: String(date.getHours()).padStart(2, "0"),
      mm: String(date.getMinutes()).padStart(2, "0"),
      ss: String(date.getSeconds()).padStart(2, "0")
    };
    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, matched => map[matched]);
  }

  /**
   * 解析日期字符串为 Date 对象
   * @param dateString - 日期字符串
   * @param format - 格式字符串，支持 'YYYY-MM-DD'、'YYYY-MM-DD HH:mm:ss' 等格式
   * @returns 解析后的 Date 对象
   */
  parseDate(dateString: string, format: string = "YYYY-MM-DD"): Date {
    const regex = format
      .replace(/YYYY/, "(\\d{4})")
      .replace(/MM/, "(\\d{2})")
      .replace(/DD/, "(\\d{2})")
      .replace(/HH/, "(\\d{2})")
      .replace(/mm/, "(\\d{2})")
      .replace(/SS/, "(\\d{2})");
    const match = new RegExp(regex).exec(dateString);
    if (match) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = match
        .slice(1)
        .map(Number);
      return new Date(year, month - 1, day, hour, minute, second);
    }
    throw new Error("Invalid date format");
  }

  /**
   * 获取当前时间的时间戳
   * @returns 当前时间的时间戳
   */
  getCurrentTimestamp(): number {
    return Date.now();
  }

  /**
   * 获取当前时间的 Date 对象
   * @returns 当前时间的 Date 对象
   */
  getCurrentDate(): Date {
    return new Date();
  }

  /**
   * 比较两个日期
   * @param date1 - 第一个日期
   * @param date2 - 第二个日期
   * @returns 如果 date1 小于 date2 返回负值，等于返回 0，大于返回正值
   */
  compareDates(date1: Date, date2: Date): number {
    return date1.getTime() - date2.getTime();
  }

  /**
   * 在给定日期上添加天数
   * @param date - 原始日期
   * @param days - 要添加的天数
   * @returns 添加天数后的新日期
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * 在给定日期上添加月份
   * @param date - 原始日期
   * @param months - 要添加的月份数
   * @returns 添加月份后的新日期
   */
  addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * 在给定日期上添加年份
   * @param date - 原始日期
   * @param years - 要添加的年份数
   * @returns 添加年份后的新日期
   */
  addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  /**
   * 获取两个日期之间的天数差
   * @param date1 - 第一个日期
   * @param date2 - 第二个日期
   * @returns 两个日期之间的天数差
   */
  getDaysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * 判断是否为有效的日期
   * @param date - 要检查的日期
   * @returns 如果是有效的日期返回 true，否则返回 false
   */
  isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * 获取当前日期的零点和23:59:59时间
   * @returns 包含两个字符串的数组，第一个是当天的零点，第二个是当天的23:59:59
   */
  getStartEndOfDay(): [string, string] {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    return [
      this.formatDate(startOfDay, "YYYY-MM-DD hh:mm:ss"),
      this.formatDate(endOfDay, "YYYY-MM-DD hh:mm:ss")
    ];
  }

  /**
   * 获取 N 天前的开始和结束时间
   * @param n - 天数
   * @returns 包含两个字符串的数组，第一个是 N 天前的开始时间，第二个是 N 天前的结束时间
   **/
  getTimeRangeForLastNDays(n) {
    const result = [];
    // 获取当天时间并设置到当天23:59:59
    const endTime = new Date();
    endTime.setHours(23, 59, 59, 999);

    // 获取N天前的时间并设置到当天的0:00:00
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - n);
    startTime.setHours(0, 0, 0, 0);

    // 格式化日期为字符串 "YYYY-MM-DD HH:mm:ss"
    const formatDate = date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    result.push(formatDate(startTime), formatDate(endTime));

    return result;
  }

  /**
   * 获取当前月份第一天和最后一天
   * @param n - 天数
   * @
   **/
  getFirstAndLastDayOfCurrentMonth() {
    const result = [];

    // 获取当前日期
    const now = new Date();

    // 获取当前月份的第一天
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    // 获取当前月份的最后一天
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 格式化日期为字符串 "YYYY-MM-DD HH:mm:ss"
    const formatDate = date => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // 设置格式化的结果：第一天00:00:00 和 最后一天23:59:59
    result.push(formatDate(new Date(firstDay.setHours(0, 0, 0, 0))));
    result.push(formatDate(new Date(lastDay.setHours(23, 59, 59, 999))));

    return result;
  }

  convertToChinaTime(inputTime, withTimezone = false) {
    if (!inputTime) return inputTime;

    // 解析输入时间为 Date 对象
    const localDate = new Date(inputTime);
    if (isNaN(localDate.getTime())) return "Invalid Date";

    // 获取年月日时分秒
    const year = localDate.getFullYear();
    const month = (localDate.getMonth() + 1).toString().padStart(2, "0");
    const day = localDate.getDate().toString().padStart(2, "0");
    const hours = localDate.getHours().toString().padStart(2, "0");
    const minutes = localDate.getMinutes().toString().padStart(2, "0");
    const seconds = localDate.getSeconds().toString().padStart(2, "0");

    if (withTimezone) {
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+08:00`;
    }

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 处理当地时差问题
   * @param inputTime - 输入时间
   * @param withTimezone - 是否带时区
   * @returns 处理后的时间字符串
   */
  handleTimezone(inputTime, _withTimezone = false) {
    if (!inputTime) return inputTime;

    // 解析输入时间为 Date 对象
    const utcDate = new Date(inputTime);
    const localOffset = utcDate.getTimezoneOffset() * 60000;
    return new Date(utcDate.getTime() - localOffset);
  }
}

export default new DateUtils();
