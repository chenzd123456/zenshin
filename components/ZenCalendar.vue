<template>
  <div class="calendar-container">
    <h1 class="calendar-header font">
      <span class="clickable" @click="prevMonth">&lt;&lt;</span>
      {{ currentDay }} {{ currentMonth }} {{ currentYear }}
      <span class="clickable" @click="nextMonth">&gt;&gt;</span>
    </h1>
    <table>
      <thead>
        <tr>
          <th v-for="day in days" :key="day" class="cell font">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in  getCalendar " :key="index">
          <td v-for="(day, dayIndex) in  week " :key="dayIndex" class="cell">
            <span
              :class="{ today: isToday(day), weekend: isWeekend(dayIndex), notCurrentMonth: !isCurrentMonth(day), workday: isWorkday(day), holiday: isHoliday(day) }"
              class="day">{{ day.date() }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import dayjs from "dayjs";
import holidaysCn from "@/static/holiday-cn.json";
dayjs.locale('zh-cn');
export default defineComponent({
  name: "ZenCalendar",
  setup() {
    const days = ["日", "一", "二", "三", "四", "五", "六"];
    const today = ref(dayjs());
    const currentMonth = computed(() => today.value.format("MMMM"));
    const currentYear = computed(() => today.value.format("YYYY"));
    const currentDay = computed(() => today.value.format("DD"));

    const getCalendar = computed(() => {
      const startDay = today.value.startOf("month").startOf("week");
      const endDay = today.value.endOf("month").endOf("week");
      const weeks = [];
      let days = [];
      for (let i = startDay; i.isBefore(endDay); i = i.add(1, "day")) {
        days.push(i);
        if (days.length === 7) {
          weeks.push(days);
          days = [];
        }
      }
      return weeks;
    });

    function nextMonth() {
      today.value = today.value.add(1, "month");
    }

    function prevMonth() {
      today.value = today.value.subtract(1, "month");
    }

    function isToday(day) {
      return dayjs().isSame(day, "day");
    }

    function isWeekend(index) {
      return index === 0 || index === 6;
    }

    function isCurrentMonth(day) {
      return day.month() === today.value.month();
    }

    function isHoliday(day) {
      const date = day.format("YYYY-MM-DD");

      const holidaysCnYears = holidaysCn.filter(data => data.year >= parseInt(currentYear.value)).sort((a, b) => { return a.years - b.years })
      let ret = false;

      holidaysCnYears.forEach(element => {
        const days = element.days.filter(day => day.date === date)
        if (days.length !== 0) {
          ret = days[0].isOffDay;
        }
      });

      return ret;
    }

    function isWorkday(day) {
      const date = day.format("YYYY-MM-DD");
      const holidaysCnYears = holidaysCn.filter(data => data.year >= parseInt(currentYear.value)).sort((a, b) => { return a.years - b.years })
      let ret = false;

      holidaysCnYears.forEach(element => {
        const days = element.days.filter(day => day.date === date)
        if (days.length !== 0) {
          ret = !days[0].isOffDay;
        }
      });

      return ret;
    }

    return {
      days,
      currentMonth,
      currentYear,
      currentDay,
      getCalendar,
      nextMonth,
      prevMonth,
      isToday,
      isWeekend,
      isCurrentMonth,
      isHoliday,
      isWorkday
    };
  },
});
</script>
<style scoped>
.calendar-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.cell {
  text-align: center;
  height: 3rem;
}

.today {
  border-radius: 50%;
  border: 2px solid red;
}

.weekend {
  color: orangered;
}

.notCurrentMonth {
  color: gray;
}

.calendar-header {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.clickable {
  cursor: pointer;
}

.font {
  font-size: 1rem;
}

.day {
  position: relative;
  width: 2rem;
  height: 2rem;
}

.holiday::before {
  content: "休";
  font-size: 0.4rem;
  position: absolute;
  top: -16px;
  left: -16px;
  z-index: 1;
  color: white;
  background-color: green;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.workday::before {
  content: "班";
  font-size: 0.4rem;
  position: absolute;
  top: -16px;
  left: -16px;
  z-index: 1;
  color: white;
  background-color: red;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}
</style>