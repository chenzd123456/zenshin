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
        <tr v-for="(week, index) in getCalendar" :key="index">
          <td v-for="(day, dayIndex) in week" :key="day"
            :class="{ today: isToday(day), weekend: isWeekend(dayIndex), notCurrentMonth: !isCurrentMonth(day) }"
            class="cell">
            {{ day.date() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from "vue";
import dayjs from "dayjs";

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
  margin: 1rem;
}

.today {
  color: red;
  font-weight: bold;
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
  font-size: 16px;
}
</style>